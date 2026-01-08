const mongoose = require("mongoose");

const plotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    userType: { type: String, required: false },
    plotSize: { type: String, required: false },
    location: { type: String, required: false },
    message: { type: String, required: false },
    marked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plot", plotSchema);
