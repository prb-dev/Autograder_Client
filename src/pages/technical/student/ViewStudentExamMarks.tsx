// src/pages/technical/student/ViewStudentExamMarks.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";

/**
 * Structure of a question's marks and feedback
 */
type QuestionMarks = {
  questionNumber: number;
  studentMarks: number;
  feedback: string;
};

/**
 * The exam detail now includes:
 * - moduleName, moduleCode
 * - year, semester
 * - totalMarks
 * - array of questionNumber + studentMarks + feedback
 */
type ExamMarksDetail = {
  submissionId: string;
  moduleName: string;
  moduleCode: string;
  year: string;
  semester: string;
  totalMarks: number;
  questions: QuestionMarks[];
};

export default function ViewStudentExamMarks() {
  const { subId } = useParams<{ subId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [examDetail, setExamDetail] = useState<ExamMarksDetail | null>(null);

  // Hardcoded studentId for now
  const studentId = "student123";

  // Fetch the marks detail for the given submission ID
  useEffect(() => {
    async function fetchMarks() {
      if (!subId) {
        console.error("No submission ID provided.");
        alert("Invalid submission ID.");
        navigate("/marks/t");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_TECHNICAL_API_URL}/api/submissions/${subId}`);
        if (!response.ok) throw new Error("Failed to fetch submission");
        const data = await response.json();

        // Verify that the submission belongs to the current student
        if (data.studentId !== studentId) {
          console.error("Submission does not belong to the current student.");
          alert("You are not authorized to view this submission.");
          navigate("/marks/t");
          return;
        }

        // Transform the submission data to match ExamMarksDetail
        const transformedData: ExamMarksDetail = {
          submissionId: data._id,
          moduleName: data.moduleName,
          moduleCode: data.moduleCode,
          year: data.year,
          semester: data.semester,
          totalMarks: data.totalMarks,
          questions: data.answers.map((ans: any, index: number) => ({
            questionNumber: index + 1,
            studentMarks: ans.marks,
            feedback: ans.feedback,
          })),
        };

        setExamDetail(transformedData);
      } catch (error) {
        console.error("Failed to fetch exam marks:", error);
        alert("Failed to load exam marks. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchMarks();
  }, [subId, studentId, navigate]);

  if (loading) {
    return (
      <div className="p-5">
        <p>Loading exam marks...</p>
      </div>
    );
  }

  if (!examDetail) {
    return (
      <div className="p-5">
        <p>No marks data found.</p>
      </div>
    );
  }

  const { moduleName, moduleCode, year, semester, totalMarks, questions } = examDetail;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <TypographyH2 className="mt-4">Exam Marks (#{examDetail.submissionId})</TypographyH2>

      {/* Show module info + year & semester */}
      <div className="mt-3 text-sm space-y-1">
        <p className="font-medium">
          {moduleName} ({moduleCode})
        </p>
        <p>
          Year: {year} &nbsp;|&nbsp; Semester: {semester}
        </p>
        <p>Total Marks: {totalMarks}</p>
      </div>

      {/* Detailed Marks and Feedback */}
      <div className="overflow-auto mt-5">
        <table className="w-full border text-sm">
          <thead className="border-b bg-neutral-100">
            <tr>
              <th className="p-2 text-left w-16">Q No.</th>
              <th className="p-2 text-left w-20">Marks</th>
              <th className="p-2 text-left">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.questionNumber} className="border-b">
                <td className="p-2">{q.questionNumber}</td>
                <td className="p-2">{q.studentMarks}</td>
                <td className="p-2">{q.feedback || "No feedback provided."}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
