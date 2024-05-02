const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const JobseekerSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "Name is a required field!"],
    },
    address: {
      type: String,
      required: [true, "Address is a required field!"],
    },
    dob: {
      type: String,
      required: [true, "DOB is a required field!"],
    },
    email: {
      type: String,
      required: [true, "Email is a required field!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is a required field!"],
    },
    fav: {
      type: [mongoose.Schema.ObjectId],
      ref: "Job",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is a required field!"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile is a required field!"],
    },
    i_name: {
      type: String,
      required: [true, "Institute Name is a required field!"],
    },
    img: {
      type: String,
      required: [true, "Image is a required field!"],
    },
    resume: {
      type: String,
      required: [true, "Resume is a required field!"],
    },
    marital: {
      type: String,
      required: [true, "Marital Status is a required field!"],
    },
    nationality: {
      type: String,
      required: [true, "Nationant is a required field!"],
    },
    qualification: {
      type: String,
      required: [true, "Qualification is a required field!"],
    },
    skills: {
      type: [String],
    },
    yoa: {
      type: String,
      required: [true, "YOA is a required field!"],
    },
    yoc: {
      type: String,
      required: [true, "YOC is a required field!"],
    },
  },
  { timeStamps: true }
);

JobseekerSchema.set("timestamps", true);

JobseekerSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

JobseekerSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Jobseeker", JobseekerSchema);
