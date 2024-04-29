const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const questionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  questioner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    select: false,
  },
});

module.exports = model("Question", questionSchema);
