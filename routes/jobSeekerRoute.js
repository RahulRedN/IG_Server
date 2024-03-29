const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  UserDetails,
  Jobs,
  setFavJobs,
  removeFavJobs,
  updateDetails,
  updatephoto,
  applyJob,
  updateSkills,
  noOfApplicants,
  postReview,
  postTestimonial,
} = require("../controllers/jobController");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/user", UserDetails);

router.post("/addfav", setFavJobs);
router.post("/removefav", removeFavJobs);
router.post("/updatedetails", updateDetails);
router.post("/updatephoto", upload.single("image"), catchAsync(updatephoto));
router.get("/jobs", Jobs);
router.post("/applyjob", applyJob);
router.post("/postReview", postReview);
router.post("/updateskills", updateSkills);
router.post("/noofapplications", noOfApplicants);
router.post("/testimonial", postTestimonial);

module.exports = router;
