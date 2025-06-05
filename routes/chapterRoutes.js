const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapterController");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../utils/uploadParser");
const cache = require("../middleware/cache");

router.get("/", cache, chapterController.getAllChapters);
router.get("/:id", chapterController.getChapterById);
router.post(
  "/",
  adminAuth,
  upload.single("file"),
  chapterController.uploadChapters
);

module.exports = router;
