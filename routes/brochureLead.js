const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/brochureLeadController");

// Create lead
router.post("/", createLead);

// Get all leads
router.get("/", getLeads);

// Get lead by ID
router.get("/:id", getLeadById);

// Update lead (mark)
router.put("/:id", updateLead);

// Delete lead
router.delete("/:id", deleteLead);

module.exports = router;
