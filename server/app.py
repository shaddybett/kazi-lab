from flask import Flask, jsonify,make_response
from flask_restful import Api, Resource, reqparse
from models import db,User
from flask_bcrypt import Bcrypt
import re

app = Flask(__name__)
api = Api(app)
bcrypt = Bcrypt(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jovial.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db.init_app(app)
# password_pattern = re.compile(r'(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$%@!*.!?])[A-Za-z\d$%@!*.!?]{8,}$')

# signup_parser = reqparse.RequestParser()
# signup_parser.add_argument('first_name', type = str, required=True, help='First name is required')
# signup_parser.add_argument('last_name',type=str,required=True,help='Last name is required')
# signup_parser.add_argument('email',type=str,required=True,help='Email is required')
# signup_parser.add_argument('password',type=str,required=True,help='Password is required')

# class Signup(Resource):
#     def post(self):
#         args = signup_parser.parse_args()
#         email = args['email']
#         password = args['password']
#         existing_user = User.query.filter_by(email=email).first()
#         if not password_pattern.match (password):
#             response = make_response({'error':'Password must meet the desired criteria'}, 400)
#             return response
         
#         hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
#         if existing_user:
#             return jsonify({'error':'Email already exists'}),409
#         else:
#             newUser = User (
#                 first_name = args['first_name'],
#                 last_name = args['last_name'],
#                 email = email,
#                 password = hashed_password
#             )   
#             db.session.add(newUser)
#             db.session.commit()
#             return jsonify({'message':'User created successfully'}),201
        
# login_parse = reqparse.RequestParser()
# login_parse.add_argument('email',type=str,required=True,help='email is required'),
# login_parse.add_argument('password',type=str,required=True,help='Password is required')
# class Login(Resource):
#     def post(self):
#         args = login_parse.parse_args()
#         email = args['email']
#         password = args['password']
#         existing_user = User.query.filter_by(email=email).first()
#         if not existing_user:
#             return jsonify({'error':'Invalid email or password'}),401
#         hashed_password = existing_user.password
#         if bcrypt.check_password_hash(hashed_password,password):
#             return jsonify({'message':'Login successful'}),200
#         else:
#             return jsonify({'error':'Invalid email or password'}),401
# api.add_resource(Signup,'/signup')
# api.add_resource(Login,'/login')

# if __name__=='__main__':
#     app.run(debug=True,port=5000)



