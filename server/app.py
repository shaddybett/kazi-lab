from flask import Flask
from flask_restful import Api
from models import db

app = Flask(__name__)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jovial.db'
app.config['TRACK_MODIFICATIONS'] = False
db.init_app(api)

