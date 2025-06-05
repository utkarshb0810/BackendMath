const mongoose = require("mongoose");

const yearSchema = new mongoose.Schema(
  {
    2019: Number,
    2020: Number,
    2021: Number,
    2022: Number,
    2023: Number,
    2024: Number,
    2025: Number,
  },
  { _id: false }
);

const chapterSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  class: { type: String, required: true },
  unit: { type: String, required: true },
  yearWiseQuestionCount: { type: yearSchema, required: true },
  questionSolved: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
  },
  isWeakChapter: { type: Boolean, required: true },
});

module.exports = mongoose.model("Chapter", chapterSchema);
