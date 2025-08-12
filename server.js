const express = require("express");
const path = require("path");
const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Handle all routes by serving index.html from public folder
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
