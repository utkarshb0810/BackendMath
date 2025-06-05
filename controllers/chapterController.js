const Chapter = require("../models/Chapter");
const redisClient = require("../config/redisClient");
exports.getAllChapters = async (req, res) => {
  try {
    const {
      class: classFilter,
      unit,
      subject,
      status,
      weakChapters,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {};
    if (classFilter) filters.class = classFilter;
    if (unit) filters.unit = unit;
    if (subject) filters.subject = subject;
    if (status) filters.status = status;
    if (weakChapters === "true") filters.isWeakChapter = true;
    if (weakChapters === "false") filters.isWeakChapter = false;

    const total = await Chapter.countDocuments(filters);

    const chapters = await Chapter.find(filters)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, chapters });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

exports.uploadChapters = async (req, res) => {
  try {
    const rawData = JSON.parse(req.file.buffer.toString());

    if (!Array.isArray(rawData)) {
      return res.status(400).json({ error: "Uploaded JSON must be an array" });
    }

    const success = [];
    const failed = [];

    for (const chapter of rawData) {
      try {
        const newChapter = new Chapter(chapter);
        await newChapter.save();
        success.push(newChapter);
      } catch (err) {
        failed.push({ chapter, error: err.message });
      }
    }

    // ✅ Invalidate Redis cache after uploading
    try {
      const keys = await redisClient.keys("chapters:*");
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`Cache invalidated: ${keys.length} keys removed`);
      }
    } catch (cacheErr) {
      console.warn("Cache invalidation failed:", cacheErr.message);
    }

    res.status(201).json({
      message: "Upload processed",
      successCount: success.length,
      failedCount: failed.length,
      failed,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Upload failed", details: err.message });
  }
};