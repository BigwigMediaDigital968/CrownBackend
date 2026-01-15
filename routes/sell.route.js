const express = require("express");
const router = express.Router();

const {
  createSell,
  getAllSells,
  getSellById,
  updateSell,
  deleteSell,
} = require("../controllers/sell.controller");

/* =========================
   SELL ROUTES
========================= */

// Create sell enquiry
router.post("/add", createSell);

// Get all sell enquiries
router.get("/all", getAllSells);

// Get single sell enquiry
router.get("/:id", getSellById);

// Update sell enquiry
router.put("/:id", updateSell);

// Delete sell enquiry
router.delete("/:id", deleteSell);

module.exports = router;
