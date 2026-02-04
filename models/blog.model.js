const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String, // Just the name, no avatar
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  coverImageAlt: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },

  // 🔥 NEW: Structured FAQs
  faqs: {
    type: [faqSchema],
    default: [],
  },

  schemaMarkup: {
    type: [String], // array of JSON-LD strings
    default: [],
  },

  datePublished: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
