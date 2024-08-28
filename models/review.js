const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  username: String,
  rating: Number,
  comment: {
    type: String,
    required: true
  },
  date: { type: Date, default: Date.now() }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;