const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const { getValidationErrors } = require('../helpers/validationHelpers');
const { generateRandomImageName } = require('../helpers/projectHelpers');

const rootDir = path.dirname(require.main.filename);
const uploadDir = 'public/assets/img/portfolio';
const photoDir = '/assets/img/portfolio';

exports.create = async (req, res) => {
  const validationErrors = getValidationErrors(req);

  if (validationErrors.length > 0)
    return res.status(400).json({
      status: 'error',
      message: 'validation error',
      data: validationErrors,
    });

  const image = req.files.image;

  try {
    const imageName = generateRandomImageName(image.name);
    const path = `${rootDir}/${uploadDir}/${imageName}`;

    await savePhoto(image, path);

    const project = await Project.create({
      ...req.body,
      photo: `${photoDir}/${imageName}`,
    });

    const data = {
      id: project._id,
      title: project.title,
      description: project.description,
      photo: project.photo,
    };

    res.status(201).json({
      status: 'success',
      message: 'Project successfully added to portfolio.',
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'Something is wrong! Please try again later.',
    });
  }
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
        removePhoto(oldPhotoDir); //Remove old photo

        const image = req.files.image;
        const imageName = generateRandomImageName(image.name);
        const newPhotoDir = `${rootDir}/${uploadDir}/${imageName}`;
        const newPhotoUrl = `${photoDir}/${imageName}`;

        try {
          savePhoto(image, newPhotoDir);
          project.photo = newPhotoUrl;
        } catch (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Something is wrong! Please try again later.',
          });
        }
      }
      project.title = title;
      project.description = description;

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
      removePhoto(imgDir);
      return res.status(200).json({
        status: 'success',
        message: `Project titled '${project.title}' removed from portfolio.`,
      });
    })
    .catch(() =>
      res.status(400).json({ status: 'error', message: 'Project not found!' })
    );
};

function savePhoto(image, path) {
  return new Promise((resolve, reject) => {
    image.mv(path, (err) => {
      if (err) reject();

      resolve();
    });
  });
}

function removePhoto(directory) {
  if (fs.existsSync(directory)) fs.unlinkSync(directory); //Remove photo if exists
}
