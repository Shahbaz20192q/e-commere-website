var express = require('express');
var router = express.Router();

const passport = require('passport');
const localStrategy = require('passport-local');
const crypto = require('crypto');
const nodemailer = require('nodemailer')
const { normalize } = require('path');

const userModel = require('../models/users');
const productModel = require('../models/product');
const orderModel = require('../models/order');
const reviewModel = require('../models/review');
const categoryModel = require('../models/category');
const blogModel = require('../models/blogs');
const cartModel = require('../models/cart');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', async function (req, res, next) {
  // const user = await userModel.findOne({ username: req.session.passport.user });
  // const cartItems = await cartModel.find({ user: user._id }).populate('productId');
  res.render('index', { title: 'Register' });
});

router.get('/login', async function (req, res, next) {
  // const user = await userModel.findOne({ username: req.session.passport.user });
  // const cartItems = await cartModel.find({ user: user._id }).populate('productId');
  res.render('login', { title: 'Login' });
});

router.post('/', function (req, res, next) {
  try {
    var userdata = new userModel({
      username: req.body.username,
      email: req.body.email,
    })
    userModel.register(userdata, req.body.password).then(function () {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/home');
      })
    })
  } catch (error) {
    console.log(error.message);
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}), function (req, res, next) { });

// router.get('/profile',isoggedIn ,function (req, res, nex) {
//   res.send('Profile')
// });

router.get('/logout', function (req, res, nex) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});


// Forgot password

router.get('/forgot', function (req, res, next) {
  res.render('forgot')
})

router.post('/forgot', function (req, res, next) {
  crypto.randomBytes(20, function (err, buf) {
    const token = buf.toString('hex');
    userModel.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email address exists.");
          return res.redirect("/forgot");
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 Hour

        return user.save();
      })
      .then(function () {
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "shahbazghaffar00@gmail.com",
            pass: "dkaj rbhk krvw bwpg",
          },
        });
        const mailOptions = {
          to: req.body.email,
          from: "shahbazghaffar00@gmail.com",
          subject: "Password Reset",
          text: "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            `http://${req.headers.host}/reset/${token}\n\n` +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        return transporter.sendMail(mailOptions);
      })
      .then(() => {
        req.flash("Info", "An email has been sent with further instructions.");
        res.redirect('/login');
      })
      .catch(err => {
        // Handle errors
        console.error(err);
        req.flash("error", "An error occurred.");
        // res.redirect("/forgot");
      });
  })
});

router.get("/reset/:token", function (req, res) {
  userModel.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
    .then(function (user) {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot");
      }
      res.render('reset', { token: req.params.token });
    })
    .catch(err => {
      // Handle errors
      console.error(err);
      req.flash("error", "An error occurred.");
      res.redirect("/forgot");
    });
})

router.post('/reset/:token', function (req, res, next) {
  userModel.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then(user => {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("back");
      }
      user.setPassword(req.body.password, function () {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        return user.save();
      })
    })
    .then(() => {
      req.logIn(user, function (err) {
        res.redirect("/");
      });
    })
    .catch(err => {
      // Handle errors
      console.error(err);
      req.flash("error", "An error occurred.");
      res.redirect("/forgot");
    });
});

// ***************** Other pages *******************

router.get('/home', isoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const cartItems = await cartModel.find({ user: user._id }).populate('productId');
  res.render('home', { title: 'Home', cartItems: cartItems });
});

router.get('/shop', isoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const cartItems = await cartModel.find({ user: user._id }).populate('productId');
  const products = await productModel.find()
  res.render('shop', { title: 'Shop', products: products, cartItems: cartItems });
});

router.get('/shop/:id', isoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const cartItems = await cartModel.find({ user: user._id });
  const review = await reviewModel.find()

  const product = await productModel.findOne({ _id: req.params.id }).populate('reviews');
  res.render('./pages/one_product', { title: product.title, product: product, cartItems, review });
});

