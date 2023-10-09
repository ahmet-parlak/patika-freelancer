const express = require('express');
const projectController = require('../controllers/projectController');
const projectValidator = require('../middlewares/validators/project');

const router = express.Router();

router.post('/', projectValidator, projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

module.exports = router;
