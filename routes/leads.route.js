const express = require("express");
const router = express.Router();
const Lead = require("../models/leads.model");
const sendEmail = require("../utils/sendEmail");

// 📩 Create a new lead
router.post("/submit", async (req, res) => {
  const { name, email, phone, requirements, budget, message } = req.body;

  try {
    // ✅ Save lead to DB
    const newLead = new Lead({
      name,
      email,
      phone,
      requirements,
      budget,
      message,
    });
    await newLead.save();

    // 📨 Notify admin
    await sendEmail({
      to: "Info@eipl.co",
      subject: "New Lead Submission - Ethical",
      html: `
        <h3>New Lead Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Requirements:</strong> ${requirements}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    // 📬 Send confirmation to user (if email exists)
    if (email) {
      await sendEmail({
        to: email,
        subject: "We've received your query - Ethical Infrastructures",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding: 20px;">
              <img src="https://res.cloudinary.com/dcq2oziz4/image/upload/v1764066541/Untitled_design_27_hkp26f.png" alt="Bigwig Media" width="120" />
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
              <h2 style="color: #333;">Hello ${name},</h2>
              <p style="font-size: 16px; color: #555;">
                Thank you for reaching out to <strong>Ethical Infrastructures Private Limited</strong>.
                Our team will get in touch with you soon.
              </p>
              <p style="margin-top: 30px; font-size: 15px; color: #777;">
                Regards,<br />
                <strong>Team Ethical Infrastructures Private Limited</strong>
              </p>
            </div>
          </div>
        `,
      });
    }

    res.status(200).json({ message: "Lead submitted successfully." });
  } catch (err) {
    console.error("Error saving lead:", err);
    res.status(500).json({ message: "Server error while saving lead." });
  }
});

// 📄 Fetch all leads
router.get("/all", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Server error while fetching leads." });
  }
});

// Update lead (mark)
router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete lead
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Lead deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
