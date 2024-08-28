const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    productQuantity: Number,
    orderDate: { type: Date, default: Date.now() },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;







// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//     productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product"
//     },
//     productQuantity: Number,
//     orderDate: { type: Date, default: Date.now() },
// });

// const Cart = mongoose.model('Cart', cartSchema);

// module.exports = Cart;