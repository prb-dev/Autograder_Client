// src/pages/technical/student/FindTechnicalAssignments.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useNavigate } from "react-router-dom";

type TechnicalExam = {
  _id: string;
  moduleName: string;
  moduleCode: string;
  year: string;
  semester: string;
  status?: "draft" | "launched" | "disabled";
};

export default function FindTechnicalAssignments() {
  const [exams, setExams] = useState<TechnicalExam[]>([]);
  const navigate = useNavigate();

  // 1) fetch all, then filter "launched"
  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await fetch(`${import.meta.env.VITE_TECHNICAL_API_URL}/api/exams`);
        if (!res.ok) throw new Error("Failed to fetch exams");
        const allExams: TechnicalExam[] = await res.json();
        // filter only launched
        const launchedExams = allExams.filter((ex) => ex.status === "launched");
        setExams(launchedExams);
      } catch (error) {
        console.error("Error fetching launched exams:", error);
      }
    }
    fetchExams();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <TypographyH2>Find Technical Assignments</TypographyH2>

      <div className="mt-5 space-y-3">
        {exams.length === 0 ? (
          <p>No launched exams available.</p>
        ) : (
          exams.map((exam) => (
            <div
              key={exam._id}
              className="p-4 border rounded-md flex items-center justify-between"
            >
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {exam.moduleName} ({exam.moduleCode})
                </p>
                <p>
                  Year: {exam.year} | Semester: {exam.semester}
                </p>
                <p>Status: {exam.status ?? "unknown"}</p>
              </div>

              <Button
                onClick={() => navigate(`/find-assignment/t/${exam._id}`)}
                disabled={exam.status !== "launched"}
              >
                Start
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
