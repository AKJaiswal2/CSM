const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: null,
  },
  subscriptionTier: { type: String, enum: ["free", "pro"], default: "free" },
  uploadedImages: [{ type: String }],
  lastImageUploadTime: { type: Date, default: null },
  stripeSubscriptionId: { type: String, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
