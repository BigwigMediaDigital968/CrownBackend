const express = require("express");
const cors = require("cors");
const { connect } = require("./config/db");
const subscriberRoutes = require("./routes/subscriber.route");
const leadRoutes = require("./routes/leads.route");
const blogRoutes = require("./routes/blog.route");
const buyproperty = require("./routes/property.route");
const sellproperty = require("./routes/sell.route");
const sellApproval = require("./routes/adminApproval");
const brochureLeadRoutes = require("./routes/brochureLead");
const plotRoutes = require("./routes/plot.route");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", subscriberRoutes);
app.use("/api/lead", leadRoutes);
app.use("/blog", blogRoutes);
app.use("/api/property", buyproperty);
app.use("/sellproperty", sellproperty);
app.use("/sell", sellApproval);
app.use("/brochure-leads", brochureLeadRoutes);
app.use("/plot", plotRoutes);

app.use("/", (req, res) => {
  res.send("API LIVE🚀");
});

// Start server
app.listen(process.env.PORT, async () => {
  try {
    await connect();
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }

  console.log(`🚀 Server is listening on port ${process.env.PORT}`);
});
