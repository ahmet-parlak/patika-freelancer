const { getAllProjects } = require('./projectController');
const User = require('../models/User');

exports.getIndexPage = async (req, res) => {
  const projects = await getAllProjects();
  res.status(200).render('index', { projects });
};

exports.getLoginPage = async (req, res) => {
  const userCount = await User.countDocuments();

  if (userCount) {
    res.status(200).render('login');
  } else {
    res.status(200).render('register');
  }
};
