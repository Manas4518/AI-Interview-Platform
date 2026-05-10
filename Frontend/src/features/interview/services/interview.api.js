import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

/**
 * Generate interview report
 */
export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
}) => {

    const formData = new FormData();

    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post(
        "/api/interview/generate",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

/**
 * Get interview report by ID
 */
export const getInterviewReportById = async (interviewId) => {

    const response = await api.get(
        `/api/interview/reports/${interviewId}`
    );

    return response.data;
};

/**
 * Get all interview reports
 */
export const getAllInterviewReports = async () => {

    const response = await api.get(
        "/api/interview/reports"
    );

    return response.data;
};

/**
 * Generate resume PDF
 */
export const generateResumePdf = async ({
    interviewReportId,
}) => {

    const response = await api.get(
        `/api/interview/resume/${interviewReportId}`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};