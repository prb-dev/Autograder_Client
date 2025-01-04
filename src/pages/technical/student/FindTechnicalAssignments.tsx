import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useNavigate } from "react-router-dom";

/** Example shape for an exam to display in the list */
type TechnicalExam = {
  _id: string; // exam ID
  moduleName: string;
  moduleCode: string;
  year: string;
  semester: string;
  status: "launched" | "draft" | "disabled";
};

export default function FindTechnicalAssignments() {
  const [exams, setExams] = useState<TechnicalExam[]>([]);
  const navigate = useNavigate();

  // 1) Fetch launched exams on mount
  useEffect(() => {
    async function fetchExams() {
      // Example mock data. Replace with your actual fetch call:
      // const res = await fetch("http://yourapi.com/exams/technical?launched=true")
      // const data = await res.json()
      const mockData: TechnicalExam[] = [
        {
          _id: "exam111",
          moduleName: "Software Engineering",
          moduleCode: "SE302",
          year: "3",
          semester: "1",
          status: "launched",
        },
        {
          _id: "exam222",
          moduleName: "Computer Networks",
          moduleCode: "CN404",
          year: "4",
          semester: "2",
          status: "launched",
        },
      ];
      setExams(mockData);
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
                <p>Status: {exam.status}</p>
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
