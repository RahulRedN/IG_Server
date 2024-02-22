const express = require("express");
const { getrecentUsersStats, getAllJobseekers, getAllCompanies, getTestimonials, getQueries, deleteTestimonial, bookmarkUpdate } = require("../controllers/adminController");
const router = express.Router();

router.get("/homestats", getrecentUsersStats);
router.get('/getalljobseekers', getAllJobseekers);
router.get('/getallcompanies', getAllCompanies);
router.get('/getalltestimonials', getTestimonials);
router.get('/getqueries', getQueries);

router.post('/deleteTestimonial', deleteTestimonial);
router.post('/bookmarkupdate', bookmarkUpdate)



module.exports = router;