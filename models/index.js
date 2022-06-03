const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   firstname: {
      type: String,
      required: true
   },
   lastname: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   dob: {
      type: Date,
      required: true
   },
   isSuspended: {
      type: Boolean,
      required: true
   }
});

const ArticleSchema = new Schema({
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   title: {
      type: String,
      required: true
   },
   body: {
      type: String,
      required: true
   },
  
   date: {
      type: Date,
      required: true
   },
   comments: [{ 
      content:{
         type: String,
         required: true
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      date: {
         type: Date,
         required: true
      },
     
   }],
});



const User = mongoose.model("User", UserSchema);
const Article = mongoose.model("Article", ArticleSchema);

module.exports = {User, Article}