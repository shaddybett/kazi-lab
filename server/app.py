from flask import Flask,make_response
from flask_restful import Api, Resource, reqparse
from models import db,User
from flask_bcrypt import Bcrypt
import re
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager,create_access_token
from datetime import timedelta,datetime
import os


app = Flask(__name__)
api = Api(app)
bcrypt = Bcrypt(app)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jovial.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] =os.environ.get('secret_key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
db.init_app(app)
password_pattern = re.compile(r'(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$%@!*.!?])[A-Za-z\d$%@!*.!?]{8,}')
migrate = Migrate(app,db)
jwt = JWTManager(app)
jwt.init_app(app)

signup_parser = reqparse.RequestParser()
signup_parser.add_argument('first_name', type = str, required=True, help='First name is required')
signup_parser.add_argument('last_name',type=str,required=True,help='Last name is required')
signup_parser.add_argument('email',type=str,required=True,help='Email is required')
signup_parser.add_argument('password',type=str,required=True,help='Password is required')



class Signup(Resource):
    def post(self):
        args = signup_parser.parse_args()
        email = args['email']
        password = args['password']
        if email == '' or password =='':
            response = make_response({'error':'Fill in all forms'},401)
            return response
        existing_user = User.query.filter_by(email=email).first()
        if not password_pattern.match (password):
            response = make_response({'error':'Password must meet the required criteria'},401)
            return response
         
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        if existing_user:
            response = make_response({'error':'User already exists'},401)
            return response
        else:
            newUser = User (
                first_name = args['first_name'],
                last_name = args['last_name'],
                email = email,
                password = hashed_password
            )   
            db.session.add(newUser)
            db.session.commit()
            response = make_response({'message':'User Created Successfully'},201)
            return response
        
login_parse = reqparse.RequestParser()
login_parse.add_argument('email',type=str,required=True,help='email is required'),
login_parse.add_argument('password',type=str,required=True,help='Password is required')
class Login(Resource):
    def post(self):
        args = login_parse.parse_args()
        email = args['email']
        password = args['password']
        if email ==''or password =='':
            response = make_response({'error':'Fill in all forms'},401)
            return response
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user:
            response = make_response({'error':'Invalid email or password'},401)
            return response
        hashed_password = existing_user.password
        if bcrypt.check_password_hash(hashed_password,password):
            access_token = create_access_token(identity=email)
            response = make_response({'message':'Login Successful', 'access_token':access_token},200)
            return response
        else:
            response = make_response({'error':'Invalid email or password'},401)
            return response
api.add_resource(Signup,'/signup')
api.add_resource(Login,'/login')

if __name__=='__main__':
    app.run(debug=True,port=4000)