router.post('/shop/:id/review', isoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const cartItems = await cartModel.find({ user: user._id });
  const product = await productModel.findOne({ _id: req.params.id });

  let review = await reviewModel.create({
    comment: req.body.comment,
    user: user._id,
    username: user.username,
    product: product._id
  });
  user.reviews.push(review._id)
  product.reviews.push(review._id)
  await product.save()
  await user.save()

  res.render('./pages/review_thanks', { title: "Thank You For Review", product: product, cartItems, review });
});

router.get('/blog', isoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const cartItems = await cartModel.find({ user: user._id }).populate('productId');

  const blogs = await blogModel.find();
  res.render('blog', { title: 'Blogs', blogs: blogs, cartItems });
});

router.get('/blog/:id', isoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const cartItems = await cartModel.find({ user: user._id }).populate('productId');

  const blogs = await blogModel.findOne({ _id: req.params.id });
  res.render('./pages/one_blog', { title: blogs.title, blogs: blogs, cartItems });
});

router.get('/about', isoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const cartItems = await cartModel.find({ user: user._id }).populate('productId');

  res.render('about', { title: 'About Us', cartItems });
});

router.get('/contact', isoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const cartItems = await cartModel.find({ user: user._id }).populate('productId');

  res.render('contact', { title: 'Contact Us', cartItems });
});


router.get('/cart', isoggedIn, async function (req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const cartItems = await cartModel.find({ user: user._id }).populate('productId');
    res.render('cart', { title: 'Cart', cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Update Cart route
router.post('/cart/update/:id', isoggedIn, async function (req, res, next) {
  try {
    const productId = req.params.id;
    const newQuantity = req.body.newQuantity;

    // Check if the user is logged in
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    // Update the product quantity in the cart
    const cartItem = await cartModel.findOneAndUpdate(
      { productId, user: req.user._id },
      { productQuantity: newQuantity },
      { new: true }
    );

    if (cartItem) {
      // If the update is successful, send a success response
      res.status(200).send("Cart updated successfully");
    } else {
      // If the cart item is not found, send a not found response
      res.status(404).send("Cart item not found");
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Add to Cart route
router.post('/cart/add/:id', isoggedIn, async function (req, res, next) {
  try {
    const productId = req.params.id;
    const newQuantity = req.body.cartQuantity || 1;

    // Check if the user is logged in
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    // Find or create the cart item
    let cartItem = await cartModel.findOne({ productId, user: req.user._id });

    if (!cartItem) {
      // If the cart item doesn't exist, create a new one
      cartItem = await cartModel.create({
        productId,
        productQuantity: newQuantity,
        user: req.user._id,
      });
    } else {
      // If the cart item already exists, update the quantity
      cartItem = await cartModel.findOneAndUpdate(
        { productId, user: req.user._id },
        { productQuantity: newQuantity },
        { new: true }
      );
    }

    // Redirect to the cart page after adding to the cart
    res.redirect('/cart');
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.get('/delete_icon/:id', isoggedIn, async function (req, res, next) {
  let product = await cartModel.findOneAndDelete({ _id: req.params.id })

  res.redirect('/cart')
})

router.post('/contact_form', isoggedIn, function (req, res, next) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "shahbazghaffar00@gmail.com",
      pass: "dkaj rbhk krvw bwpg",
    }
  });

  const name = req.body.name;
  const message = req.body.message;
  const mailOptions = {
    from: req.body.email,
    to: "shahbazghaffar00@gmail.com",
    subject: req.body.subject,
    text: `Name : ${name}\n\n Message : ${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error occurred:', error);
    }
    console.log('Message sent successfully!');
    console.log('Message info:', info);
  });
  res.redirect('/contact')
})


router.get('/address', isoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const cartItems = await cartModel.find({ user: user._id }).populate('productId');

  res.render('checkout', { title: 'Address', cartItems });
});

router.get('/payment', isoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const cartItems = await cartModel.find({ user: user._id }).populate('productId');

  res.render('payment', { title: 'Address', cartItems });
});

// *************** Middel wear *****************

function isoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login")
}


module.exports = router;