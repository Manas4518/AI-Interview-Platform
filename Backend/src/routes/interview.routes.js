const { Router } = require("express");

const {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
} = require("../controllers/interview.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const multer = require("multer");

const upload = multer();

const interviewRouter = Router();

/**
 * Generate Interview Report
 */
interviewRouter.post(
  "/generate",
  upload.single("resume"),
  authMiddleware.authUser,
  generateInterViewReportController
);

/**
 * Get all reports
 */
interviewRouter.get(
  "/reports",
  authMiddleware.authUser,
  getAllInterviewReportsController
);

/**
 * Get report by ID
 */
interviewRouter.get(
  "/reports/:interviewId",
  authMiddleware.authUser,
  getInterviewReportByIdController
);

/**
 * Generate Resume PDF
 */
interviewRouter.get(
  "/resume/:interviewReportId",
  authMiddleware.authUser,
  generateResumePdfController
);

module.exports = interviewRouter;