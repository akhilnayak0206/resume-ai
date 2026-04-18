import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface InterviewReport {
  _id: string;
  title?: string;
  matchScore: number;
  technicalQuestions: any[];
  behavioralQuestions: any[];
  preparationPlan: any[];
  skillGaps: any[];
  createdAt: string;
}

interface InterviewContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  report: InterviewReport | null;
  setReport: (report: InterviewReport | null) => void;
  reports: InterviewReport[];
  setReports: (reports: InterviewReport[]) => void;
}

export const InterviewContext = createContext<InterviewContextType | undefined>(undefined)

interface InterviewProviderProps {
  children: ReactNode;
}

export const InterviewProvider = ({ children }: InterviewProviderProps) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState<InterviewReport | null>(null)
    const [reports, setReports] = useState<InterviewReport[]>([])

    const value: InterviewContextType = {
      loading,
      setLoading,
      report,
      setReport,
      reports,
      setReports
    }

    return (
        <InterviewContext.Provider value={value}>
            {children}
        </InterviewContext.Provider>
    )
}
