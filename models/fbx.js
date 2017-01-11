const mongoose = require('mongoose');

var fbxSchema = mongoose.Schema({
  imagePath: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String},
  faces: {type: Number},
  price: {type: Number},
  rating: {type: Number},
  date: { type: Date, default: Date.now },
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true}
});

module.exports = mongoose.model('Fbx', fbxSchema)