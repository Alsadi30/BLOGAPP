const router = require("express").Router();
const { isAuthenticated } = require("../../middleware/authMiddleware");

const {
  commentPostController,
  replyCommentPostController,
} = require("../controllars/commentController");

const {
  likesGetControllers,
  dislikesGetController,
} = require("../controllars/likeDislikeController");

const { bookmarksGetController } = require("../controllars/bookmarkController");

router.post("/comments/:postId", isAuthenticated, commentPostController);

router.post(
  "/comments/reply/:commentId",
  isAuthenticated,
  replyCommentPostController
);

router.get("/likes/:postId", isAuthenticated, likesGetControllers);
router.get("/dislikes/:postId", isAuthenticated, dislikesGetController);

router.get("/bookmarks/:postId", isAuthenticated, bookmarksGetController);

module.exports = router;
