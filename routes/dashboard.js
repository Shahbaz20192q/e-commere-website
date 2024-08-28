var express = require('express');
var router = express.Router();
const path = require('path');

const upload = require('../multer/productsMulter');
const blogUploadImg = require('../multer/blogsMulter')

const userModel = require('../models/users');
const productModel = require('../models/product');
const orderModel = require('../models/order');
const reviewModel = require('../models/review');
const categoryModel = require('../models/category');
const blogModel = require('../models/blogs');

router.get('/dashboard', isAdmin, function (req, res, next) {
    res.render('./dashboard/dashboard', { title: 'Dashboard' });
});

router.get('/dashboard/order', isAdmin, function (req, res, next) {
    res.render('./dashboard/order', { title: 'Orders' });
});

router.get('/dashboard/products', isAdmin, async function (req, res, next) {
    const products = await productModel.find();
    res.render('./dashboard/products', { title: 'Products', products });
});

router.get('/dashboard/products/add', isAdmin, async function (req, res, next) {
    res.render('./dashboard/add_product', { title: 'Add Product' });
});

router.get('/dashboard/products/edit/:id', isAdmin, async function (req, res, next) {
    const product = await productModel.findOne({ _id: req.params.id });
    res.render('./dashboard/edit_product', { title: 'Add Product', product });
});

router.get('/dashboard/product/delete/:id', isAdmin, async function (req, res, next) {
    const product = await productModel.findOneAndDelete({ _id: req.params.id });
    res.redirect('/dashboard/products');
});

router.post('/dashboard/product/edit/:id', upload.array('image', 4), async function (req, res, next) {
    try {
        let updateFields = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            cprice: req.body.cprice,
            stockQuantity: req.body.stockQuantity,
            category: req.body.category,
            brand: req.body.brand,
        };

        // Assuming multer has already processed the file upload
        if (req.files && req.files.length > 0) {
            // Assuming image is an array field in your model
            updateFields.image = req.files.map(file => path.basename(file.filename));
        }

        let product = await productModel.findOneAndUpdate(
            { _id: req.params.id },
            updateFields,
            { new: true }
        );

        if (product) {
            res.redirect('/dashboard/products');
        } else {
            res.render('./dashboard/edit_product', { title: 'Add Product', product });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/dashboard/products', isAdmin, upload.array('image', 4), async function (req, res, next) {
    const user = await userModel.findOne({ username: req.session.passport.user })
    const productDetail = await productModel.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        cprice: req.body.cprice,
        stockQuantity: req.body.stockQuantity,
        image: req.files.map(file => path.basename(file.filename)),
        brand: req.body.brand,
        user: user._id
    });
    user.products.push(productDetail._id);
    await user.save();
    res.redirect('/dashboard/products');
});


router.get('/dashboard/blogs', isAdmin, async function (req, res, next) {
    const blogs = await blogModel.find()
    res.render('./dashboard/blogs', { title: 'Blogs', blogs });
});

router.get('/dashboard/blog/add', isAdmin, async function (req, res, next) {
    res.render('./dashboard/blog_add', { title: 'Blogs' });
});

router.get('/dashboard/blog/edit/:id', isAdmin, async function (req, res, next) {
    const blog = await blogModel.findOne({ _id: req.params.id })
    res.render('./dashboard/edit_blog', { title: 'Edit Product', blog: blog });
});

router.post('/dashboard/blogs/edit/:id', isAdmin, blogUploadImg.single('image'), async function (req, res, next) {
    let updateFields = {
        title: req.body.title,
        description: req.body.description,

        blogTitle: req.body.blogTitle,
        intro: req.body.intro,

        blogSubTitle1: req.body.blogSubTitle1,
        para1: req.body.para1,

        blogSubTitle2: req.body.blogSubTitle2,
        para2: req.body.para2,

        blogSubTitle3: req.body.blogSubTitle3,
        para3: req.body.para3,

        blogSubTitle4: req.body.blogSubTitle4,
        para4: req.body.para4,

        blogSubTitle5: req.body.blogSubTitle5,
        para5: req.body.para5,

        blogSubTitle6: req.body.blogSubTitle6,
        para6: req.body.para6,

        blogSubTitle7: req.body.blogSubTitle7,
        para7: req.body.para7,

        blogSubTitle8: req.body.blogSubTitle8,
        para8: req.body.para8,

        blogSubTitle9: req.body.blogSubTitle9,
        para9: req.body.para9,

        blogSubTitle10: req.body.blogSubTitle10,
        para10: req.body.para10,
    }

    if (req.file) {
        updateFields.image = req.file.filename;
    }

    let blog = await blogModel.findOneAndUpdate({ _id: req.params.id },
        updateFields,
        { new: true }
    )
    res.redirect('/dashboard/blogs');
});

router.post('/dashboard/blogs', isAdmin, blogUploadImg.single('image'), async function (req, res, next) {
    const user = await userModel.findOne({ username: req.session.passport.user })
    const blogDetails = await blogModel.create({
        title: req.body.title,
        description: req.body.description,

        blogTitle: req.body.blogTitle,
        intro: req.body.intro,

        blogSubTitle1: req.body.blogSubTitle1,
        para1: req.body.para1,

        blogSubTitle2: req.body.blogSubTitle2,
        para2: req.body.para2,

        blogSubTitle3: req.body.blogSubTitle3,
        para3: req.body.para3,

        blogSubTitle4: req.body.blogSubTitle4,
        para4: req.body.para4,

        blogSubTitle5: req.body.blogSubTitle5,
        para5: req.body.para5,

        blogSubTitle6: req.body.blogSubTitle6,
        para6: req.body.para6,

        blogSubTitle7: req.body.blogSubTitle7,
        para7: req.body.para7,

        blogSubTitle8: req.body.blogSubTitle8,
        para8: req.body.para8,

        blogSubTitle9: req.body.blogSubTitle9,
        para9: req.body.para9,

        blogSubTitle10: req.body.blogSubTitle10,
        para10: req.body.para10,

        image: req.file.filename,
        user: user._id
    });
    user.blogs.push(blogDetails._id);
    await user.save();
    res.redirect('/dashboard/blogs');
});

// Middel ware
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    res.redirect("/home")
}


module.exports = router;