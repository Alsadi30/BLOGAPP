const {
  validationResult
} = require("express-validator");
const User = require("../models/user");
const Comment = require("../models/comment");
const Flash = require("../utils/Flash");
const Profile = require("../models/Profile");
const errorFormatter = require("../utils/validationErrorFormater");

exports.dashboardGetController = async (req, res, next) => {
  try {
    let profile = await Profile.find({
      user: req.user._id,
    }).populate({
      path:'posts',
      select:'title thumbnail'
    })
    .populate({
      path:'bookmarks',
      select:'title thumbnail'
    })

    if (profile) {
      return res.render("pages/dashboard/dashboard", {
        title: "My Dashboard",
        flashMessage: Flash.getMessage(req),
        posts:profile.posts,
        bookmarks:profile.bookmarks
      });
    }
    res.redirect("/dashboard/create-profile");
  } catch (e) {
    next(e);
  }
};

exports.createProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.find({
      user: req.user._id,
    });
    if (!profile) {
      return res.redirect("/dashboard/edit-profile");
    }

    res.render("pages/dashboard/create-profile", {
      title: "Create your Profile",
      flashMessage: {},
      error: {},
    });
  } catch (e) {
    console.log(e.status);
    next(e);
  }
};

exports.createProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormatter);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/create-profile", {
      title: "Create your profile",
      flashMessage: Flash.getMessage(req),
      error: errors.mapped(),
    });
  }

  let {
    name,
    title,
    bio,
    website,
    facebook,
    github
  } = req.body;

  let profilePics = req.user.profilePics;
  let posts = [];
  let bookmarks = [];

  try {
    let profile = new Profile({
      user: req.user._id,
      name,
      title,
      bio,
      profilePics: req.user.profilePics,
      links: {
        website: website || "",
        facebook: facebook || "",
        github: github || "",
      },
      posts: [],
      bookmarks: [],
    });
    let createdProfile = await profile.save();
    await User.findOneAndUpdate({
      _id: req.user._id
    }, {
      $set: {
        profile: createdProfile._id
      }
    });
    req.flash("success", "Profile create successfully");
    res.redirect("/dashboard");
  } catch (e) {
    next(e);
  }
};

exports.editProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.find({
      user: req.user._id
    });
    if (!profile) {
      return res.redirect("/dashboard/create-profile");
    }
    res.render("pages/dashboard/edit-profile", {
      title: "Edit your profile",
      error: {},
      flashMessage: Flash.getMessage(req),
      profile,
    });
  } catch (e) {
    next(e);
  }
};

exports.editProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormatter);

  let profile = new Profile({
    user: req.user._id,
    name,
    title,
    bio,
    profilePics: req.user.profilePics,
    links: {
      website: website || "",
      facebook: facebook || "",
      github: github || "",
    },
    posts: [],
    bookmarks: [],
  });
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/create-profile", {
      title: "Create your profile",
      flashMessage: Flash.getMessage(req),
      error: errors.mapped(),
      profile: {
        name,
        title,
        bio,
        links: {
          website,
          facebook,
          github,
        },
      },
    });
  }
  try {
    let profile = {
      user: req.user._id,
      name,
      title,
      bio,
      links: {
        website: website || "",
        facebook: facebook || "",
        github: github || "",
      },
    };
    let updatedProfile = await Profile.findOneAndUpdate({
      user: req.user._id
    }, {
      $set: profile
    }, {
      new: true
    });

    req.flash("success", "Profile updated successfully");
    res.render("pages/dashboard/edit-profile", {
      title: "Edit your profile",
      error: {},
      flashMessage: Flash.getMessage(req),
      profile: updatedProfile,
    });
  } catch (e) {
    next(e);
  }
};


exports.bookmarksGetController = async (req, res, next) => {
  try {

    let profile = await Profile.findOne({
        user: req.user._id
      })
      .populate({
        path: 'bookmarks',
        model: 'Post',
        select: 'title thumbnail'
      })
    res.render('pages/dashboard/post/bookmarks', {
      title: 'My Bookmarks',
      flashMessage: Flash.getMessage(req),
      posts: profile.bookmarks
    })

  } catch (e) {
    next(e)
  } 
}

exports.commentsGetController = async (req,res,next) =>{
  try{
   
    let profile = await Profile.findOne({user:req.user._id})
    let comments = await Comment.find({post:{$in:profile.posts}})
           .populate({
             path:'post',
             select:'title'
            })
            .populate({
              path:'user',
              select:'username profilePics'
            })
            .populate({
              path:'replies.user',
              select:'username profilePics'
            })

         res.render('pages/dashboard/post/comment',{
           title:'My Recent Comments',
           flashMessage:Flash.getMessage(req),
           comments
         })   

  }catch(e){
    console.log(e)
    next(e)
  }
}