const mongoose = require('mongoose');
const { stringify } = require('querystring');

const itemSchema = mongoose.Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, required: true },
  created_by: {type: String, required: true},
  detected_loc: {
    type: { type: String },
    coordinates: []
  },
  provided_loc: {
    type: { type: String },
    coordinates: []
  },
  location: {type: String, required: true}
},
{
  timestamps:
  {
    createdAt: 'created_at'
  }
});

itemSchema.index({ "detected_loc": "2dsphere" });
itemSchema.index({ "provided_loc": "2dsphere" });


module.exports = mongoose.model('Item', itemSchema);
