const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const { getValidationErrors } = require('../helpers/validationHelpers');

const rootDir = path.dirname(require.main.filename);
const uploadDir = 'public/assets/img/portfolio';
const photoDir = '/assets/img/portfolio';

exports.create = (req, res) => {
  const validationErrors = getValidationErrors(req);

  if (validationErrors.length > 0)
    return res.status(400).json({
      status: 'error',
      message: 'validation error',
      data: validationErrors,
    });

  const image = req.files.image;
  const imageName =
    (Math.random() + 1).toString(36).substring(7) + '_' + image.name;
  image.mv(`${rootDir}/${uploadDir}/${imageName}`, (err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Something is wrong! Please try again later.',
      });
    }

    Project.create({ ...req.body, photo: `${photoDir}/${imageName}` })
      .then((doc) =>
        res.status(201).json({
          status: 'success',
          message: 'The project was successfully created.',
          data: {
            id: doc._id,
            title: doc.title,
            description: doc.description,
            photo: doc.photo,
          },
        })
      )
      .catch((err) => {
        console.log(err);

        res.status(500).json({
          status: 'error',
          message: 'Something is wrong! Please try again later.',
        });
      });
  });
};
exports.update = (req, res) => {};
exports.delete = (req, res) => {
  const projectId = req.params.id;

  Project.findByIdAndDelete(projectId)
    .then((project) => {
      const imgDir = rootDir + '/public/' + project.photo; //Project photo directory
      if (fs.existsSync(imgDir)) fs.unlinkSync(imgDir); //Delete photo if exists

      return res.status(200).json({
        status: 'success',
        message: `Project titled '${project.title}' removed from portfolio.`,
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json({ status: 'error', message: 'Project not found!' });
    });
};
