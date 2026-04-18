import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router-dom";

export interface ReportData {
  jobDescription: string;
  selfDescription: string;
  resumeFile?: File;
}

export interface InterviewReport {
  _id: string;
  title?: string;
  matchScore: number;
  technicalQuestions: any[];
  behavioralQuestions: any[];
  preparationPlan: any[];
  skillGaps: any[];
  createdAt: string;
}

export interface UseInterviewReturn {
  loading: boolean;
  report: InterviewReport | null;
  reports: InterviewReport[];
  generateReport: (data: ReportData) => Promise<InterviewReport>;
  getReportById: (id: string) => Promise<InterviewReport>;
  getReports: () => Promise<InterviewReport[]>;
  getResumePdf: (interviewReportId: string) => Promise<void>;
}


export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams<{ interviewId: string }>();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }: ReportData): Promise<InterviewReport> => {
        setLoading(true);
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (error) {
            console.error('Generate report error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const getReportById = async (id: string): Promise<InterviewReport> => {
        setLoading(true);
        try {
            const response = await getInterviewReportById(id);
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (error) {
            console.error('Get report by ID error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const getReports = async (): Promise<InterviewReport[]> => {
        setLoading(true);
        try {
            const response = await getAllInterviewReports();
            setReports(response.interviewReports);
            return response.interviewReports;
        } catch (error) {
            console.error('Get all reports error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const getResumePdf = async (interviewReportId: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await generateResumePdf({ interviewReportId });
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Get resume PDF error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [interviewId]);

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf } as UseInterviewReturn;
}
