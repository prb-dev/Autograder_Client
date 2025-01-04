// src/pages/technical/ViewTechnicalAnswers.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";

/** 
 *  Example answered exam shape. 
 *  Typically you'd have an exam ID, a student ID, 
 *  plus maybe a submission ID, timestamp, etc.
 */
type AnsweredExam = {
  _id: string;        // submission ID
  examId: string;     // which exam was answered
  studentId: string;  // which student
  studentName: string;
  submittedAt: string; 
};

export default function ViewTechnicalAnswers() {
  const [answers, setAnswers] = useState<AnsweredExam[]>([]);
  const navigate = useNavigate();

  // 1) Fetch answered exam papers on mount
  useEffect(() => {
    async function fetchData() {
      // Example mock data
      // Replace with real fetch from your server:
      const mockData: AnsweredExam[] = [
        {
          _id: "sub111",
          examId: "exam111",
          studentId: "stud01",
          studentName: "John Doe",
          submittedAt: "2023-12-01 10:10",
        },
        {
          _id: "sub222",
          examId: "exam111",
          studentId: "stud02",
          studentName: "Jane Smith",
          submittedAt: "2023-12-01 10:35",
        },
      ];
      setAnswers(mockData);
    }
    fetchData();
  }, []);

  // 2) Delete 
  async function handleDeleteSubmission(subId: string) {
    // e.g. await fetch(`yourapi/submissions/${subId}`, { method: 'DELETE' })
    setAnswers((prev) => prev.filter((ans) => ans._id !== subId));
    alert(`Deleted submission: ${subId} (mock)`);
  }

  // 3) PDF Download
  async function handleDownloadPdf(subId: string) {
    // e.g. fetch the PDF from server, or generate it, etc.
    alert(`Downloading PDF for submission: ${subId} (mock)`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <TypographyH2>All Student Answers</TypographyH2>

      <div className="mt-5 space-y-3">
        {answers.length === 0 ? (
          <p>No answers found.</p>
        ) : (
          answers.map((ans) => (
            <div
              key={ans._id}
              className="p-4 border rounded-md flex items-center justify-between"
            >
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {ans.studentName} ({ans.studentId})
                </p>
                <p>Exam ID: {ans.examId}</p>
                <p>Submitted At: {ans.submittedAt}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPdf(ans._id)}
                >
                  PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/view-answers/t/${ans._id}`)}
                >
                  View
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteSubmission(ans._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
