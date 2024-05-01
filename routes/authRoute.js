const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const {
  registerJobseeker,
  registerCompany,
  logout,
  loginCompany,
  loginJobseeker,
  loginAdmin,
} = require("../controllers/authController");

const multer = require("multer");

const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.post("/registerCompany", registerCompany);
router.post(
  "/registerJobseeker",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  catchAsync(registerJobseeker)
);
/**
 * @swagger
 * tags:
 *  - name: Auth
 */

/**
 * @swagger
 * /api/auth/loginCompany:
 *   post:
 *     summary: Login as a company
 *     description: Endpoint for company login
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
 *                 description: Email of the company
 *               password:
 *                 type: string
 *                 description: Password of the company
 *     responses:
 *       '200':
 *         description: Company logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Company:
 *                   type: object
 *                   description: Information about the logged-in company
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the company
 *                     _id:
 *                       type: string
 *                       description: ID of the company
 *                     role:
 *                       type: string
 *                       description: Role of the user (in this case, "company")
 *                 cookie:
 *                   type: string
 *                   description: Authentication cookie
 *       '400':
 *         description: Bad request or missing email/password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *       '401':
 *         description: Email does not exist, invalid password, or account pending/rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 */

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
router.post("/loginJobseeker", loginJobseeker);

/**
 * @swagger
 * /api/auth/loginAdmin:
 *   post:
 *     summary: Login as an admin
 *     description: Endpoint for admin login
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
 *                 description: Email of the admin
 *               password:
 *                 type: string
 *                 description: Password of the admin
 *     responses:
 *       '200':
 *         description: Admin logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Admin:
 *                   type: object
 *                   description: Information about the logged-in admin
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Email of the admin
 *                     _id:
 *                       type: string
 *                       description: Password of the admin
 *                     role:
 *                       type: string
 *                       description: Role of the user (in this case, "Admin")
 *                 cookie:
 *                   type: string
 *                   description: Authentication cookie
 *       '400':
 *         description: Bad request or missing email/password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *       '401':
 *         description: Unauthorized - invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 */
router.post("/loginAdmin", loginAdmin);

router.get("/logout", logout);

module.exports = router;
