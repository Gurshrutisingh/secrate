//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
const app = express();
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/secretsDB');
}
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
const secretSchema = new mongoose.Schema({
  email: String,
  password: String
});


secretSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password']});
const sec= mongoose.model('secret', secretSchema );
//TODO
app.get("/",function (req,res) {
  res.render('home');
});
app.route("/login")
.get(function (req,res) {
  res.render('login');
})
.post(function (req,res) {
  const userEmail=req.body.username;
  const userPassword=req.body.password;
  secret.findOne({email: userEmail})
    .then((docs)=>{
      if(docs.password===userPassword)
      {
        res.render('secrets');
      }
      else
      {
        res.render('login');
      }
    })
    .catch(()=>{
      res.render('register');
    });
  
});
app.route("/register")
.get(function (req,res) {
  res.render('register');
})
.post(function (req,res) {
  console.log(req.body.username);
  console.log(req.body.password);
  const customer=new sec({
    email: req.body.username,
    password: req.body.password
  });
  customer.save();
  res.render('secrets');
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});