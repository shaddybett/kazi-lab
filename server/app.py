from flask import Flask, jsonify
from flask_restful import Api, Resource, request
from models import db,User

app = Flask(__name__)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jovial.db'
app.config['TRACK_MODIFICATIONS'] = False
db.init_app(api)


class Signup(Resource):
    def get(self):
        data = request.get_json()
        email = data.get('email')
        existing        
        


class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        existing = User.query.filter_by(email=email).first()