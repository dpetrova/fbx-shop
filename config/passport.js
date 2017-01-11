var passport = require('passport');
var User = require('../models/user')
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

//User Sign Up
passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'pass',
  passReqToCallback: true
}, function(req, email, password, done){
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('pass', 'Invalid password').notEmpty().isLength({min:6});
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach(function(error){
      messages.push(error.msg);
    })

    return done(null, false, req.flash('error', messages))
  }

  User.findOne({'email': email}, function(err, user){
    //if error
    if(err){
      return done(err);
    };
    //if already exist user with such email
    if(user){
      return done(null, false, {message: 'Email is already in use.'})
    }

    //create new user
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function(err, result){
      if(err){
        return done(err);
      }

      return done(null, newUser);
    })
  })
}))

//User Sign In
passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'pass',
  passReqToCallback: true
}, function(req, email, password, done){
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('pass', 'Invalid password').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach(function(error){
      messages.push(error.msg);
    })

    return done(null, false, req.flash('error', messages))
  }

  User.findOne({'email': email}, function(err, user){
    //if error
    if(err){
      return done(err);
    };
    //if user does not exist
    if(!user){
      return done(null, false, {message: 'No user found.'})
    }
    //if password does not match
    if(!user.validPassword(password)){
      return done(null, false, {message: 'Wrong password.'})
    }

    return done(null, user);
  })
}))