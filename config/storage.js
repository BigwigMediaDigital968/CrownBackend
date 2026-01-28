// // config/storage.js
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("./cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     // If it's a PDF
//     if (file.mimetype === "application/pdf") {
//       return {
//         folder: "Crown/brochures",
//         resource_type: "raw",
//         format: "pdf",
//         public_id: file.originalname.split(".")[0],
//       };
//     }

//     // Otherwise treat as image
//     return {
//       folder: "Crown/images",
//       resource_type: "auto",
//       allowed_formats: ["jpg", "jpeg", "png", "webp"],
//       // public_id: file.originalname.split(".")[0],
//     };
//   },
// });

// module.exports = storage;

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // 📄 PDF brochure
    if (file.mimetype === "application/pdf") {
      return {
        folder: "Crown/brochures",
        resource_type: "raw",
        format: "pdf",
      };
    }

    // ⭐ Featured thumbnail
    if (file.fieldname === "featuredThumbnail") {
      return {
        folder: "Crown/featured-thumbnails",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }

    // 🖼 Property images
    return {
      folder: "Crown/images",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

module.exports = storage;
