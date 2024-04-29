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


/**
 * @swagger
 * tags:
 *  - name: JobSeeker
 */

/**
* @swagger
* /api/jobseeker/user:
*   get:
*     summary: Get details of a job seeker
*     parameters:
*       - in: query
*         name: uid
*         required: true
*         schema:
*           type: string
*         description: The ID of the user
*     responses:
*       '200':
*         description: User details retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 user:
*                   type: object
*                   description: Details of the job seeker
*                 applications:
*                   type: array
*                   description: List of job applications made by the job seeker
*                   items:
*                     type: object
*                     properties:
*                       _id:
*                         type: string
*                         description: ID of the application
*                       jobId:
*                         type: string
*                         description: ID of the job applied for
*                       userId:
*                         type: string
*                         description: ID of the job seeker who made the application
*                 jobs:
*                   type: array
*                   description: List of all available jobs
*                   items:
*                     type: object
*                     properties:
*                       _id:
*                         type: string
*                         description: ID of the job
*                       title:
*                         type: string
*                         description: Title of the job
*                       description:
*                         type: string
*                         description: Description of the job
*                     
*       '404':
*         description: User not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 msg:
*                   type: string
*                   description: Error message
*       '500':
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 msg:
*                   type: string
*                   description: Error message
*/

router.get("/user", UserDetails);

/**
* @swagger
* /api/jobseeker/addfav:
*   post:
*     summary: Add a job to user's favorites
*     parameters:
*       - in: query
*         name: uid
*         required: true
*         schema:
*           type: string
*         description: The ID of the user
*       - in: query
*         name: jid
*         required: true
*         schema:
*           type: string
*         description: The ID of the job to add to favorites
*     responses:
*       '200':
*         description: Job added to favorites successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 msg:
*                   type: string
*                   description: Success message
*       '404':
*         description: User not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 msg:
*                   type: string
*                   description: Error message
*/
router.post("/addfav", setFavJobs);



/**
* @swagger
* /api/jobseeker/removefav:
*   post:
*     summary: Remove a job from user's favorites
*     parameters:
*       - in: query
*         name: uid
*         required: true
*         schema:
*           type: string
*         description: The ID of the user
*       - in: query
*         name: jid
*         required: true
*         schema:
*           type: string
*         description: The ID of the job to remove from favorites
*     responses:
*       '200':
*         description: Job removed from favorites successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 msg:
*                   type: string
*                   description: Success message
*       '404':
*         description: User not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 msg:
*                   type: string
*                   description: Error message
*/
router.post("/removefav", removeFavJobs);

/**
 * @swagger
 * /api/jobseeker/updatedetails:
 *   post:
 *     summary: Update job seeker details
 *     description: Endpoint to update job seeker details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *                 description: First name of the user
 *               mobile:
 *                 type: string
 *                 description: Mobile number of the user
 *               address:
 *                 type: string
 *                 description: Address of the user
 *               uid:
 *                 type: string
 *                 description: The ID of the user
 *     responses:
 *       '200':
 *         description: User details updated successfully
 *       '404':
 *         description: User not found
 */
router.post('/updatedetails', updateDetails)


/**
 * @swagger
 * /api/jobseeker/updatephoto:
 *   post:
 *     summary: Update user photo
 *     description: Endpoint to update the photo of a job seeker
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: The image file to upload
 *       - in: formData
 *         name: uid
 *         type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       '200':
 *         description: Photo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *                 img:
 *                   type: string
 *                   description: URL of the updated photo
 *       '404':
 *         description: User not found
 */
router.post('/updatephoto', upload.single('image'), catchAsync(updatephoto))

/**
* @swagger
* /api/jobseeker/jobs:
*   get:
*     summary: Get all available jobs
*     responses:
*       '200':
*         description: List of all available jobs
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 jobs:
*                   type: array
*                   description: List of available jobs
*                   items:
*                     type: object
*                     properties:
*                       _id:
*                         type: string
*                         description: ID of the job
*                       title:
*                         type: string
*                         description: Title of the job
*                       description:
*                         type: string
*                         description: Description of the job
*       '500':
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 msg:
*                   type: string
*                   description: Error message
*/
router.get("/jobs", Jobs);

/**
 * @swagger
 * /api/jobseeker/applyjob:
 *   post:
 *     summary: Apply for a job
 *     description: Endpoint to apply for a job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: The ID of the user applying for the job
 *               jid:
 *                 type: string
 *                 description: The ID of the job being applied for
 *     responses:
 *       '200':
 *         description: Applied to job successfully
 *       '400':
 *         description: Bad request or validation failed
 *       '404':
 *         description: User or job not found
 *       '500':
 *         description: Internal server error
 */
router.post('/applyjob', applyJob)

/**
 * @swagger
 * /api/jobseeker/postReview:
 *   post:
 *     summary: Post a review for an accepted job application
 *     description: Allows job seekers to post a review for an accepted job application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: The ID of the user posting the review
 *               aid:
 *                 type: string
 *                 description: The ID of the accepted job application for which the review is being posted
 *               type:
 *                 type: string
 *                 description: The type of review (e.g., 'positive', 'negative', 'neutral')
 *               rating:
 *                 type: number
 *                 description: The rating given in the review (e.g., 1-5)
 *               feedback:
 *                 type: string
 *                 description: Additional feedback provided in the review
 *     responses:
 *       '200':
 *         description: Review posted successfully
 *       '400':
 *         description: Bad request or review failed
 *       '404':
 *         description: Application not found or not accepted
 */
router.post("/postReview", postReview);

/**
 * @swagger
 * /api/jobseeker/updateskills:
 *   post:
 *     summary: Update job seeker skills
 *     description: Endpoint to update job seeker skills
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: The ID of the user
 *               skills:
 *                 type: array
 *                 description: Array of skills to be updated
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Skills updated successfully
 *       '404':
 *         description: User not found
 */
router.post('/updateskills', updateSkills)

/**
 * @swagger
 * /api/jobseeker/noofapplications:
 *   post:
 *     summary: Get the number of applicants for one or more jobs
 *     description: Endpoint to get the number of applicants for one or more jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jid:
 *                 type: array
 *                 description: Array of job IDs
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Number of applicants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applications:
 *                   type: array
 *                   description: Array containing objects with job IDs and corresponding number of applicants
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Job ID
 *                       count:
 *                         type: number
 *                         description: Number of applicants for the job
 *       '400':
 *         description: Bad request or invalid input
 */
router.post('/noofapplications', noOfApplicants)


/**
 * @swagger
 * /api/jobseeker/testimonial:
 *   post:
 *     summary: Post a testimonial
 *     description: Endpoint to post a testimonial for a job seeker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: The ID of the user for whom the testimonial is being posted
 *               message:
 *                 type: string
 *                 description: The testimonial message
 *     responses:
 *       '200':
 *         description: Testimonial posted successfully
 *       '400':
 *         description: Bad request or testimonial failed
 */
router.post('/testimonial', postTestimonial)

module.exports = router;
