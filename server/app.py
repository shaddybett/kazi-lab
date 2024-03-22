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
        existing = User.query.filter_by(email=email).first()
        if existing:
            return jsonify ({'error':'Email already exists'})  
        else:
            newUser = User (
                first_name = data.get('first_name'),
                last_name = data.get('last_name'),
                email = email,
                password = data.get('password')
            )   
            db.session.add(newUser)
            db.session.commit()
            
        

