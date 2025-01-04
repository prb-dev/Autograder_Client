import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";

/**
 * Each question’s marking info: 
 * - questionNumber: Q1, Q2, etc.
 * - studentMarks: the marks student obtained for that question
 */
type QuestionMarks = {
  questionNumber: number;
  studentMarks: number;
};

/**
 * The exam detail now includes:
 * - moduleName, moduleCode
 * - year, semester
 * - totalMarks
 * - array of questionNumber + studentMarks
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
  const { subId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [examDetail, setExamDetail] = useState<ExamMarksDetail | null>(null);

  // Fetch the marks detail for the given submission ID
  useEffect(() => {
    async function fetchMarks() {
      try {
        // Example mock data. Replace with your real fetch call:
        // const res = await fetch(`http://yourapi.com/submissions/${subId}`)
        // const data = await res.json()

        const mockDetail: ExamMarksDetail = {
          submissionId: subId ?? "",
          moduleName: "Software Engineering",
          moduleCode: "SE302",
          year: "3",
          semester: "1",
          totalMarks: 18,
          questions: [
            {
              questionNumber: 1,
              studentMarks: 8,
            },
            {
              questionNumber: 2,
              studentMarks: 10,
            },
          ],
        };

        setExamDetail(mockDetail);
      } catch (error) {
        console.error("Failed to fetch exam marks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMarks();
  }, [subId]);

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

      <TypographyH2 className="mt-4">Exam Marks (#{subId})</TypographyH2>

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

      {/* Only Q No. and the student's marks */}
      <div className="overflow-auto mt-5">
        <table className="w-full border text-sm">
          <thead className="border-b bg-neutral-100">
            <tr>
              <th className="p-2 text-left w-16">Q No.</th>
              <th className="p-2 text-left w-20">Marks</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.questionNumber} className="border-b">
                <td className="p-2">{q.questionNumber}</td>
                <td className="p-2">{q.studentMarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
