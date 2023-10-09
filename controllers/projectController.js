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
          message: 'Project successfully added to portfolio.',
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

exports.update = (req, res) => {
  const projectId = req.params.id;
  const { title, description, image } = req.body;

  const validationErrors = getValidationErrors(req);

  //Form validation
  if (validationErrors.length > 0)
    return res.status(400).json({
      status: 'error',
      message: 'validation error',
      data: validationErrors,
    });

  //Find project and update
  Project.findById(projectId)
    .then(async (project) => {
      //If photo updated
      if (req.files && Object.keys(req.files).length !== 0) {
        const oldPhotoDir = rootDir + '/public/' + project.photo; //Old photo directory
        if (fs.existsSync(oldPhotoDir)) fs.unlinkSync(oldPhotoDir); //Remove old photo

        const image = req.files.image;
        const imageName =
          (Math.random() + 1).toString(36).substring(7) + '_' + image.name;
        const newPhotoDir = `${rootDir}/${uploadDir}/${imageName}`;
        const newPhotoUrl = `${photoDir}/${imageName}`;

        //Save new image
        image.mv(newPhotoDir, (err) => {
          if (err) {
            return res.status(500).json({
              status: 'error',
              message: 'Something is wrong! Please try again later.',
            });
          }
          //update photo & title & description
          project.photo = newPhotoUrl;
          project.title = title;
          project.description = description;

          saveProject();
        });
      } else {
        //update just title & description
        project.title = title;
        project.description = description;
        saveProject();
      }

      function saveProject() {
        project
          .save()
          .then((updatedProject) =>
            res.status(200).json({
              status: 'success',
              message: 'Project updated',
              data: updatedProject,
            })
          )
          .catch((err) => {
            console.log(err);

            res.status(500).json({
              status: 'error',
              message: 'Something is wrong! Please try again later.',
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ status: 'error', message: 'Project not found!' });
    });
};

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
    .catch(() =>
      res.status(400).json({ status: 'error', message: 'Project not found!' })
    );
};
