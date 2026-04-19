const express = require('express');
const router = express.Router();
const authUserMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { generateInterviewReportController, getAllInterviewReportsController, getInterviewReportById } = require('../controllers/interview.controller');

/**
 * @route   POST /api/interview/
 * @desc    Generate interview report based on resume and job description
 * @access  Private
 */
router.post('/', authUserMiddleware, upload.single('resume'), generateInterviewReportController);

/**
 * @route   GET /api/interview/
 * @desc    Get all interview reports for logged-in user
 * @access  Private
 */
router.get('/', authUserMiddleware, getAllInterviewReportsController);


/**
 * @route   GET /api/interview/report/:id
 * @desc    Get interview report by ID
 * @access  Private
 */
router.get('/report/:id', authUserMiddleware, getInterviewReportById);

module.exports = router;