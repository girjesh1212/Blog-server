const express = require('express');
const router = express.Router();
const passport = require('passport');
const { test, createBlog, fetchBlogs, deleteBlog, updateBlog, fetchBlogsByEmail } = require('../controllers/blogCtrl');

router.get('/test', test);
router.post('/create', passport.authenticate('user-passport', { session: false }), createBlog);
router.get('/fetch/:num', fetchBlogs);
router.get('/fetch/:email/:num', fetchBlogsByEmail);
router.put('/update', passport.authenticate('user-passport', { session: false }), updateBlog);
router.post('/delete', passport.authenticate('user-passport', { session: false }), deleteBlog);

module.exports = router;
