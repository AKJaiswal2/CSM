require("dotenv").config();
const mongoose = require("mongoose");
async function connection() {
  const uri = process.env.MONGODB_URI;
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected Successfully"))
    .catch((error) => console.log("Failed to connect", error));
}

module.exports = connection;
