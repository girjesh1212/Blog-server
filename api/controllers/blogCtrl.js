const validateBlogInput = require('../../validation/blog');
const NodeCache = require("node-cache");
const cache = new NodeCache();
const Blog = require('../../models/Blog');
const User = require('../../models/User');

module.exports.test = (req, res) => {
    return res.status(200).json({ msg: 'Blog route works' });
}

module.exports.createBlog = (req, res) => {
    //Check validation
    const { errors, isValid } = validateBlogInput(req.body);
    if (!isValid) { return res.status(400).json({ success: false, msg: errors }); }

    const newBlog = new Blog({
        user: req.user._id,
        title: req.body.title,
        text: req.body.text,
    });

    newBlog.save((err) => {
        if (err) {
            return res.json({ success: false, msg: 'Database error, blog creation failed' });
        }
        cache.flushAll();
        return res.json({ success: true, blog: newBlog });
    });

}

// Fetches blogs using pagination
module.exports.fetchBlogs = (req, res) => {
    if (!req.params.num || Number(req.params.num) < 1) {
        return res.status(400).json({ success: false, msg: 'num >= 1 is required in params' });
    }

    var num = 0;
    fetchNum = 10;          // Fetch this number of blogs at a time
    try {
        num = Number(req.params.num) - 1;
    } catch (e) {
        return res.status(400).json({ success: false, msg: 'Please input a valid number' });
    }
    const skip = fetchNum * num;        // Skip this number of blogs from the start

    const value = cache.get(num + 1);
    if (value) {
        // handle hit!
        cache.ttl(num + 1, 600);
        return res.status(200).json({ success: true, page: num + 1, blogs: value });
    }

    Blog.find()
        .sort({ createdAt: -1 })
        .limit(fetchNum)
        .skip(skip)
        .exec((err, docs) => {
            if (err) {
                return res.status(400).json({ success: false, msg: 'Database error: unable to find blogs, please retry' });
            }
            cache.set(num + 1, docs, 600);
            return res.status(200).json({ success: true, page: num + 1, blogs: docs });
        });

}

// Fetches blogs by email
module.exports.fetchBlogsByEmail = (req, res) => {
    if (!req.params.num || Number(req.params.num) < 1) {
        return res.status(400).json({ success: false, msg: 'num >= 1 is required in params' });
    }

    User.findOne({ email: req.params.email })
        .exec((e, user) => {
            if (e) {
                return res.status(400).json({ success: false, msg: 'Something went wrong, Please try again' });
            }
            if (!user) {
                return res.status(400).json({ success: false, msg: 'Email does not exist' });
            }

            var num = 0;
            fetchNum = 10;          // Fetch this number of blogs at a time
            try {
                num = Number(req.params.num) - 1;
            } catch (e) {
                return res.status(400).json({ success: false, msg: 'Please input a valid number' });
            }
            const skip = fetchNum * num;        // Skip this number of blogs from the start

            Blog.find({ user: user._id })
                .sort({ createdAt: -1 })
                .limit(fetchNum)
                .skip(skip)
                .exec((err, docs) => {
                    if (err) {
                        return res.status(400).json({ success: false, msg: 'Database error: unable to find blogs, please retry' });
                    }

                    return res.status(200).json({ success: true, page: num + 1, blogs: docs });
                });
        });
}

module.exports.deleteBlog = (req, res) => {
    if (!req.body.blogId) {
        return res.status(400).json({ success: false, blogId: 'blogId is required' });
    }

    Blog.findById(req.body.blogId)
        .exec(async (err, blog) => {
            if (err) {
                return res.json({ success: false, msg: 'Error in finding blog' })
            }
            if (!blog) {
                return res.json({ success: false, msg: 'No blog exists with this id' })
            }
            if (req.user._id.toString() != blog.user.toString()) {
                return res.json({ success: false, msg: 'only the creator of this blog can delete it' });
            }

            await blog.remove();
            cache.flushAll();
            return res.status(200).json({ success: true, msg: 'Blog deleted successfully' });

        });

}

module.exports.updateBlog = (req, res) => {
    if (!req.body.blogId) {
        return res.json({ success: false, blogId: 'blogId is required' });
    }
    if (!req.body.title && !req.body.text) {
        return res.json({ success: false, msg: 'Please enter title or text field to edit' });
    }

    Blog.findById(req.body.blogId)
        .exec(async (err, blog) => {
            if (err) {
                return res.json({ success: false, msg: 'Error in finding blog' })
            }
            if (!blog) {
                return res.json({ success: false, msg: 'No blog exists with this id' })
            }
            if (req.user._id.toString() != blog.user.toString()) {
                return res.json({ success: false, msg: 'only the creator of this blog can edit it' });
            }

            if (req.body.title) {
                blog.title = req.body.title;
            }
            if (req.body.text) {
                blog.text = req.body.text;
            }

            await blog.save();
            cache.flushAll();
            return res.status(200).json({ success: true, msg: 'Blog updated successfully' });

        });

}