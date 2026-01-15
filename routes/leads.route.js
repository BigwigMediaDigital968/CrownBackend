const express = require("express");
const router = express.Router();
const Lead = require("../models/leads.model");
const sendEmail = require("../utils/sendEmail");

/* ============================
   OTP TEMP STORAGE (IN-MEMORY)
=============================== */
const otpMap = new Map();

/* ============================
   OTP GENERATOR
=============================== */
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ============================
   1️⃣ SEND OTP (NO DB SAVE)
=============================== */
router.post("/send-otp", async (req, res) => {
  const { name, email, phone, requirements, budget, message } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const otp = generateOTP();

    // Save temporarily in memory
    otpMap.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      data: {
        name,
        email,
        phone,
        requirements,
        budget,
        message,
      },
    });

    // 📧 Send OTP (Email)
    if (email) {
      await sendEmail({
        to: email,
        subject: "OTP Verification - Crownpoint Estates",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>Hello ${name},</h2>
            <p>Your OTP for lead verification is:</p>
            <h1 style="letter-spacing: 4px;">${otp}</h1>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            <p>– Team Crownpoint Estates</p>
          </div>
        `,
      });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ============================
   2️⃣ VERIFY OTP → SAVE LEAD
=============================== */
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const record = otpMap.get(phone);

    if (!record) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (record.expiresAt < Date.now()) {
      otpMap.delete(phone);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ OTP VERIFIED → SAVE TO DB
    const leadData = record.data;
    const newLead = new Lead(leadData);
    await newLead.save();

    // Remove from memory
    otpMap.delete(phone);

    // 📨 Admin notification
    await sendEmail({
      to: "sales@crownpointestates.com",
      subject: "New Verified Lead",
      html: `
        <h3>New Verified Lead</h3>
        <p><strong>Name:</strong> ${leadData.name}</p>
        <p><strong>Email:</strong> ${leadData.email || "N/A"}</p>
        <p><strong>Phone:</strong> ${leadData.phone}</p>
        <p><strong>Requirements:</strong> ${leadData.requirements}</p>
        <p><strong>Budget:</strong> ${leadData.budget}</p>
        <p><strong>Message:</strong> ${leadData.message}</p>
      `,
    });

    // 📬 User confirmation
    if (leadData.email) {
      await sendEmail({
        to: leadData.email,
        subject: "Query Verified - Crownpoint Estates",
        html: `
          <p>Hello ${leadData.name},</p>
          <p>Your enquiry has been successfully verified.</p>
          <p>Our team will contact you shortly.</p>
          <p>– Team Crownpoint Estates</p>
        `,
      });
    }

    res
      .status(200)
      .json({ message: "OTP verified & lead submitted successfully" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

/* ============================
   📄 FETCH ALL LEADS
=============================== */
router.get("/all", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Server error while fetching leads." });
  }
});

/* ============================
   ✏️ UPDATE LEAD
=============================== */
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

/* ============================
   ❌ DELETE LEAD
=============================== */
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

/* ============================
   🧹 AUTO CLEAN EXPIRED OTPs
=============================== */
setInterval(() => {
  const now = Date.now();
  for (const [phone, record] of otpMap.entries()) {
    if (record.expiresAt < now) otpMap.delete(phone);
  }
}, 10 * 60 * 1000);

module.exports = router;
