from models import User,db
from app import app

with app.app_context():
    new_user = User(
        first_name='salman',
        last_name='khan',
        email='khan@gmail.com',
        password='12345'
    )
    db.session.add(new_user)
    db.session.commit()