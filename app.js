//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
//level 2(encrypting)
//var encrypt = require('mongoose-encryption');
//level 3(hashing MD5)
// const md5 = require('md5');
//level 4(hashing + salting)
const bcrypt = require('bcryptjs');
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

//level 2(encrypting)
// secretSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password']});
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
  
  // const hash = bcrypt.hashSync(req.body.password, salt);
  const userEmail=req.body.username;
  sec.findOne({email: userEmail})
    .then((docs)=>{
      bcrypt.compare(req.body.password, docs.password, function(err, result) {
        if( result === true){
        res.render('secrets');
        }
      });
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
  var pass;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        // Store hash in your password DB.
        const customer=new sec({
          email: req.body.username,
          password: hash
        });
        customer.save();
        res.render('secrets');
    });
  });
  //var hash = bcrypt.hashSync(req.body.password, salt);
  
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});