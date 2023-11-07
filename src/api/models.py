from flask_sqlalchemy import SQLAlchemy
from flask import current_app
from datetime import datetime, timedelta

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    birthdate = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    profile = db.relationship('Profile', backref='user', uselist=False)

    def __init__(self,username,email,password,birthdate):
        self.username = username
        self.email = email
        self.password = password
        self.birthdate = birthdate
        self.is_active = True
    
    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "birthdate": self.birthdate,
            "registration_date": self.registration_date,
            # do not serialize the password, its a security breach
        }
    
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    about_me = db.Column(db.String(250), unique=False, nullable=False)
    image = db.Column(db.String(240), nullable=True)
    favorite_games = db.Column(db.String(50), unique=False, nullable=False)
    region = db.Column(db.String(50), unique=False, nullable=False)
    platform = db.Column(db.String(50), unique=False, nullable=False)
    contact = db.Column(db.String(50), unique=False, nullable=False)
    post_id = db.relationship('Post_user', backref='post', lazy=True)
    profile_comments = db.relationship('Comment', backref='profile_comment', lazy=True)

    def __repr__(self):
        return f'<Profile {self.id}>'

    def serialize(self):
        user = User.query.get(self.user_id)
        return {
            "id": self.id,
            "user_id": self.user_id,
            "about_me": self.about_me,
            "image": self.image,
            "favorite_games": self.favorite_games,
            "region": self.region,
            "platform": self.platform,
            "contact": self.contact,
            "username": user.username,
            "birthdate": user.birthdate,
            "email": user.email,
            "registration_date": user.registration_date,
            "post_id": list(map(lambda post: post.serialize(), self.post_id)),
            # do not serialize the password, its a security breach
        }
    

    def update(self, about_me, image, favorite_games, region, contact, platform):
        self.about_me = about_me
        self.image = image
        self.favorite_games = favorite_games
        self.region = region
        self.contact = contact
        self.platform = platform
        print(about_me, image, favorite_games, region, contact, platform)
        try:
            db.session.commit()
            return True
        except Exception as error:
            db.session.rollback()
            return False

    
class Post_user(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_title = db.Column(db.String(150), unique=True, nullable=False)
    post_game = db.Column(db.String(150))
    post_description = db.Column(db.String(400), unique=True, nullable=False)
    posted = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('profile.id'))
    post_comments = db.relationship('Comment', backref='post_comment', lazy=True)

    def serialize(self):
        profile = Profile.query.get(self.user_id)
        user = User.query.get(profile.user_id)
        return {
            "id": self.id,
            "posted": self.posted,
            "username": user.username,
            "image": profile.image,
            "profile_user_id": profile.user_id,
            "user_id": self.user_id,
            "region": profile.region,
            "contact": profile.contact,
            "platform": profile.platform,
            "post_title": self.post_title,
            "post_game": self.post_game,
            "post_description": self.post_description,
            "comments": [comment.serialize() for comment in self.post_comments]
        }

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.utcnow) #fecha de creacion
    comment_content = db.Column(db.String(400))
    author_id = db.Column(db.Integer, db.ForeignKey("profile.id"))
    post_id = db.Column(db.Integer, db.ForeignKey("post_user.id"))

    def serialize(self):
        profile = Profile.query.get(self.author_id)
        user = User.query.get(profile.user_id)
        return {
            "id": self.id,
            "username": user.username,
            "image": profile.image,
            "author_id": self.author_id,
            "created": self.created,
            "comment_content": self.comment_content,
            "post_id": self.post_id,
        }
   