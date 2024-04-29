const express = require("express");
const {
  getrecentUsersStats,
  getAllJobseekers,
  getAllCompanies,
  getTestimonials,
  getQueries,
  deleteTestimonial,
  bookmarkUpdate,
  deleteUser,
  deleteCompany,
  updateCompany,
  getpendingCompanies,
} = require("../controllers/adminController");
const auth = require("../middleware/AuthenticationMiddleware");
const { isAdmin } = require("../middleware/Validators");
const router = express.Router();

router.use(auth, isAdmin);
router.get("/homestats", getrecentUsersStats);
router.get("/getalljobseekers", getAllJobseekers);
router.get("/getallcompanies", getAllCompanies);
router.get("/pendingCompanies", getpendingCompanies);
router.get("/getalltestimonials", getTestimonials);
router.get("/getqueries", getQueries);

router.post("/deleteTestimonial", deleteTestimonial);
router.post("/bookmarkupdate", bookmarkUpdate);
router.post("/deleteUser", deleteUser);
router.post("/deleteCompany", deleteCompany);
router.post("/updateCompany", updateCompany);

module.exports = router;
