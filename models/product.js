const mongoose = require('mongoose');
const { array } = require('../multer/productsMulter');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  cprice: Number,
  stockQuantity: Number,
  category: String,
  image: {
    type: Array
  },
  brand: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  cartQuantity: {
    type: Number,
    default: 0,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;