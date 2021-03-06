const { validationResult } = require("express-validator");
const readingTime = require("reading-time");

const Flash = require("../utils/Flash");
const errorFormatter = require("../utils/validationErrorFormater");

const Post = require("../models/post");
const Profile = require("../models/Profile");
exports.createPostGetController = (req, res, next) => {
  res.render("pages/dashboard/post/createPost", {
    title: "Create a new Post",
    error: {},
    flashMessage: Flash.getMessage(req),
    value: {},
  });
};

exports.createPostPostController = async (req, res, next) => {
  let { title, body, tags } = req.body;
  let errors = validationResult(req).formatWith(errorFormatter);
  console.log(errors);

  if (!errors.isEmpty()) {
    res.render("pages/dashboard/post/createPost", {
      title: "Create a new Post",
      error: errors.mapped(),
      flashMessage: Flash.getMessage(req),
      value: {
        title,
        body,
        tags,
      },
    });
  }

  if (tags) {
    tags = tags.split(",");
    tags = tags.map((t) => t.trim());
  }

  let readTime = readingTime(body).text;

  let post = new Post({
    title,
    body,
    tags,
    author: req.user._id,
    thumbnail: "",
    readTime,
    likes: [],
    dislikes: [],
    comments: [],
  });

  if (req.file) {
    post.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    let createdPost = await post.save();
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $push: { posts: createdPost._id } }
    );
    req.flash("success", "Post created  sussessfully");
    return res.redirect(`/posts/edit/${createdPost._id}`);
  } catch (e) {
    next(e);
  }
};

exports.editPostGetController = async (req, res, next) => {
  let postId = req.params.postId;
  let post = await Post.find({ author: req.user._id, _id: postId });

  try {
    if (!post) {
      let error = new Error("404 Page Not Found");
      error.status = 404;
      throw error;
    }

    res.render("pages/dashboard/post/editPost", {
      title: "Edit Your Post",
      error: {},
      flashMessage: Flash.getMessage(req),
      post,
    });
  } catch (e) {
    next(e);
  }
};

exports.editPostPostController = async (req, res, next) => {
  let { title, body, tags } = req.body;
  let postId = req.params.postId;
  let errors = validationResult(req).formatWith(errorFormatter);

  try {
    let post = await Post.find({ author: req.user._id, _id: postId });
    if (!post) {
      let error = new Error("404 Page Not Found");
      error.status = 404;
      throw error;
    }

    if (!errors.isEmpty()) {
      res.render("pages/dashboard/post/createPost", {
        title: "Create a new Post",
        error: errors.mapped(),
        flashMessage: Flash.getMessage(req),
        post,
      });
    }

    if (tags) {
      tags = tags.split(",");
      tags = tags.map((t) => t.trim());
    }
    let thumbnail = post.thumbnail;
    if (req.file) {
      thumbnail = req.file.filename;
    }

    await Post.findOneAndUpdate(
      { _id: post._id },
      { $set: { title, body, tags, thumbnail } },
      { new: true }
    );

    req.flash("success", "Post Updated Succussfully");
    res.redirect("/posts/edit/" + post._id);
  } catch (e) {
    next(e);
  }
};

exports.DeletePostGetController = async (req, res, next) => {
  let { postId } = req.params;

  try {
    let post = await Post.find({ author: req.user._id, _id: postId });
    if (!post) {
      let error = new Error("404 Page Not Found");
      error.status = 404;
      throw error;
    }
    await Post.findOneAndDelete({ _id: postId });
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { posts: postId } }
    );
    req.flash("success", "Post Delete Successfully");
    res.redirect("posts");
  } catch (e) {
    next(e);
  }
};

exports.allPostGetController = async (req, res, next) => {
  try {
    let posts = await Post.find({ author: req.user._id });
    res.render("pages/dashboard/post/posts", {
      title: "My Created posts",
      posts,
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};
