const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loc: {
    type: { type: String },
    coordinates: []
  }
},
{
  timestamps:
  {
    createdAt: 'created_at'
  }
});

itemSchema.index({ "loc": "2dsphere" });


module.exports = mongoose.model('Item', itemSchema);
