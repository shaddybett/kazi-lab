from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(100), nullable=False)
    middle_name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100), nullable=False)
    national_id = db.Column(db.Integer, nullable=True, unique=True)
    phone_number = db.Column(db.Integer, nullable=True, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String, nullable=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    role = db.relationship('Role', backref=db.backref('users', lazy=True))
    services = db.relationship('Service', secondary='provider_services', backref=db.backref('providers', lazy=True))
    

class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    service_name = db.Column(db.String(100), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class ProviderService(db.Model):
    __tablename__ = 'provider_services'
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)    

class Role(db.Model):
    __tablename__ = 'roles'    
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(100), nullable=False)






# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

# class User(db.Model):
#     __tablename__ = 'users'
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     first_name = db.Column(db.String(100), nullable=False)
#     middle_name = db.Column(db.String(100), nullable=True)
#     last_name = db.Column(db.String(100), nullable=False)
#     national_id = db.Column(db.BigInteger, nullable=True, unique=True)  # Consider BigInteger for larger numbers
#     phone_number = db.Column(db.String(15), nullable=True, unique=True)  # Adjust for international phone numbers
#     email = db.Column(db.String(100), nullable=False, unique=True)
#     password = db.Column(db.String(255), nullable=False)
#     image = db.Column(db.String, nullable=True)
#     role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
#     role = db.relationship('Role', backref=db.backref('users', lazy=True))
#     services = db.relationship('Service', secondary='provider_services', backref=db.backref('providers', lazy=True))

# class Service(db.Model):
#     __tablename__ = 'services'
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     service_name = db.Column(db.String(100), nullable=False)
#     provider_id = db.Column(db.Integer, db.ForeignKey('users.id'))

# class ProviderService(db.Model):
#     __tablename__ = 'provider_services'
#     service_id = db.Column(db.Integer, db.ForeignKey('services.id'), primary_key=True)
#     provider_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)    

# class Role(db.Model):
#     __tablename__ = 'roles'    
#     id = db.Column(db.Integer, primary_key=True)
#     role_name = db.Column(db.String(100), nullable=False)
