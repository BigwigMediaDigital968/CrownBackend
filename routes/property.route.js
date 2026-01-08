const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/property.controller");
const multer = require("multer");
const storage = require("../config/storage");
const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 50 },
    { name: "brochure", maxCount: 1 },
  ]),
  propertyController.createProperty
);

router.get("/", propertyController.getProperties);
router.get("/featured", propertyController.getPropertiesBySlugs);

router.get("/:slug", propertyController.getPropertyBySlug);

router.delete("/:slug", propertyController.deleteProperty);

router.patch(
  "/:slug",
  upload.fields([
    { name: "images", maxCount: 50 },
    { name: "brochure", maxCount: 1 },
  ]),
  propertyController.updateProperty
);
module.exports = router;
