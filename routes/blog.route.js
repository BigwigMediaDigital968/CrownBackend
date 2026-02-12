const router = require("express").Router();
const BlogPost = require("../models/blog.model");

const multer = require("multer");

const storage = require("../config/storage");
const upload = multer({ storage });

// Create Blog
router.post("/add", upload.single("coverImage"), async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      tags,
      coverImageAlt,
      faqs,
      status, // 🔥 NEW
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Cover image is required." });
    }

    const coverImage = req.file.secure_url || req.file.path;

    const imageAltText =
      coverImageAlt && coverImageAlt.trim().length > 0
        ? coverImageAlt.trim()
        : title;

    // Parse FAQs
    let parsedFaqs = [];
    if (faqs) {
      parsedFaqs = typeof faqs === "string" ? JSON.parse(faqs) : faqs;
    }

    // Parse schema markup
    let schemaMarkup = [];
    if (req.body.schemaMarkup) {
      schemaMarkup = Array.isArray(req.body.schemaMarkup)
        ? req.body.schemaMarkup
        : [req.body.schemaMarkup];
    }

    const blogPost = new BlogPost({
      title,
      slug,
      excerpt,
      content,
      author,
      tags: tags?.split(",").map((tag) => tag.trim()),
      coverImage,
      coverImageAlt: imageAltText,
      schemaMarkup,
      faqs: parsedFaqs,
      status: status || "DRAFT", // 🔥 Default to DRAFT
      datePublished: status === "PUBLISHED" ? new Date() : undefined,
    });

    await blogPost.save();

    res.status(201).json({
      message: "Blog post created successfully",
      blogPost,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin view Blog
router.get("/admin/viewblog", async (req, res) => {
  try {
    const data = await BlogPost.find().sort({
      datePublished: -1,
    });

    res.status(200).json(data);
  } catch (error) {
    console.log("Error fetching blogs:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// View Blog
router.get("/viewblog", async (req, res) => {
  try {
    const data = await BlogPost.find({ status: "PUBLISHED" }).sort({
      datePublished: -1,
    });

    res.status(200).json(data);
  } catch (error) {
    console.log("Error fetching blogs:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Update Blog
router.put("/:slug", upload.single("coverImage"), async (req, res) => {
  const { slug } = req.params;

  try {
    const {
      title,
      content,
      author,
      excerpt,
      tags,
      schemaMarkup,
      coverImageAlt,
      faqs,
      status, // 🔥 NEW
    } = req.body;

    const updateFields = {
      ...(title && { title }),
      ...(content && { content }),
      ...(author && { author }),
      ...(excerpt && { excerpt }),
      ...(tags && { tags: tags.split(",").map((t) => t.trim()) }),
      ...(coverImageAlt && { coverImageAlt: coverImageAlt.trim() }),
      ...(status && { status }), // 🔥 Update status
      lastUpdated: new Date(),
    };

    // If status becomes PUBLISHED → set datePublished
    if (status === "PUBLISHED") {
      updateFields.datePublished = new Date();
    }

    if (faqs) {
      updateFields.faqs = typeof faqs === "string" ? JSON.parse(faqs) : faqs;
    }

    if (schemaMarkup) {
      updateFields.schemaMarkup = Array.isArray(schemaMarkup)
        ? schemaMarkup
        : [schemaMarkup];
    }

    if (req.file) {
      updateFields.coverImage = req.file.secure_url || req.file.path;
    }

    const updatedBlogPost = await BlogPost.findOneAndUpdate(
      { slug },
      updateFields,
      { new: true, runValidators: true },
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ msg: "Blog post not found" });
    }

    res.status(200).json({
      msg: "Blog post updated successfully",
      blogPost: updatedBlogPost,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Delete Blog
router.delete("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const deletedBlogPost = await BlogPost.findOneAndDelete({ slug });

    if (!deletedBlogPost) {
      return res.status(404).json({ msg: "Blog post not found" });
    }

    res.status(200).json({ msg: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.patch("/:slug/image", upload.single("coverImage"), async (req, res) => {
  try {
    const { slug } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Use Cloudinary URL (secure_url or path)
    const imageUrl = req.file.secure_url || req.file.path;

    const updatedBlog = await BlogPost.findOneAndUpdate(
      { slug },
      {
        coverImage: imageUrl,
        lastUpdated: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Cover image updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating cover image:", error);
    res.status(500).json({ message: "Error updating cover image", error });
  }
});

// Related Blogs
router.get("/related/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // 1️⃣ Get current blog
    const currentBlog = await BlogPost.findOne({ slug });

    if (!currentBlog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const tags = currentBlog.tags || [];

    let relatedBlogs = [];

    // 2️⃣ If tags exist → find related blogs by tags
    if (tags.length > 0) {
      relatedBlogs = await BlogPost.find({
        slug: { $ne: slug }, // exclude current blog
        tags: { $in: tags }, // match any tag
        status: "PUBLISHED",
      })
        .sort({ datePublished: -1 })
        .limit(4);
    }

    // 3️⃣ If no related blogs found → fallback to any 4 blogs
    if (relatedBlogs.length === 0) {
      relatedBlogs = await BlogPost.find({
        slug: { $ne: slug },
      })
        .sort({ datePublished: -1 })
        .limit(4);
    }

    res.status(200).json(relatedBlogs);
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Admin Control
router.patch("/:slug/status", async (req, res) => {
  const { slug } = req.params;
  const { status } = req.body;

  if (!["DRAFT", "PUBLISHED", "INACTIVE"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status value" });
  }

  const updateData = { status, lastUpdated: new Date() };

  if (status === "PUBLISHED") {
    updateData.datePublished = new Date();
  }

  const blog = await BlogPost.findOneAndUpdate({ slug }, updateData, {
    new: true,
  });

  if (!blog) return res.status(404).json({ msg: "Blog not found" });

  res.status(200).json({ msg: "Status updated", blog });
});

module.exports = router;
