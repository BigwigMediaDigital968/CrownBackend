const mongoose = require("mongoose");

const sellSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    expectedPrice: {
      type: Number, // store in numbers (₹)
      required: true,
    },

    areaSqft: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Sell", sellSchema);
