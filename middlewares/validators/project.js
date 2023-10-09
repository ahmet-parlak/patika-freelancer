const { body } = require('express-validator');

module.exports = [
  body('title').trim().notEmpty().withMessage('Please enter project title!'),
  body('description')
    .trim()
    .isLength({
      max: 750,
    })
    .withMessage('The description field can have up to 750 characters!'),
  body('image').custom((value, { req }) => {
    if (!req.files || Object.keys(req.files).length === 0)
      throw new Error('Please select a project photo!');
    return true;
  }),
];
