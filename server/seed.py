from models import User,db,Role
from app import app

with app.app_context():
    new_user = User(
        first_name='salman',
        last_name='khan',
        email='khan@gmail.com',
        password='12345'
    )
    # db.session.add(new_user)
    # db.session.commit()

    roles = []
    for role_name in ['admin','provider','client']:
        role = Role(role_name=role_name)
        roles.append(role)

        db.session.add_all(roles)
        db.session.commit()

        
