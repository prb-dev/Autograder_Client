import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useNavigate } from "react-router-dom";

/**
 * Example shape for a student's exam submission, including:
 *  - submission ID
 *  - exam details
 *  - total marks
 */
type StudentSubmission = {
  _id: string;         // submission ID
  examId: string;      // exam ID if needed
  moduleName: string;
  moduleCode: string;
  totalMarks: number;
  completedAt: string;
};

export default function StudentMarksList() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const navigate = useNavigate();

  // 1) Fetch all submissions for this student
  useEffect(() => {
    async function fetchData() {
      // Example mock data. Replace with your real fetch call, e.g.:
      // const res = await fetch(`http://yourapi.com/submissions?studentId=xxx`)
      // const data = await res.json()
      const mockData: StudentSubmission[] = [
        {
          _id: "sub111",
          examId: "exam111",
          moduleName: "Software Engineering",
          moduleCode: "SE302",
          totalMarks: 18, // from question wise sum
          completedAt: "2023-12-01 10:10",
        },
        {
          _id: "sub222",
          examId: "exam222",
          moduleName: "Computer Networks",
          moduleCode: "CN404",
          totalMarks: 22,
          completedAt: "2023-12-05 09:45",
        },
      ];
      setSubmissions(mockData);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <TypographyH2>My Technical Exam Marks</TypographyH2>

      <div className="mt-5 space-y-3">
        {submissions.length === 0 ? (
          <p>No completed exams.</p>
        ) : (
          submissions.map((sub) => (
            <div
              key={sub._id}
              className="p-4 border rounded-md flex items-center justify-between"
            >
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {sub.moduleName} ({sub.moduleCode})
                </p>
                <p>Total Marks: {sub.totalMarks}</p>
                <p>Completed At: {sub.completedAt}</p>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate(`/marks/t/${sub._id}`)}
              >
                View Marks
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
