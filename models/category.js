const mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String},
  items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Fbx'}]
});

module.exports = mongoose.model('Category', categorySchema)
