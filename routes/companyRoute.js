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
/**
 * @swagger
 * tags:
 *  - name: Company
 */
/**
 * @swagger
 * /api/company/user:
 *   get:
 *     summary: Get company details
 *     tags: [Company]
 *     description: Retrieve company details including company information, jobs, and user information.
 *     parameters:
 *       - in: query
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique identifier of the company
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company:
 *                   type: object
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                 companyJobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                 userInfo:
 *                   type: array
 *                   items:
 *                     type: object
 *       '404':
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating that the company was not found
 */
router.get("/user", companyDetails);


/**
 * @swagger
 * /api/company/updatejobRequest:
 *   put:
 *     summary: Update job request
 *     tags: [Company]
 *     description: Update the status of a job request (accept/reject).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appId:
 *                 type: string
 *                 description: The ID of the job application to update
 *               action:
 *                 type: string
 *                 enum: [accept, reject]
 *                 description: The action to perform on the job application (accept or reject)
 *     responses:
 *       '200':
 *         description: Successfully updated job request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Update Successful
 *       '404':
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Application not found
 */
router.put("/updatejobRequest", updateJobRequest);


/**
 * @swagger
 * /api/company/postjob:
 *   post:
 *     summary: Post a job
 *     tags: [Company]
 *     description: Post a job with various details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: The ID of the company posting the job
 *               companyName:
 *                 type: string
 *                 description: The name of the company posting the job
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The responsibilities of the job
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The required skills for the job
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The benefits offered by the job
 *               experience:
 *                 type: string
 *                 description: The required experience for the job
 *               jobDesc:
 *                 type: string
 *                 description: The description of the job
 *               salary:
 *                 type: number
 *                 description: The salary offered for the job
 *               location:
 *                 type: string
 *                 description: The location of the job
 *               position:
 *                 type: string
 *                 description: The position/title of the job
 *               totalPositions:
 *                 type: number
 *                 description: The total number of positions available for the job
 *               vacancies:
 *                 type: number
 *                 description: The number of vacancies available for the job
 *               joiningDate:
 *                 type: string
 *                 format: date
 *                 description: The joining date for the job
 *     responses:
 *       '200':
 *         description: Job posted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating that the job was posted successfully
 *                 jobId:
 *                   type: string
 *                   description: The ID of the posted job
 *       '400':
 *         description: Job posting failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating that the job posting failed
 */
router.post("/postjob", postJob);


/**
 * @swagger
 * /api/company/updatejob:
 *   post:
 *     summary: Update a job
 *     tags: [Company]
 *     description: Update a job with the given details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: The unique identifier of the job to be updated
 *               experience:
 *                 type: number
 *                 description: The experience required for the job
 *               salary:
 *                 type: number
 *                 description: The salary offered for the job
 *               position:
 *                 type: string
 *                 description: The position/title of the job
 *               totalPositions:
 *                 type: number
 *                 description: The total number of positions available for the job
 *               joiningDate:
 *                 type: string
 *                 format: date
 *                 description: The joining date for the job
 *     responses:
 *       '200':
 *         description: Successfully updated the job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating successful job update
 *       '400':
 *         description: Job update failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating that the job update failed
 */
router.post("/updatejob", updateJob);


/**
 * @swagger
 * /api/company/deletejob:
 *   delete:
 *     summary: Delete a job
 *     tags: [Company]
 *     description: Delete a job by providing the company's unique identifier (uid) and the job's identifier (jobId).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: The unique identifier of the company
 *               jobId:
 *                 type: string
 *                 description: The unique identifier of the job to be deleted
 *     responses:
 *       '200':
 *         description: Successfully deleted the job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating that the job has been deleted
 *       '404':
 *         description: Company, job, or applications not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating that the company, job, or applications were not found
 */
router.delete("/deletejob",deleteJob);

module.exports = router;
