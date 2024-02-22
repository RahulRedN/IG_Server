const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: String,
    default: "",
    required: true,
  },
  type: {
    type: String,
    default: "",
    required: true,
  },
  feedback: {
    type: String,
    default: "",
    required: true,
  },
  reviewed:{
    type: Boolean,
    default: false
  }

}, { timestamps: true });

ReviewSchema.set("timestamps", true);

const ApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Jobseeker",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    review: {
      type: ReviewSchema,
    },

  },
  {
    toJSON: {
      timestamps: true,
    }
  }
);

ApplicationSchema.set("timestamps", true);

module.exports = mongoose.model("Application", ApplicationSchema);
