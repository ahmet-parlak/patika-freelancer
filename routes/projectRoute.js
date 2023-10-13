const express = require('express');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateProjectTitle,
  validateProjectDescription,
  validateProjectImage,
} = require('../middlewares/validators/project');

const router = express.Router();

router.all('*', authMiddleware);

router.post(
  '/',
  [validateProjectTitle, validateProjectDescription, validateProjectImage],
  projectController.create
);
router.put(
  '/:id',
  [validateProjectTitle, validateProjectDescription],
  projectController.update
);
router.delete('/:id', projectController.delete);

module.exports = router;
