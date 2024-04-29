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

/**
 * @swagger
 * /api/auth/loginJobseeker:
 *   post:
 *     summary: Login as a job seeker
 *     description: Endpoint for job seeker login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the job seeker
 *               password:
 *                 type: string
 *                 description: Password of the job seeker
 *     responses:
 *       '200':
 *         description: Job seeker logged in successfully
 *       '400':
 *         description: Bad request or missing email/password
 *       '401':
 *         description: Email does not exist or invalid password
 */
router.post('/loginJobseeker', loginJobseeker)

router.post("/loginJobseeker", loginJobseeker);
router.post('/loginAdmin', loginAdmin);

router.get("/logout", logout);

module.exports = router;
