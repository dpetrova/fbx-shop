var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer')

var Fbx = require('../models/fbx')
let Category = require('../models/category')
var Cart = require('../models/cart')
var Order = require('../models/order')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home/index', {
    title: 'FbxShop'
  })
})

/* GET models page. */
router.get('/models', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  var gameModelsPromise = Category.findOne({ title: 'Games' }).populate('items')
  var movieModelsPromise = Category.findOne({ title: 'Movies' }).populate('items')

  Promise.all([gameModelsPromise, movieModelsPromise]).then(data => {
    var chunkSize = 3;
    var chunkGameModels = [];
    var chunkMovieModels = [];
    for (var i = 0; i < data[0].items.length; i+= chunkSize) {
      chunkGameModels.push(data[0].items.slice(i, i + chunkSize));
    }
    for (var i = 0; i < data[1].items.length; i+= chunkSize) {
      chunkMovieModels.push(data[1].items.slice(i, i + chunkSize));
    }

    res.render('fbx/index', {
      title: 'models',
      game:  chunkGameModels,
      movie: chunkMovieModels,
      successMsg: successMsg,
      noMessages: !successMsg
    })
  })
})


/* GET add-to-cart page. */
router.get('/add-to-cart/:id', function(req, res, next) {
  var itemId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Fbx.findById(itemId, function(err, item){
    if(err){
      return res.redirect('/');
    }
    cart.add(item, item.id);
    req.session.cart = cart;
    res.redirect('/models');
  })
})


/* GET reduce by one page. */
router.get('/reduce/:id', function(req, res, next) {
  var itemId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(itemId);
  req.session.cart = cart;
  res.redirect('/shopping-cart')
})


/* GET remove item page. */
router.get('/remove/:id', function(req, res, next) {
  var itemId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(itemId);
  req.session.cart = cart;
  res.redirect('/shopping-cart')
})


/* GET shopping-cart page. */
router.get('/shopping-cart', function(req, res, next) {
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {
      products: null
    })
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  })
})


/* GET checkout page. */
router.get('/checkout', isLoggedIn, function(req, res, next) {
  if(!req.session.cart){
    return res.redirect('/shopping-cart')
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errorMsg: errMsg, noErrors: !errMsg})
});


/* POST checkout page. */
router.post('/checkout', isLoggedIn, function(req, res, next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart')
  }

  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")(
    "sk_test_odRZY4daDni9fKkukkKWTnMB"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Charge for jacob.garcia@example.com"
  }, function(err, charge) {
    // asynchronously called
    if(err){
      req.flash('error', err.message);
      return res.redirect('/checkout')
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result){
      //if(err){
      //  req.flash('error', err.message);
      //  return res.redirect('/checkout')
      //}
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null; //clear the cart
      res.redirect('/models');
    });
  });
})


//POST contact page
router.post('/contact-us/send', function (req, res, next) {
  var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'fbx.shop.test@gmail.com',
      pass: 'mytopsecret'
    }
  }

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport(smtpConfig)

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: {
      name: req.body.contact_name,
      address: req.body.contact_email,
      phone: req.body.contact_message
    }, // sender address
    replyTo: req.body.contact_email,
    to: 'danipetrova76@gmail.com', // list of receivers
    subject: 'Fbx Shop', // Subject line
    text: `${req.body.contact_name} sent a message: \n` + req.body.contact_message // plaintext body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if ( error ) return console.log(error);
    res.redirect('/');
  })
})

module.exports = router;

//functions to protect the routes that should not be visible when is not authenticate
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
