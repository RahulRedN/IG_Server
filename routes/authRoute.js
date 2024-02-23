const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync')

const {
  registerJobseeker,
  registerCompany,
  logout,
  loginCompany,
  loginJobseeker,
  loginAdmin,
} = require("../controllers/authController");

const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


router.post("/registerCompany", registerCompany);
router.post("/registerJobseeker", upload.single("image"), catchAsync(registerJobseeker));


router.post("/loginCompany", loginCompany);
router.post("/loginJobseeker", loginJobseeker);
router.post('/loginAdmin', loginAdmin);

router.get("/logout", logout);

module.exports = router;
