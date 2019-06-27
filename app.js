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
// Load Models
const User = require('./models/user');
const Post = require('./models/post');
// Link passports to the server
require('./passport/google-passport');
require('./passport/facebook-passport');
require('./passport/instagram-passport');
// Link helpers
const {
  ensureAuthentication,
  ensureGuest
} = require('./helpers/auth');

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

app.get('/', ensureGuest,(req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});


app.get('/website', (req, res) => {
  res.render('website',{url:req.url == '/website'});
});

app.get('/fruitslice', (req, res) => {
  res.render('fruitslice');
});

app.get('/mathgame', (req, res) => {
  res.render('math');
});

app.get('/drawingapp', (req, res) => {
  res.render('drawing');
});

app.get('/dicegame', (req, res) => {
  res.render('dicegame');
});

app.get('/simongame', (req, res) => {
  res.render('simongame');
});

app.get('/musicgame', (req, res) => {
  res.render('musicgame');
});

app.get('/findgames', (req, res) => {
  res.render('findgames');
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
// instagram route
app.get('/auth/instagram',
  passport.authenticate('instagram'));

app.get('/auth/instagram/callback', 
  passport.authenticate('instagram',
    { 
       failureRedirect: '/' 
    }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });

// Handle profile route
app.get('/profile', ensureAuthentication,(req, res) => {
    User.findById({_id: req.user._id})
    .then((user) => {
        res.render('profile', {
            user:user
        });
    });
}); 
// Handle Route for all Users
app.get('/users', ensureAuthentication, (req, res) => {
  User.find({}).then((users) => {
    res.render('users', {
      users:users
    });
  });
});
//  Display one user profile
app.get('/user/:id', (req, res) => {
  User.findById({_id: req.params.id})
  .then((user) => {
    res.render('user', {
      user:user
    });
  });
});



//handle email post route
app.post('/addEmail' , (req, res) => {
    const email = req.body.email;
    User.findById({_id: req.user._id})
    .then((user) => {
        user.email = email;
        user.save()
        .then(() => {
            res.redirect('/profile');
        });
    });
});
// Handle Phone Post Route
app.post('/addPhone', (req, res) => {
  const phone = req.body.phone;
  User.findById({_id: req.user._id})
  .then((user) => {
    user.phone = phone;
    user.save()
    .then(() => {
      res.redirect('/profile');
    });
  });
});
// Handle Location Post Route
app.post('/addLocation', (req, res) => {
  const location = req.body.location;
  User.findById({_id: req.user._id})
  .then((user) => {
    user.location = location;
    user.save()
    .then(() => {
      res.redirect('/profile');
    });
  });
});
// Handle post routes for posts
app.get('/addPost', (req, res) => {
  res.render('addPost');
});

// Handle User logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});