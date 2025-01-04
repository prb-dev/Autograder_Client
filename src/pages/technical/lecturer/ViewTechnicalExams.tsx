// src/pages/technical/ViewTechnicalExams.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";

/** Example exam shape */
type Exam = {
  _id: string;
  moduleName: string;
  moduleCode: string;
  year: string;
  semester: string;
};

export default function ViewTechnicalExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  // 1) Fetch all exams on mount (replace with real endpoint)
  useEffect(() => {
    async function fetchExams() {
      // Example mock data. Replace with fetch(...) to your API
      const mockData: Exam[] = [
        {
          _id: "111",
          moduleName: "Software Engineering",
          moduleCode: "SE302",
          year: "3",
          semester: "1",
        },
        {
          _id: "222",
          moduleName: "Computer Networks",
          moduleCode: "CN404",
          year: "4",
          semester: "2",
        },
      ];
      setExams(mockData);
    }
    fetchExams();
  }, []);

  // 2) Handle DELETE
  async function handleDelete(examId: string) {
    // Example: 
    // await fetch(`http://yourapi.com/exams/${examId}`, { method: 'DELETE' })
    // Then remove from local state:
    setExams((prev) => prev.filter((ex) => ex._id !== examId));
    alert(`Exam ${examId} deleted (mock)`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <TypographyH2>All Technical Exams</TypographyH2>

      <div className="mt-5 space-y-3">
        {exams.length === 0 ? (
          <p>No exams found.</p>
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
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/view/t/${exam._id}`)}
                  variant="outline"
                >
                  View / Edit
                </Button>
                <Button
                  onClick={() => handleDelete(exam._id)}
                  variant="destructive"
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
