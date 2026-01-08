const PlotModel = require("../models/plot.model");

exports.createLead = async (req, res) => {
  try {
    const lead = new PlotModel(req.body);
    await lead.save();

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const leads = await PlotModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await PlotModel.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const deletedLead = await PlotModel.findByIdAndDelete(req.params.id);

    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: deletedLead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};

// PUT - Update lead (mark/unmark)
exports.updateLead = async (req, res) => {
  try {
    const { marked } = req.body; // Expecting { marked: true/false }
    const lead = await PlotModel.findByIdAndUpdate(
      req.params.id,
      { marked },
      { new: true } // return the updated document
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: error.message,
    });
  }
};
