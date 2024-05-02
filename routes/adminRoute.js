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
  updateFavoriteTestimonial
} = require("../controllers/adminController");
const auth = require("../middleware/AuthenticationMiddleware");
const { isAdmin } = require("../middleware/Validators");
const router = express.Router();
router.use(auth, isAdmin);
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */


/**
 * @swagger
 * /api/admin/homestats:
 *   get:
 *     summary: Get recent users statistics
 *     tags: [Admin]
 *     description: Retrieve recent users statistics from the server.
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recentusers:
 *                   type: array
 *                   items:
 *                     type: object
 *                 recentcompanies:
 *                   type: array
 *                   items:
 *                     type: object
 *                 USR:
 *                   type: number
 *                   description: Total user count
 *                 CCR:
 *                   type: number
 *                   description: Total accepted company count
 *                 ICR:
 *                   type: number
 *                   description: Total incoming requests count
 *                 RCR:
 *                   type: number
 *                   description: Total reviews count
 */
router.get("/homestats", getrecentUsersStats);


/**
 * @swagger
 * /api/admin/getalljobseekers:
 *   get:
 *     summary: Get all jobseekers
 *     tags: [Admin]
 *     description: Retrieve all jobseekers from the server.
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: No jobseekers found
 */
router.get('/getalljobseekers', getAllJobseekers);


/**
 * @swagger
 * /api/admin/getallcompanies:
 *   get:
 *     summary: Get all non-pending companies
 *     tags: [Admin]
 *     description: Retrieve all non-pending companies along with the number of jobs posted and applications received for each company.
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companies:
 *                   type: array
 *                   items:
 *                     type: object
 *                 jobsPosted:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: An array containing the number of jobs posted by each company
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: An array containing the number of applications received for jobs posted by each company
 *       '404':
 *         description: No non-pending companies found
 *       '500':
 *         description: Internal server error
 */

router.get('/getallcompanies', getAllCompanies);


/**
 * @swagger
 * /api/admin/pendingCompanies:
 *   get:
 *     summary: Get all companies
 *     description: Retrieve a list of all companies excluding those with status "pending".
 *     tags: [Admin]
 *     responses:
 *       '200':
 *         description: A successful response
 */
router.get("/pendingCompanies", getpendingCompanies)

/**
 * @swagger
 * /api/admin/getalltestimonials:
 *   get:
 *     summary: Get all testimonials
 *     tags: [Admin]
 *     description: Retrieve all testimonials from the server.
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 testimonials:
 *                   type: array
 *                   items:
 *                     type: object                       
 *       '404':
 *         description: No testimonials found
 */
router.get('/getalltestimonials', getTestimonials);

// ????????????
router.get('/getqueries', getQueries);


/**
 * @swagger
 * /api/admin/deleteTestimonial:
 *   delete:
 *     summary: Delete a testimonial
 *     tags: [Admin]
 *     description: Delete a testimonial by its ID from the server.
 *     parameters:
 *       - in: query
 *         name: tid
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the testimonial to delete
 *     responses:
 *       '200':
 *         description: Testimonial deleted successfully
 *       '404':
 *         description: Testimonial not found
 */
router.delete('/deleteTestimonial', deleteTestimonial);


/**
 * @swagger
 * /api/admin/bookmarkupdate:
 *   put:
 *     summary: Update bookmark status of a testimonial (true/false)
 *     tags: [Admin]
 *     description: Update the bookmark status of a testimonial by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tid:
 *                 type: string
 *                 description: The ID of the testimonial to update
 *               action:
 *                 type: string
 *                 description: The action to perform (true/false) to bookmark/unbookmark the testimonial
 *     responses:
 *       '200':
 *         description: Testimonial updated successfully
 *       '404':
 *         description: Testimonial not found
 */
router.put('/bookmarkupdate', bookmarkUpdate)

/**
 * @swagger
 * /api/admin/deleteUser:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     description: Delete a user by their ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: The ID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 */
router.delete('/deleteUser', deleteUser)


/**
 * @swagger
 * /api/admin/deleteCompany:
 *   delete:
 *     summary: Delete a company
 *     tags: [Admin]
 *     description: Delete a company by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: The ID of the company to delete
 *     responses:
 *       '200':
 *         description: Company deleted successfully
 *       '404':
 *         description: Company not found
 */
router.delete('/deleteCompany', deleteCompany)

/**
 * @swagger
 * /api/admin/updateCompany:
 *   put:
 *     summary: Updates company status
 *     tags: [Admin]
 *     description: Update the status of a company.
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
 *               status:
 *                 type: string
 *                 description: The new status of the company
 *     responses:
 *       '200':
 *         description: Company updated successfully
 *       '404':
 *         description: Company not found
 */
router.put('/updateCompany', updateCompany)

/**
 * @swagger
 * /api/admin/updateFavorite:
 *   put:
 *     summary: Update favorite status of a testimonial
 *     tags: [Admin]
 *     description: Update the favorite status of a testimonial by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tid:
 *                 type: string
 *                 description: The ID of the testimonial to update
 *               isFavorite:
 *                 type: boolean
 *                 description: The new favorite status of the testimonial
 *     responses:
 *       '200':
 *         description: Testimonial favorite status updated successfully
 *       '404':
 *         description: Testimonial not found
 */
router.put('/updateFavoriteTestimonial', updateFavoriteTestimonial);


module.exports = router;
