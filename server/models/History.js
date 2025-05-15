const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  mood: String,
  playlist: {
    name: String,
    id: String,
    url: String,
    image: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('History', HistorySchema);
