const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    description: String,
    blogTitle: String,
    intro:String,
    blogSubTitle1:String,
    para1:String,

    blogSubTitle2:String,
    para2:String,

    blogSubTitle3:String,
    para3:String,

    blogSubTitle4:String,
    para4:String,

    blogSubTitle5:String,
    para5:String,

    blogSubTitle6:String,
    para6:String,

    blogSubTitle7:String,
    para7:String,

    blogSubTitle8:String,
    para8:String,

    blogSubTitle9:String,
    para9:String,

    blogSubTitle10:String,
    para10:String,
    
    image: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    dat: {
        type: Date,
        default: Date.now
    }
});

const Blogs = mongoose.model('Blogs', blogSchema);

module.exports = Blogs;