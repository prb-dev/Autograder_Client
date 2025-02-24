// src/pages/technical/student/StudentMarksList.tsx

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useNavigate } from "react-router-dom";

/**
 * Structure of a student's exam submission, including:
 * - submission ID
 * - exam details
 * - total marks
 */
type StudentSubmission = {
  _id: string;           // submission ID
  examId: string;        // exam ID if needed
  moduleName: string;
  moduleCode: string;
  year: string;          // Added year property
  semester: string;      // Added semester property
  totalMarks: number;
  completedAt: string;
  reviewed: boolean;     // Indicates if the submission has been reviewed
};

export default function StudentMarksList() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const navigate = useNavigate();

  // Hardcoded studentId for now
  const studentId = "student123";

  // 1) Fetch all submissions for this student
  useEffect(() => {
    async function fetchData() {
      if (!studentId) {
        console.error("No student ID found.");
        alert("User not authenticated.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/submissions/student/${studentId}`);
        if (!response.ok) throw new Error("Failed to fetch submissions");
        const data: StudentSubmission[] = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        alert("Failed to load submissions. Please try again later.");
      }
    }
    fetchData();
  }, [studentId]);

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
                <p>Year: {sub.year}</p>
                <p>Semester: {sub.semester}</p>
                <p>Total Marks: {sub.totalMarks}</p>
                <p>Completed At: {new Date(sub.completedAt).toLocaleString()}</p>
                <p>Status: {sub.reviewed ? "Reviewed" : "Pending Review"}</p>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate(`/marks/t/${sub._id}`)}
                disabled={!sub.reviewed} // Disable if not reviewed
                title={sub.reviewed ? "View Marks" : "Marks Not Available Yet"}
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
