require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook")
const TwitterStrategy = require("passport-twitter")
const findOrCreate = require('mongoose-find-or-create')

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "this is our little secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
secret:Array,
googleId:String,
facebookId:String,
twitterId:String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate)

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// process.env.CLIENT_ID
//  process.env.CLIENT_SECRET
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET ,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
  

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));




passport.use(new FacebookStrategy({
    clientID:process.env.CLIENT_FACE_ID,
    clientSecret: process.env.CLIENT_FACE_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));



passport.use(new TwitterStrategy({
    consumerKey: process.env.CLIENT_TWITTER_ID,
    consumerSecret: process.env.CLIENT_TWITTER_SECRET,
    callbackURL: "https://0d31-103-120-116-203.eu.ngrok.io/auth/twitter/secrets"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));





app.get("/", (req, res) => {
  res.render("home");
});
app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });


app.get('/auth/facebook',
  passport.authenticate('facebook'));


app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });




app.get('/auth/twitter',
  passport.authenticate('twitter'));



app.get('/auth/twitter/secrets', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });



app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  // console.log(req.body)
User.register({username:req.body.username},req.body.password,(err,user)=>{
if(err){
console.log(err);
res.redirect("/register")
}else{
passport.authenticate("local")(req,res,()=>{
res.redirect("/secrets");
})
}

})
});

app.get("/secrets",(req,res)=>{
User.find({"secret":{$ne:null}},(err,found)=>{
if(err){
console.log(err)
}else{
let arr = []

found.forEach((obj)=>{

arr .push(...obj.secret)
})

res.render("secrets",{userwithsecrets :arr})
}

});})


app.get("/submit",(req,res)=>{
if(req.isAuthenticated()){
res.render("submit")
}else{
res.redirect("/login")
}
})

app.post("/submit",(req,res)=>{
const post_sec = req.body.secret

User.findById(req.user.id,(err,foundUser)=>{
if(err){
console.log(err)
}else{

if(foundUser){
foundUser.secret.push(post_sec)
foundUser.save(()=>{

res.redirect("/secrets");
})

}
}

})


})

app.get("/logout",(req,res)=>{
req.logout((err)=>{
if(err){console.log(err)
}
else{
res.redirect("/")
}

});

});

app.post("/login", (req, res) => {
const user = new User({
username:req.body.username,
password:req.body.password

})
req.login(user,(err)=>{
if(err){
console.log(err);
}
else{
passport.authenticate("local")(req,res,()=>{
res.redirect("/secrets")
})

}
})

});

app.listen(3000, () => {
  console.log("app is listen in post 3000");
});

