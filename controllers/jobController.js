const Jobseeker = require("../models/Jobseeker");
const Company = require("../models/Company");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Application = require("../models/Application");
const Testimonial = require('../models/Testimonial')
const Job = require("../models/Job");
const mongoose = require("mongoose");
const { helper } = require("../redis/helper");

const client = require('../redis/client.js');


const UserDetails = async (req, res) => {
  const { uid } = req.query;

  const user = await Jobseeker.findOne({ _id: uid });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found!" });
  }
  const applications = await Application.find({ userId: user._id });

  const jobs = await helper("jobs", async () => {
    return await Job.find({});
  });

  return res.status(StatusCodes.OK).json({ user, applications, jobs });

};

const Jobs = async (req, res) => {

  // const jobs = await Job.find({});
  console.log("jobs called");

  const jobs = await helper("jobs", async () => {
    return await Job.find({});
  });

  return res.status(StatusCodes.OK).json({ jobs });
};

const setFavJobs = async (req, res) => {
  const { uid, jid } = req.query;

  console.log(req);

  console.log(uid, jid);

  const user = await Jobseeker.findOneAndUpdate(
    { _id: uid },
    { $push: { fav: jid } }
  );

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found!" });
  }


  return res.status(StatusCodes.OK).json({ msg: "Job added to favourites!" });
};

const updateDetails = async (req, res) => {
  const { fname, mobile, address, uid } = req.body;

  const user = await Jobseeker.findOneAndUpdate(
    { _id: uid },
    { fname, mobile, address }
  );

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found!" });
  }

  return res.status(StatusCodes.OK).json({ msg: "Details updated!" });
};

const removeFavJobs = async (req, res) => {
  const { uid, jid } = req.query;

  const user = await Jobseeker.findOneAndUpdate(
    { _id: uid },
    { $pull: { fav: jid } }
  );

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found!" });
  }

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Job removed from favourites!" });
};

const updatephoto = async (req, res) => {
  const { uid } = req.body;

  const user = await Jobseeker.findOneAndUpdate(
    { _id: uid },
    { img: req.file.path }
  );

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found!" });
  }
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Photo updated!", img: req.file.path });
};

const applyJob = async (req, res) => {
  const { uid, jid } = req.body;

  const user = await Jobseeker.findOne({ _id: uid });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found!" });
  }

  const job = await Job.findOne({ _id: jid });

  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found!" });
  }

  if (job.vacancies <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No vacancies!" });
  }

  const application = await Application.findOne({ userId: uid, jobId: jid });

  if (application) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Already applied!" });
  }

  const re = await Application.create({ userId: uid, jobId: jid });

  if (!re) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Application failed!" });
  }

  const jobs = await Job.find({});

  client.set("jobs", jobs);

  return res.status(StatusCodes.OK).json({ msg: "Applied to job!" });
};

const updateSkills = async (req, res) => {
  const { uid, skills } = req.body;

  const user = await Jobseeker.findOneAndUpdate(
    { _id: uid },
    { skills: skills }
  );

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found!" });
  }

  return res.status(StatusCodes.OK).json({ msg: "Skills updated!" });
};

const postReview = async (req, res) => {
  const { uid, aid, type, rating, feedback } = req.body;
  console.log(req.body)
  const application = await Application.findOneAndUpdate(
    { _id: aid, userId: uid, status: "accepted" },
    { review: { type, rating, feedback, reviewed: true } }
  );

  if (!application) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Review failed!" });
  }

  return res.status(StatusCodes.OK).json({ msg: "Review posted!" });
};


const noOfApplicants = async (req, res) => {

  const { jid } = req.body;

  const jobIDs = Array.isArray(jid) ? jid.map(id => new mongoose.Types.ObjectId(id)) : [];

  // Check if jobIDs array is not empty before proceeding with aggregation
  if (jobIDs.length > 0) {
    const applications = await Application.aggregate([
      { $match: { jobId: { $in: jobIDs } } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } }
    ]);
    return res.status(StatusCodes.OK).json({ applications });
  }
}

const postTestimonial = async (req, res) => {

  const { uid, message } = req.body;

  const userPhoto = await Jobseeker.findOne({ _id: uid });

  const rs = await Testimonial.create({ userId: uid, message,name: userPhoto.fname, imageurl: userPhoto.img });

  if (!rs) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Testimonial failed!" });
  }

  return res.status(StatusCodes.OK).json({ msg: "Testimonial posted!" });


}

module.exports = {
  UserDetails,
  Jobs,
  setFavJobs,
  removeFavJobs,
  updateDetails,
  updatephoto,
  applyJob,
  updateSkills,
  postReview,
  noOfApplicants,
  postTestimonial,
};
