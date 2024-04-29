const express = require("express");
const {
  companyDetails,
  updateJobRequest,
  postJob,
  updateJob,
  deleteJob,
} = require("../controllers/companyController");
const { isCompany } = require("../middleware/Validators");
const auth = require("../middleware/AuthenticationMiddleware");
const router = express.Router();

router.use(auth, isCompany);
router.get("/user", companyDetails);

router.post("/updatejobRequest", updateJobRequest);
router.post("/postjob", postJob);
router.post("/updatejob", updateJob);
router.post("/deletejob", deleteJob);

module.exports = router;
