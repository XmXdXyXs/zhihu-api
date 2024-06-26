const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const topicsSchema = new Schema({
  name: { type: String, required: true },
  avatar_url: { type: String },
  introduction: { type: String, select: false },
});

module.exports = model("Topics", topicsSchema);
