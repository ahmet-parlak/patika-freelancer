const { getAllProjects } = require('./projectController');

exports.getIndexPage = async (req, res) => {
  const projects = await getAllProjects();
  res.status(200).render('index', { projects });
};
