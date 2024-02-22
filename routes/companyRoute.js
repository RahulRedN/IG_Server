const express = require("express");
const {
  companyDetails,
  updateJobRequest,
  postJob,
  updateJob,
} = require("../controllers/companyController");
const router = express.Router();

router.get("/user", companyDetails);

router.post("/updatejobRequest", updateJobRequest);
router.post("/postjob", postJob);
router.post("/updatejob", updateJob);

module.exports = router;
