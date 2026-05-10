import { useEffect, useState } from "react";

import {
    generateInterviewReport,
    getAllInterviewReports,
} from "../services/interview.api";

export const useInterview = () => {

    const [loading, setLoading] = useState(false);

    const [reports, setReports] = useState([]);

    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile,
    }) => {

        try {

            setLoading(true);

            const data = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile,
            });

            console.log("GENERATED REPORT:", data);

            return data;

        } catch (err) {

            console.log("GENERATE ERROR:", err);

            alert("Failed to generate report");

        } finally {

            setLoading(false);

        }

    };

    const getReports = async () => {

        try {

            const data = await getAllInterviewReports();

            console.log("REPORTS:", data);

            if (data && data.interviewReports) {
                setReports(data.interviewReports);
            }

        } catch (err) {

            console.log("REPORT ERROR:", err);

        }

    };

    useEffect(() => {

        getReports();

    }, []);

    return {
        loading,
        reports,
        generateReport,
    };
};