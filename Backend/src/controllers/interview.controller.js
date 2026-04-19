const { generateInterviewReport, generateResumePdf } = require('../services/ai.service');
const pdfParse = require('pdf-parse');
const interviewReportModel = require('../models/interviewReport.model');

/**
 * @desc    Generate interview report based on resume and job description
 * @route   POST /api/interview/generate-report
 * @access  Private
 * @param   {Object} req - Request object
 * @param   {Object} req.body - Request body
 * @param   {string} req.body.resume - Resume data
 * @param   {string} req.body.selfDescription - Self description
 * @param   {string} req.body.jobDescription - Job description
 * @returns {Object} Interview report with match score and recommendations
 */
const generateInterviewReportController = async (req, res) => {
  try {
    const { selfDescription, jobDescription } = req.body;
    const resumeFile = req.file;

    // Validate required fields
    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({
        error: 'Job description is required',
      });
    }

    if (!resumeFile) {
      return res.status(400).json({
        error: 'Resume file is required',
      });
    }

    // Parse PDF file to extract text content
    let resumeContent;
    try {
      const uint8Array = new Uint8Array(resumeFile.buffer);
      const parser = await new pdfParse.PDFParse(uint8Array).getText();
      resumeContent = parser.text;
    } catch (parseError) {
      console.log(parseError);
      return res.status(400).json({
        error: 'Failed to parse PDF file',
      });
    }

    const response = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    // Save interview report to database
    const interviewReport = await interviewReportModel.create({
      jobDescription,
      resume: resumeContent,
      selfDescription,
      matchScore: response.matchScore,
      technicalQuestions: response.technicalQuestions,
      behavioralQuestions: response.behavioralQuestions,
      skillGaps: response.skillGaps,
      preparationPlan: response.preparationPlan,
      user: req.user.id,
      title: response.title || 'Interview Report',
    });

    res.json({
      interviewReport: {
        user: req.user.id,
        resume: resumeContent,
        selfDescription,
        jobDescription,
        ...interviewReport._doc,
      },
      message: 'Interview report generated successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

/**
 * @desc    Get interview report by ID
 * @route   GET /api/interview/:id
 * @access  Private
 * @param   {Object} req - Request object
 * @param   {string} req.params.id - Interview report ID
 * @returns {Object} Interview report
 */
const getInterviewReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const interviewReport = await interviewReportModel
      .findById(id)
      .populate('user', 'name email');

    if (!interviewReport) {
      return res.status(404).json({ error: 'Interview report not found' });
    }

    // Ensure user can only access their own reports
    if (interviewReport.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({interviewReport, message: 'Interview report fetched successfully'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportById,
  getAllInterviewReportsController,
  generateResumePdfController,
};
