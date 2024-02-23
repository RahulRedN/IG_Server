const { StatusCodes } = require("http-status-codes");
const Jobseeker = require("../models/Jobseeker");
const Company = require("../models/Company");
const Application = require("../models/Application");
const Testimonial = require("../models/Testimonial");
const Job = require("../models/Job");

const getAllJobseekers = async (req, res) => {
  const jobseekers = await Jobseeker.find({});

  if (!jobseekers) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No jobseekers found" });
  }

  return res.status(StatusCodes.OK).json(jobseekers);
};

const getAllCompanies = async (req, res) => {
  //status having pending are not needed
  const companies = await Company.find({ status: { $ne: "pending" } });

  if (!companies) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No non-pending companies found" });
  }
  let jobsPosted = [];
  let applications = [];

  const details = async () => {
    companies.forEach(async (company) => {
      const jobs = await Job.find({ companyId: company._id });

      jobsPosted = [...jobsPosted, jobs.length];

      const app = await Application.find({
        jobId: { $in: jobs },
      }).countDocuments();
      applications.push(app.length);
    });

    console.log(jobsPosted, applications);
  };

  details();

  return res
    .status(StatusCodes.OK)
    .json({ companies, jobsPosted, applications });
};

const getpendingCompanies = async (req, res) => {
  //status having pending are not needed
  const companies = await Company.find({ status: "pending" });

  if (!companies) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No non-pending companies found" });
  }

  return res.status(StatusCodes.OK).json({ companies });
};

const getrecentUsersStats = async (req, res) => {
  const recentusers = await Jobseeker.find({}).sort({ createdAt: -1 }).limit(5);

  const recentcompanies = await Company.find({ status: "accepted" })
    .sort({ createdAt: -1 })
    .limit(5);

  const userCount = await Jobseeker.countDocuments();

  const companyCount = await Company.countDocuments({ status: "accepted" });

  const incomingReq = await Company.find({
    status: "pending",
  }).countDocuments();

  const reviews = await Testimonial.countDocuments();

  return res.status(StatusCodes.OK).json({
    recentusers: recentusers,
    recentcompanies: recentcompanies,
    USR: userCount,
    CCR: companyCount,
    ICR: incomingReq,
    RCR: reviews,
  });
};

const getTestimonials = async (req, res) => {
  const testimonials = await Testimonial.find({});
  if (!testimonials) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No testimonials found" });
  }
  return res.status(StatusCodes.OK).json({ testimonials });
};

const deleteTestimonial = async (req, res) => {
  const { tid } = req.query;
  const testimonial = await Testimonial.findByIdAndDelete({ _id: tid });
  if (!testimonial) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Testimonial not found" });
  }
  return res.status(StatusCodes.OK).json({ msg: "Testimonial deleted" });
};

const bookmarkUpdate = async (req, res) => {
  const { tid, action } = req.body;

  let testimonial;

  if (action === "true") {
    testimonial = await Testimonial.findOneAndUpdate(
      { _id: tid },
      { $set: { bookmarked: true } }
    );
  } else {
    testimonial = await Testimonial.findOneAndUpdate(
      { _id: tid },
      { $set: { bookmarked: false } }
    );
  }

  if (!testimonial) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Testimonial not found" });
  }

  return res.status(StatusCodes.OK).json({ msg: "Testimonial updated" });
};

const deleteUser = async (req, res) => {
  const { uid } = req.body;
  const applications = await Application.deleteMany({ userId: uid });
  const user = await Jobseeker.findByIdAndDelete({ _id: uid });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
  }

  return res.status(StatusCodes.OK).json({ msg: "User deleted" });
};

const deleteCompany = async (req, res) => {
  const { uid } = req.query;
  const jobs = await Job.deleteMany({ companyId: uid });
  const applications = await Application.deleteMany({ jobId: { $in: jobIds } });
  const company = await Company.findByIdAndDelete({ _id: uid });

  if (!company) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Company not found" });
  }



  return res.status(StatusCodes.OK).json({ msg: "Company deleted" });
};

const updateCompany = async (req, res) => {
  const { uid, status } = req.body;

  const company = await Company.findOneAndUpdate(
    { _id: uid },
    { $set: { status: status } }
  );

  if (!company) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Company not found" });
  }

  return res.status(StatusCodes.OK).json({ msg: "Company updated" });
};

const getQueries = async (req, res) => {
  const queries = await Query.find({});
  if (!queries) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No queries found" });
  }
  return res.status(StatusCodes.OK).json({ queries });
};

module.exports = {
  getAllJobseekers,
  getAllCompanies,
  getrecentUsersStats,
  getTestimonials,
  getQueries,
  deleteTestimonial,
  bookmarkUpdate,
  deleteUser,
  deleteCompany,
  updateCompany,
  getpendingCompanies,
};
