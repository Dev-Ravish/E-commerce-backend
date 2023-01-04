const User = require('../models/user');
const { body, validationResult } = require('express-validator');

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req, res) => {
  console.log(req);
  errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: 'NOT able to save user.',
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: 'The email id provided does not exists' });
    }

    if (!user.authenticate(password)) {
      return res.json({ error: 'email and password does not match.' });
    }

    //setting token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //adding token to the cookie
    res.cookie('token', token, { expire: new Date() + 10 });

    //sending responses to the frontend
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'Signout successfully !!',
  });
};

//protected route

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: 'auth',
});

//custom middleware

exports.isAutherised = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.send('ACCESS DENIED HELLO');
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.send('Please contact the ADMIN for entering this section.');
  }
  next();
};
