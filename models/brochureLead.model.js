const mongoose = require("mongoose");

const brochureLeadSchema = new mongoose.Schema({
  name: String,

  phone: String,
  marked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BrochureLead", brochureLeadSchema);
