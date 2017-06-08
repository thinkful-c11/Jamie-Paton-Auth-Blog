'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});

const userSchema = mongoose.Schema({
  userName: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  firstName: {type: String},
  lastName: {type: String}
});


blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
};

userSchema.methods.apiRepr = function() {
  return {
    userName: this.userName,
    firstName: this.firstName,
    lastName: this.lastName
  };
};

userSchema.method.validatePassword = function(password){
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password){
  return bcrypt.hash(password, 10);
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const User = mongoose.model('User', userSchema);

module.exports = {BlogPost, User};