const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, default: "" },
  type: {
    type: String,
    default: "",
  },
  purpose: {
    type: String,
    enum: ["Buy", "Sell", "Lease"],
    required: true,
  },
  location: { type: String, required: true },
  brochure: { type: String, default: "" },
  builder: { type: String, default: "" },

  images: { type: [String], default: [] },

  price: { type: Number, default: null },
  bedrooms: { type: String, default: "" },
  bathrooms: { type: String, default: "" },
  areaSqft: { type: String, default: "" },

  highlights: { type: [String], default: [] },
  featuresAmenities: { type: [String], default: [] },
  nearby: { type: [String], default: [] },

  googleMapUrl: { type: String, default: "" },
  videoLink: { type: String, default: "" },
  extraHighlights: { type: [String], default: [] },
  instagramLink: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  metatitle: { type: String, default: "" },
  metadescription: { type: String, default: "" },
});

module.exports = mongoose.model("Property", propertySchema);
