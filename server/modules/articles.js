const mongoose = require('mongoose');
const Scheme = mongoose.Schema;
const articlesSchema = new mongoose.Schema({
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
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    dateUpdated: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('articles', articlesSchema);