const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },

  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],

  blogs:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blogs'
    }
  ],

  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  },

  reviews:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],

  resetPasswordExpires: Date,
  resetPasswordToken: String
});

userSchema.plugin(plm);
module.exports = mongoose.model('Users', userSchema);