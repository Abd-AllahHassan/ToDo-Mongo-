const mongoose = require('mongoose');

// Task schema with timestamps
const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); // This will add createdAt and updatedAt fields

// Task model
module.exports = mongoose.model('Task', TaskSchema);
