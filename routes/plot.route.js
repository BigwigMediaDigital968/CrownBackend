const express = require("express");
const router = express.Router();
const {
  createLead,
  deleteLead,
  getLeadById,
  getAllLeads,
  updateLead,
} = require("../controllers/plotController");

// POST - Create Lead
router.post("/create", createLead);

router.get("/all", getAllLeads);

router.get("/:id", getLeadById);

router.delete("/:id", deleteLead);

// PUT - Update Lead (Mark/Unmark)
router.put("/:id", updateLead);

module.exports = router;
