const { StatusCodes } = require("http-status-codes");
const Jobseeker = require("../models/Jobseeker");
const Company = require("../models/Company");
const Application = require("../models/Application");
const Testimonial = require("../models/Testimonial");
const Job = require("../models/Job");
const Query = require("../models/Query");

const getAllJobseekers = async (req, res) => {
  console.log("inside get job seekers")
  const jobseekers = await Jobseeker.find({});

  if (!jobseekers) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No jobseekers found" });
  }

  return res.status(StatusCodes.OK).json(jobseekers);
};

const getAllCompanies = async (req, res) => {
  try {
    // Find non-pending companies

    const companies = await Company.find({ status: { $ne: "pending" } });

    if (!companies || companies.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No non-pending companies found" });
    }

    let jobsPosted = [];
    let employees = [];

    // Find all jobs posted by these companies

    for (let i = 0; i < companies.length; i++) {
      const jobs = await Job.find({ companyId: companies[i]._id });
      jobsPosted.push(jobs.length);
    }

    // Find all the employees of these companies

    for (let i = 0; i < companies.length; i++) {

      let employeesCount = await Application.find({ companyId: companies[i]._id })
      employees.push(employeesCount.length);
    }

   
    return res
      .status(StatusCodes.OK)
      .json({ companies, jobsPosted, employees });

  } catch (error) {
    console.error("Error in getAllCompanies:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
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

  const users = await Jobseeker.find({});
  const companies = await Company.find({});
  const reviews = await Testimonial.find({});

  return res.status(StatusCodes.OK).json({
    recentusers: recentusers,
    recentcompanies: recentcompanies,
    users: users,
    companies: companies,
    reviews: reviews,
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
    console.log("TRUEEE");
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
  const { uid } = req.body;

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
  if (queries.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No queries found" });
  }
  return res.status(StatusCodes.OK).json({ queries });
};

const updateFavoriteTestimonial = async (req, res) => {
  const { tid, isFavorite } = req.body;

  try {
    const testimonial = await Testimonial.findByIdAndUpdate(tid, { fav: isFavorite }, { new: true });

    if (!testimonial) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Testimonial not found" });
    }

    return res.status(StatusCodes.OK).json({ msg: "Testimonial favorite status updated successfully", testimonial });
  } catch (error) {
    console.error("Error in updateFavorite:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
  }
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
  updateFavoriteTestimonial
};
