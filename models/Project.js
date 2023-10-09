const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: { type: String, required: true, trim: true, min: 1 },
  description: { type: String, trim: true, min: 1 },
  photo: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
