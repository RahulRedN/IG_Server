const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CompanySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is a required field!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is a required field!"],
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
  },
  {
    toJSON: {
      timestamps: true,
    },
  }
);

CompanySchema.set("timestamps", true);

CompanySchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

CompanySchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Company", CompanySchema);
