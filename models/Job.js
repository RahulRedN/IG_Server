const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    benefits: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    jobDesc: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "work-from-home"
    },
    position: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    totalPositions: {
      type: Number,
      required: true,
    },
    vacancies: {
      type: Number,
      required: true,
    },
  },
  { timeStamps: true }
);

JobSchema.set("timestamps", true);

module.exports = mongoose.model("Job", JobSchema);
