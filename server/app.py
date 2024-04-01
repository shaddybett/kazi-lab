from flask import Flask,make_response,abort
from flask_restful import Api, Resource, reqparse
from models import db,User,Service,ProviderService
from flask_bcrypt import Bcrypt
import re
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager,create_access_token,jwt_required,get_jwt_identity
from datetime import timedelta
import os
from sqlalchemy import func


app = Flask(__name__)
api = Api(app)
bcrypt = Bcrypt(app)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:shady42635509@localhost:5432/kazi_konnect'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] =os.environ.get('secret_key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
db.init_app(app)
password_pattern = re.compile(r'(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$%@!*.!?])[A-Za-z\d$%@!*.!?]{8,}')
email_pattern = re.compile(r'[\w-]+(\.[w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}')
migrate = Migrate(app,db)
jwt = JWTManager(app)
jwt.init_app(app)

signup_parser = reqparse.RequestParser()
signup_parser.add_argument('first_name', type = str, required=True, help='First name is required')
signup_parser.add_argument('last_name',type=str,required=True,help='Last name is required')
signup_parser.add_argument('email',type=str,required=True,help='Email is required')
signup_parser.add_argument('password',type=str,required=True,help='Password is required')
signup_parser.add_argument('selectedRole',type=int,required=True,help='Role is required')
signup_parser.add_argument('service_name',type=str,required=False,help='service name is required')


class Signup(Resource):
    def post(self):
        args = signup_parser.parse_args()
        email = args['email']
        password = args['password']
        first_name = args['first_name']
        last_name = args['last_name']
        role_id = args['selectedRole']
        service_name = args['service_name']

        if not all([email, password, first_name, last_name, role_id]):
            response = make_response({'error': 'Fill in all forms'}, 401)
            return response

        if not password_pattern.match(password):
            response = make_response({'error': 'Password must meet the required criteria'}, 401)
            return response

        if not email_pattern.match(email):
            response = make_response({'error': 'Invalid email format'}, 401)
            return response

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            response = make_response({'error': 'Email already exists'}, 401)
            return response

        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=hashed_password,
            role_id=role_id
        )

        db.session.add(new_user)
        db.session.commit()

        if role_id == 2 and service_name:
            service = Service.query.filter_by(service_name=service_name).first()
            if service:
                provider_service = ProviderService(
                    provider_id=new_user.id,
                    service_id=service.id
                )
                db.session.add(provider_service)
                db.session.commit()  

        user_id = new_user.id

        response = make_response({'message': 'User Created Successfully', 'user_id': user_id}, 201)
        return response
        
login_parse = reqparse.RequestParser()
login_parse.add_argument('email',type=str,required=True,help='email is required'),
login_parse.add_argument('password',type=str,required=True,help='Password is required')

class Login(Resource):
    def post(self):
        args= login_parse.parse_args()
        email =  args['email']
        password = args['password']
        if email =='' or password=='':
            response = make_response({'error':'Fill in all forms'},401)
            return response
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user:
            response = make_response({'error':'Invalid email or password'},401)
            return response
        hashed_password = existing_user.password
        if existing_user and bcrypt.check_password_hash(hashed_password,password):
            access_token=create_access_token(identity=email)
            role_id = existing_user.role_id
            response = make_response({'message':'Login successful','access_token':access_token,'role_id':role_id},200)
            return response
        response = make_response({'error':'Invalid email or password'},401)
        return response
class Dashboard(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        if user:
            response = make_response({'first_name':user.first_name,'last_name':user.last_name,'email':user.email,'role_id':user.role_id,'phone_number':user.phone_number})
            return response
        else:
            response = make_response({'error':'Error fetching user details'},404)
            return response

service_parser = reqparse.RequestParser()
service_parser.add_argument('service_name', type=str, required=True, help='Service name is required')
service_parser.add_argument('existing_services', type=int, action='append', required=False, help='Existing services must be a list of integers representing service IDs')

class ServiceResource(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        
        if not user:
            abort(404, {'error': 'User not found'})
        
        args = service_parser.parse_args()
        new_service_name = args['service_name']
        existing_services = args['existing_services'] or []  # Defaults to an empty list if no existing services provided
        
        if not existing_services and not new_service_name:
            abort(400, {'error': 'At least one service must be provided'})
        
        for service_id in existing_services:
            service = Service.query.get(service_id)
            if service:
                provider_service = ProviderService(
                    provider_id=user.id,
                    service_id=service.id
                )
                db.session.add(provider_service)
        
        if new_service_name:
            existing_service = Service.query.filter(func.lower(Service.service_name) == func.lower(new_service_name)).first()
            if existing_service:
                abort(401, {'error': f'Service "{new_service_name}" already exists, kindly check the list provided'})
            
            new_service = Service(
                service_name=new_service_name,
                provider_id=user.id
            )
            db.session.add(new_service)
            db.session.flush()
            provider_service = ProviderService(
                provider_id=user.id,
                service_id=new_service.id
            )
            db.session.add(provider_service)
        
        db.session.commit()
        
        return {'message': f'Services created and associated with {user.first_name} {user.last_name}'}, 201

# service_parser = reqparse.RequestParser()
# service_parser.add_argument('service_name',type=str,required=True,help='Service name is required')
# service_parser.add_argument('existing_services',type=str,required=True,help='Existing_services required')

# class ServiceResource(Resource):
#     @jwt_required()
#     def post(self):
#         current_user = get_jwt_identity()
        
#         user = User.query.filter_by(email=current_user).first()
#         if not user:
#             response = make_response({'error':'User not found'})
#             return response
        
        
#         args = service_parser.parse_args()
#         new_service_name = args['service_name']
#         existing_services = args['existing_services']
#         if not existing_services and not new_service_name:
#             response = make_response({'error': 'At least one service must be provided'}, 400)
#             return response
#         if existing_services:
#             for service_id in existing_services:
#                 service = Service.query.get(service_id)
#                 if service:
#                     provider_service = ProviderService(
#                         provider_id=user.id,
#                         service_id=service.id
#                     )
#                     db.session.add(provider_service)

        
#         if new_service_name:
#             # Check if the new service name already exists
#             existing_service = Service.query.filter(func.lower(Service.service_name) == func.lower(new_service_name)).first()
#             if existing_service:
#                 response = make_response({'error': f'Service "{new_service_name}" already exists, kindly check the list provided'}, 401)
#                 return response
            
#             # If the service doesn't exist, add it to the database and associate it with the provider
#             new_service = Service(
#                 service_name=new_service_name,
#                 provider_id = user.id
#             )
#             db.session.add(new_service)
#             db.session.flush()
#             provider_service = ProviderService(
#                 provider_id=user.id,
#                 service_id=new_service.id
#             )
#             db.session.add(provider_service)
        
#         db.session.commit()
        
#         response = make_response({'message': f'Services created and associated with {user.first_name} {user.last_name}'}, 201)
#         return response

    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        if not user:
            return {'error': 'User not found'}, 404

        # user_services = [(service.id,service.service_name) for service in user.services]
        all_services = Service.query.all()
        # all_services_data = [{'id': service.id, 'name': service.service_name} for service in all_services]
        all_services_data = [(service.id, service.service_name) for service in all_services]


        # response = make_response({'user_services': user_services, 'all_services': all_services_data})
        response = make_response({'all_services': all_services_data})
        return response


api.add_resource(Signup,'/signup')
api.add_resource(Login,'/login')
api.add_resource(Dashboard,'/dashboard')
api.add_resource(ServiceResource,'/service')

if __name__=='__main__':
    app.run(debug=True,port=4000)



