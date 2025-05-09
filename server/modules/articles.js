const mongoose = require('mongoose');
const Scheme = mongoose.Schema;
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    author:{
        type: String,
        required:false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    dateUpdated: {
        type: Date,
        default: Date.now,
    },
    trending: {
        type: Boolean,
        default: false, // By default, an article is not trending
    },
    category:{
        type: 'string',
        required: true,
    }
});

module.exports = mongoose.model('article', articleSchema);