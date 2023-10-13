const User = require('../models/User');

module.exports = (req, res, next) => {
  User.findById(req.session.userID)
    .then((user) => {
      if (!user) return res.status(401).redirect('/login');

      next();
    })
    .catch((err) => {});
};
