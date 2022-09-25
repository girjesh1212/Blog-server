const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model('questions', BlogSchema);
module.exports = Blog;
