const pdfParseModule = require("pdf-parse")
const pdfParse = pdfParseModule.default || pdfParseModule

const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");

const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Generate interview report
 */
async function generateInterViewReportController(req, res) {
  try {

    let resumeText = "";

    if (req.file) {

      const parsedPdf = await pdfParse(req.file.buffer);

      resumeText = parsedPdf.text;

    }

    const { selfDescription, jobDescription } = req.body;

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: "507f1f77bcf86cd799439011",
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });

  }
}

/**
 * @description Get interview report by ID
 */
async function getInterviewReportByIdController(req, res) {
  try {

    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });

  }
}

/**
 * @description Get all interview reports
 */
async function getAllInterviewReportsController(req, res) {
  try {

    const interviewReports = await interviewReportModel
      .find({})
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
      );

    res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });

  }
}

/**
 * @description Generate resume PDF
 */
async function generateResumePdfController(req, res) {
  try {

    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findById(
      interviewReportId
    );

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    const { resume, jobDescription, selfDescription } =
      interviewReport;

    const pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    res.send(pdfBuffer);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });

  }
}

module.exports = {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};