var express = require('express');
var router = express.Router();
var csrf = require('csurf')
var passport = require('passport')

var Order = require('../models/order')
var Cart = require('../models/cart')

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET profile page. */
router.get('/profile', isLoggedIn, function(req, res, next){
  Order.find({user: req.user})
    .then((orders) => {
      var cart;
      orders.forEach(function(order){
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render('user/profile', {orders: orders});
    })
})

/* GET logout page. */
router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');
})

//the next routes will be accessible only if notLoggedIn
router.use('/', notLoggedIn, function(req, res, next){
  next();
})

/* GET signup page. */
router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
})

/* POST signup page. */
router.post('/signup', passport.authenticate('local.signup', {
  //successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/user/profile');
  }
});

/* GET signin page. */
router.get('/signin', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
})

/* POST signin page. */
router.post('/signin', passport.authenticate('local.signin', {
  //successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/user/profile');
  }
});

module.exports = router;

//functions to protect the routes that should not be visible when is not authenticate
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}