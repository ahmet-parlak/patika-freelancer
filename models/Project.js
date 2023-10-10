const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: { type: String, required: true, trim: true, min: 1 },
  description: { type: String, trim: true, min: 1 },
  photo: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

ProjectSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id; // _id'yi id olarak değiştir
    delete ret._id;   // _id'yi sil
    delete ret.__v;   // __v'yi sil (sürüm kontrolü)
  },
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
