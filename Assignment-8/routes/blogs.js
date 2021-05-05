const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const { isLoggedIn } = require('../middleware');

// Get all blogs
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.render('blogs/index', { blogs });
  } catch (e) {
    console.error(e.message);
    req.flash('error', 'Cannot Find Any Blogs, Try Again Later');
    res.render('error');
  }
});

// Get form for new blog
router.get('/blogs/new', isLoggedIn, (req, res) => {
  res.render('blogs/new');
});

// Create new blog
router.post('/blogs', isLoggedIn, async (req, res) => {
  try {
    await Blog.create(req.body.blog);
    req.flash('success', 'Blog is created successfully');
    res.redirect('/blogs');
  } catch (e) {
    console.error(e.message);
    req.flash('error', 'Could Not Create Blog, Try Again Later');
    res.render('error');
  }
});

// Get a particular blog
router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('comments');
    res.render('blogs/show', { blog });
  } catch (e) {
    console.error(e.message);
    req.flash('error', 'Could Not Find Blog, Try Again Later');
    res.redirect('/error');
  }
});

// Get edit form
router.get('/blogs/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render('blogs/edit', { blog });
  } catch (e) {
    console.error(e.message);
    req.flash('error', 'Cannot Edit This Blog');
    res.redirect('/error');
  }
});

// update the blog
router.patch('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, req.body.blog);
    req.flash('success', 'Updated Blog Successfully');
    res.redirect(`/blogs/${req.params.id}`);
  } catch (e) {
    console.error(e.message);
    req.flash('error', 'Could not update this Blog');
    res.redirect('/error');
  }
});

// Delete a blog
router.delete('/blogs/:id', isLoggedIn, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    req.flash('success', 'Blog Deleted Successfully');
    res.redirect('/blogs');
  } catch (e) {
    console.log(e.message);
    req.flash('error', 'Cannot delete this Blog');
    res.redirect('/error');
  }
});

// create new comment on a blog
router.post('/blogs/:id/comment', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const comment = new Comment({
      user: req.user.username,
      ...req.body,
    });

    blog.comments.push(comment);

    await comment.save();
    await blog.save();

    req.flash('success', 'Successfully added your comment');
    res.redirect(`/blogs/${req.params.id}`);
  } catch (e) {
    console.log(e.message);
    req.flash('error', 'Could not add comment to this blog');
    res.redirect('/error');
  }
});

// render error page (if a particular blog is not found in db)
router.get('/error', (req, res) => {
  res.status(500).render('error');
});

module.exports = router;
