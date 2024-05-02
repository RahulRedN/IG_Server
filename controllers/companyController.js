const Company = require("../models/Company");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Jobseeker = require("../models/Jobseeker");
const client = require("../redis/client");

const companyDetails = async (req, res) => {
  const { uid } = req.query;

  const company = await Company.findOne({ _id: uid });

  if (!company) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Company not found!" });
  }

  const companyJobs = await Job.find({ companyId: uid });

  const jobIds = companyJobs.map((job) => job._id);

  const applications = await Application.find({ jobId: { $in: jobIds } });

  const userInfo = await Jobseeker.find({
    _id: { $in: applications.map((emp) => emp.userId) },
  });

  return res
    .status(StatusCodes.OK)
    .json({ company, applications, companyJobs, userInfo });
};

const updateJobRequest = async (req, res) => {
  const { appId, action } = req.body;

  let application;

  if (action === "accept") {
    application = await Application.findOneAndUpdate(
      { _id: appId },
      { status: "accepted" }
    );
    const dec = await Job.findOneAndUpdate(
      { _id: application.jobId },
      { $inc: { vacancies: -1 } }
    );
  } else {
    application = await Application.findOneAndUpdate(
      { _id: appId },
      { status: "rejected" }
    );
  }

  if (!application) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Application not found!" });
  }

  const jobs = await Job.find({});

  await client.set("jobs", jobs);

  return res.status(StatusCodes.OK).json({ msg: "Updated" });
};

const postJob = async (req, res) => {
  const {
    companyId,
    responsibilities,
    companyName,
    skills,
    benefits,
    experience,
    jobDesc,
    salary,
    location,
    position,
    totalPositions,
    vacancies,
    joiningDate,
  } = req.body;

  const job = await Job.create({
    companyId: companyId,
    companyName: companyName,
    responsibilities,
    skills,
    benefits,
    experience,
    jobDesc,
    salary,
    location,
    position,
    totalPositions,
    vacancies,
    joiningDate,
  });

  if (!job) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Job posting failed!" });
  }

  const jobs = await Job.find({});

  await client.set("jobs", jobs);


  return res
    .status(StatusCodes.OK)
    .json({ msg: "Job posted!", jobId: job._id });
};

const updateJob = async (req, res) => {
  const { jobId, experience, salary, position, totalPositions, joiningDate } =
    req.body;

  const job = await Job.findOneAndUpdate(
    { _id: jobId },
    {
      experience,
      salary,
      position,
      totalPositions,
      joiningDate,
    }
  );

  if (!job) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Job update failed!" });
  }

  const jobs = await Job.find({});

  await client.set("jobs", jobs);

  return res.status(StatusCodes.OK).json({ msg: "Job updated!" });
};

const deleteJob = async (req, res) => {
  const { uid, jobId } = req.body;

  const company = await Company.findOne({ _id: uid });

  if (!company) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Company not found!" });
  }

  const job = await Job.findOneAndDelete({ _id: jobId });

  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found!" });
  }

  const application = await Application.deleteMany({ _id: jobId });

  if (!application) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Applications not found!" });
  }

  const jobs = await Job.find({});

  await client.set("jobs", jobs);

  return res.status(StatusCodes.OK).json({ msg: "Job deleted!" });
};

module.exports = {
  companyDetails,
  updateJobRequest,
  postJob,
  updateJob,
  deleteJob,
};
