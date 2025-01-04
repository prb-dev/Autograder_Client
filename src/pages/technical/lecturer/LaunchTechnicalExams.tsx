// src/pages/technical/LaunchTechnicalExams.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";

/** Example shape includes "status" so we can track launched/disabled */
type Exam = {
  _id: string;
  moduleName: string;
  moduleCode: string;
  year: string;
  semester: string;
  status: "draft" | "launched" | "disabled";
};

export default function LaunchTechnicalExams() {
  const [exams, setExams] = useState<Exam[]>([]);

  // 1) Fetch all exams on mount (replace with your real endpoint)
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
          status: "draft",
        },
        {
          _id: "222",
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

  // 2) Launch exam
  async function handleLaunch(examId: string) {
    // e.g. await fetch(`url/exams/launch/${examId}`, { method: 'POST' })
    setExams((prev) =>
      prev.map((ex) =>
        ex._id === examId ? { ...ex, status: "launched" } : ex
      )
    );
    alert(`Exam ${examId} launched (mock)`);
  }

  // 3) Disable exam
  async function handleDisable(examId: string) {
    // e.g. await fetch(`url/exams/disable/${examId}`, { method: 'POST' })
    setExams((prev) =>
      prev.map((ex) =>
        ex._id === examId ? { ...ex, status: "disabled" } : ex
      )
    );
    alert(`Exam ${examId} disabled (mock)`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <TypographyH2>Launch / Disable Technical Exams</TypographyH2>

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
                <p>Status: {exam.status}</p>
              </div>

              <div className="flex gap-2">
                {exam.status !== "launched" && (
                  <Button onClick={() => handleLaunch(exam._id)}>Launch</Button>
                )}
                {exam.status !== "disabled" && (
                  <Button
                    onClick={() => handleDisable(exam._id)}
                    variant="outline"
                  >
                    Disable
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
