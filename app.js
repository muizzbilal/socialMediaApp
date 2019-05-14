// Load Modules
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
// Connect to MongoURI exported from extrenal file
const keys = require('./config/keys');
// User collections
const User = require('./models/user');
// Link passports to the server
require('./passport/google-passport');
require('./passport/facebook-passport');
//  inialize applicaion
const app = express();
//Express config
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({ 
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//set global vars for user
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// setup template engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
// setup static file to serve css, javascript and images
app.set('view engine', 'handlebars');
//  connect to remote database
app.use(express.static('public'));
// connect to remote database
mongoose.Promise = global.Promise;

mongoose.connect(keys.MongoURI, {
    useNewUrlParser: true
})
.then(() => {
    console.log('Connected to remote database.....');
})
.catch((err) => {
    console.log(err);
});
//  set port
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

// google route
app.get('/auth/google',
  passport.authenticate('google', { 
      scope: ['profile', 'email'] 
    }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
      failureRedirect: '/' 
    }),

  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });

// facebook route
app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope: 'email'
    }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
      failureRedirect: '/' 
    }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });

// Handle profile route
app.get('/profile', (req, res) => {
    User.findById({_id: req.user._id})
    .then((user) => {
        res.render('profile', {
            user:user
        });
    });
}); 
// Handle User logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});