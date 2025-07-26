const app = require("./app");
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;  // Changed to 5001

// Connect to MongoDB
const uri = "";
mongoose.connect(uri)
  .then(() => console.log("MongoDB database connection established successfully"))
  .catch(err => console.log("MongoDB connection error:", err));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
