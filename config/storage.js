// config/storage.js
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // If it's a PDF
    if (file.mimetype === "application/pdf") {
      return {
        folder: "Crown/brochures",
        resource_type: "raw",
        format: "pdf",
        public_id: file.originalname.split(".")[0],
      };
    }

    // Otherwise treat as image
    return {
      folder: "Crown/images",
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: file.originalname.split(".")[0],
    };
  },
});

module.exports = storage;
