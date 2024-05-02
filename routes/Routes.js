const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");

const {
  getAllCompanies,
  getAllJobseekers,
  getQueries,
  getTestimonials,
} = require("../controllers/adminController");

router.get("/jobs", async (req, res) => {
  Job.find()
    .then((jobs) => res.status(200).json(jobs))
    .catch((err) => res.status(500).json({ message: err.message }));
});

router.get("/companies", getAllCompanies);

router.get("/jobseekers", getAllJobseekers);

router.get("/applications", async (req, res) => {
  Application.find()
    .then((applications) => res.status(200).json(applications))
    .catch((err) => res.status(500).json({ message: err.message }));
});

router.get("/getqueries", getQueries);

router.get("/getAllTestimonials", getTestimonials);

module.exports = router;
