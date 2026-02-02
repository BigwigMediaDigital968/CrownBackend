const Sell = require("../models/sell.model");

/* =========================
   ADD SELL ENQUIRY
========================= */
exports.createSell = async (req, res) => {
  try {
    const { name, email, phone, location, expectedPrice, areaSqft } = req.body;

    if (!name || !email || !phone || !location || !expectedPrice || !areaSqft) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sell = new Sell({
      name,
      email,
      phone,
      location,
      expectedPrice: Number(expectedPrice),
      areaSqft: Number(areaSqft),
    });

    await sell.save();

    res.status(201).json({
      message: "Sell enquiry submitted successfully",
      sell,
    });
  } catch (error) {
    console.error("Create Sell Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL SELL ENQUIRIES
========================= */
exports.getAllSells = async (req, res) => {
  try {
    const sells = await Sell.find().sort({ createdAt: -1 });
    res.status(200).json(sells);
  } catch (error) {
    console.error("Fetch Sells Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET SINGLE SELL ENQUIRY
========================= */
exports.getSellById = async (req, res) => {
  try {
    const sell = await Sell.findById(req.params.id);

    if (!sell) {
      return res.status(404).json({ message: "Sell enquiry not found" });
    }

    res.status(200).json(sell);
  } catch (error) {
    console.error("Get Sell Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE SELL ENQUIRY
========================= */
exports.updateSell = async (req, res) => {
  try {
    const sell = await Sell.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!sell) {
      return res.status(404).json({ message: "Sell enquiry not found" });
    }

    res.status(200).json({
      message: "Sell enquiry updated successfully",
      sell,
    });
  } catch (error) {
    console.error("Update Sell Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE SELL ENQUIRY
========================= */
exports.deleteSell = async (req, res) => {
  try {
    const sell = await Sell.findByIdAndDelete(req.params.id);

    if (!sell) {
      return res.status(404).json({ message: "Sell enquiry not found" });
    }

    res.status(200).json({ message: "Sell enquiry deleted successfully" });
  } catch (error) {
    console.error("Delete Sell Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
