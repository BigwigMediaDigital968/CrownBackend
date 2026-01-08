const BrochureLead = require("../models/brochureLead.model");

exports.createLead = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const existingLead = await BrochureLead.findOne({ phone });

    if (existingLead) {
      return res.status(200).json({
        message: "Lead already exists",
        lead: existingLead,
      });
    }

    const lead = new BrochureLead({ name, phone });
    await lead.save();

    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await BrochureLead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await BrochureLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await BrochureLead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await BrochureLead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Lead deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
