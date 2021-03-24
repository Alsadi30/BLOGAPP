const router = require("express").Router();

const postValidator = require("../validator/dashboard/posts/postValidator");
const { isAuthenticated } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createPostGetController,
  createPostPostController,
  editPostGetController,
  editPostPostController,
  DeletePostGetController,
  allPostGetController,
} = require("../controllers/postController");

router.get("/create", isAuthenticated, createPostGetController);
router.post(
  "/create",
  isAuthenticated,
  upload.single("post-thumbnail"),
  postValidator,
  createPostPostController
);

router.get("/edit/:postId", isAuthenticated, editPostGetController);
router.post(
  "/edit/:postId",
  isAuthenticated,
  upload.single("post-thumbnail"),
  postValidator,
  editPostPostController
);
router.get("/delete/:postId", isAuthenticated, DeletePostGetController);
router.get("/", isAuthenticated, allPostGetController);

module.exports = router;
