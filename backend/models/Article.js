const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  originalUrl: String,
  isUpdated: { type: Boolean, default: false },
  references: [String],
  updatedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    default: null
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
