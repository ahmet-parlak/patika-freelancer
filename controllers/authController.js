const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/User');

exports.register = async (req, res) => {
  if ((await User.countDocuments()) > 0) return res.redirect('/login');

  //Validation
  const errors = [];
  validationResult(req)
    .array()
    .forEach((error) => {
      errors.push(error.msg);
    });

  if (errors.length != 0) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  //Insertion
  User.create(req.body)
    .then(() => {
      req.flash(
        'success',
        'You have successfully registered! You can log in with your username and password.'
      );
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);

      req.flash('errors', ['Somethings wrong']);
      res.redirect('/login');
    });
};

exports.login = async (req, res) => {
  //Validation
  const errors = [];
  validationResult(req)
    .array()
    .forEach((error) => {
      errors.push(error.msg);
    });

  if (errors.length != 0) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username });

  if (user) {
    bcrypt
      .compare(password, user.password)
      .then((isCorrect) => {
        if (isCorrect) {
          req.session.userID = user.id;

          req.flash('success', 'Login successful!');
          return res.redirect('/#portfolio');
        } else {
          req.flash('errors', ['Username or password incorrect!']);
          return res.redirect('/login');
        }
      })
      .catch((err) => {
        console.log(err);
        req.flash('errors', ['Something is wrong. Please try again later!']);
        return res.redirect('/login');
      });
  } else {
    req.flash('errors', ['Username or password incorrect!']);
    return res.redirect('/login');
  }
};

exports.logout = async (req, res) => {
  req.session.destroy(() => {
    res.status(200).redirect('/');
  });
};
