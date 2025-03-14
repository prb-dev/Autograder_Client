// src/pages/technical/lecturer/ViewTechnicalAnswers.tsx

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useNavigate, useParams } from "react-router-dom";

/** 
 * Extended answered exam shape to include 'reviewed' status, module details, and totalMarks.
 */
type AnsweredExam = {
  _id: string;           // submission ID
  examId: string;        // exam ID
  moduleName: string;    // module name
  moduleCode: string;    // module code
  year: string;          // year
  semester: string;      // semester
  studentId: string;     // student ID
  studentName: string;   // student name
  completedAt: string;   // submission timestamp
  reviewed: boolean;     // indicates if reviewed
  totalMarks: number;    // total marks
};

export default function ViewTechnicalAnswers() {
  const { examId } = useParams<{ examId?: string }>(); // examId is optional now
  const [answers, setAnswers] = useState<AnsweredExam[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // Determine URL based on presence of examId
        const url = examId
          ? `${import.meta.env.VITE_TECHNICAL_API_URL}/api/submissions/exam/${examId}`
          : `${import.meta.env.VITE_TECHNICAL_API_URL}/api/submissions`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch submissions");
        const data: AnsweredExam[] = await response.json();

        // Ensure all marks are numbers and rename 'completedAt' to 'submittedAt' if needed
        const numericData = data.map(ans => ({
          ...ans,
          totalMarks: Number(ans.totalMarks),
          submittedAt: ans.completedAt, // Handle possible 'completedAt' field
        }));

        setAnswers(numericData);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        alert("Failed to load submissions. Please try again later.");
      }
    }
    fetchData();
  }, [examId]);

  async function handleDeleteSubmission(subId: string) {
    if (!window.confirm(`Are you sure you want to delete submission ${subId}?`)) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_TECHNICAL_API_URL}/api/submissions/${subId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Deletion failed");
      setAnswers(prev => prev.filter(ans => ans._id !== subId));
      alert(`Deleted submission: ${subId}`);
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("Failed to delete submission. Please try again.");
    }
  }

  async function handleDownloadPdf(subId: string) {
    try {
      const response = await fetch(`${import.meta.env.VITE_TECHNICAL_API_URL}/api/submissions/${subId}/pdf`, {
        method: "GET",
        headers: {
          // Include authentication headers if required
        },
      });
      if (!response.ok) throw new Error("Failed to download PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Submission_${subId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  }

  const reviewedAnswers = answers.filter(ans => ans.reviewed);
  const notReviewedAnswers = answers.filter(ans => !ans.reviewed);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <TypographyH2>
        All Student Answers{examId ? ` for Exam ${examId}` : ""}
      </TypographyH2>

      <div className="mt-5">
        <TypographyH2 className="text-lg">Not Reviewed</TypographyH2>
        {notReviewedAnswers.length === 0 ? (
          <p>No unreviewed answers found.</p>
        ) : (
          notReviewedAnswers.map((ans) => (
            <div
              key={ans._id}
              className="p-4 border rounded-md flex items-center justify-between mb-2"
            >
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {ans.studentName} ({ans.studentId})
                </p>
                <p>Exam ID: {ans.examId}</p>
                <p>Module: {ans.moduleName} ({ans.moduleCode})</p>
                <p>Year: {ans.year}</p>
                <p>Semester: {ans.semester}</p>
                <p>Submitted At: {new Date(ans.completedAt).toLocaleString()}</p>
                <p>Total Marks: {ans.totalMarks}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleDownloadPdf(ans._id)}>
                  PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/view-answers/t/${ans._id}`)}
                >
                  View & Edit
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

      <div className="mt-10">
        <TypographyH2 className="text-lg">Reviewed</TypographyH2>
        {reviewedAnswers.length === 0 ? (
          <p>No reviewed answers found.</p>
        ) : (
          reviewedAnswers.map((ans) => (
            <div
              key={ans._id}
              className="p-4 border rounded-md flex items-center justify-between mb-2"
            >
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {ans.studentName} ({ans.studentId})
                </p>
                <p>Exam ID: {ans.examId}</p>
                <p>Module: {ans.moduleName} ({ans.moduleCode})</p>
                <p>Year: {ans.year}</p>
                <p>Semester: {ans.semester}</p>
                <p>Submitted At: {new Date(ans.completedAt).toLocaleString()}</p>
                <p>Total Marks: {ans.totalMarks}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleDownloadPdf(ans._id)}>
                  PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/view-answers/t/${ans._id}`)}
                >
                  View & Edit
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
