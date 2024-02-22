const { StatusCodes } = require("http-status-codes");
const Jobseeker = require("../models/Jobseeker");
const Company = require("../models/Company");
const Application = require("../models/Application");
const Testimonial = require("../models/Testimonial");


const getAllJobseekers = async (req, res) => {

    const jobseekers = await Jobseeker.find({})

    if (!jobseekers) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "No jobseekers found" });
    }

    return res.status(StatusCodes.OK).json(jobseekers);
};


const getAllCompanies = async (req, res) => {

    //status having pending are not needed
    const companies = await Company.find({ status: { $ne: "pending" } })

    if (!companies) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "No non-pending companies found" });
    }

    return res.status(StatusCodes.OK).json({ companies });
}

const getrecentUsersStats = async (req, res) => {

    const recentusers = await Jobseeker.find({}).sort({ createdAt: -1 }).limit(5);

    const recentcompanies = await Company.find({ status: "accepted" }).sort({ createdAt: -1 }).limit(5);

    const userCount = await Jobseeker.countDocuments();

    const companyCount = await Company.countDocuments({ status: "accepted" });

    const incomingReq = await Company.find({ status: "pending" }).countDocuments();

    const reviews = await Testimonial.countDocuments();

    return res.status(StatusCodes.OK).json({ recentusers: recentusers, recentcompanies: recentcompanies, USR: userCount, CCR: companyCount, ICR: incomingReq, RCR: reviews });
}

const getTestimonials = async (req, res) => {
    const testimonials = await Testimonial.find({})
    if (!testimonials) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "No testimonials found" })
    }
    return res.status(StatusCodes.OK).json({ testimonials })
}

const deleteTestimonial = async (req, res) => {
    const { tid } = req.query
    const testimonial = await Testimonial.findByIdAndDelete({ _id: tid })
    if (!testimonial) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "Testimonial not found" })
    }
    return res.status(StatusCodes.OK).json({ msg: "Testimonial deleted" })
}

const bookmarkUpdate = async (req, res) => {

    const { tid, action } = req.body;

    let testimonial;

    if (action === 'true') {
        testimonial = await Testimonial.findOneAndUpdate({ _id: tid }, { $set: { bookmarked: true } });

    } else {
        testimonial = await Testimonial.findOneAndUpdate({ _id: tid }, { $set: { bookmarked: false } })
    }

    if (!testimonial) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "Testimonial not found" })
    }

    return res.status(StatusCodes.OK).json({ msg: "Testimonial updated" })



}

const getQueries = async (req, res) => {
    const queries = await Query.find({})
    if (!queries) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "No queries found" })
    }
    return res.status(StatusCodes.OK).json({ queries })
}



module.exports = { getAllJobseekers, getAllCompanies, getrecentUsersStats, getTestimonials, getQueries, deleteTestimonial, bookmarkUpdate };