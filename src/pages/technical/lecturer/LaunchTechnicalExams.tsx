// src/pages/technical/LaunchTechnicalExams.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";

type Exam = {
  _id: string;
  moduleName: string;
  moduleCode: string;
  year: string;
  semester: string;
  // must match the model now that it has "status"
  status?: "draft" | "launched" | "disabled";
};

export default function LaunchTechnicalExams() {
  const [exams, setExams] = useState<Exam[]>([]);

  // 1) fetch all exams
  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await fetch("http://localhost:4000/api/exams");
        if (!res.ok) throw new Error("Failed to fetch exams");
        const data: Exam[] = await res.json();
        setExams(data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    }
    fetchExams();
  }, []);

  // 2) LAUNCH exam (POST /exams/:id/launch)
  async function handleLaunch(examId: string) {
    try {
      const response = await fetch(`http://localhost:4000/api/exams/${examId}/launch`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to launch exam");
      const updatedExam: Exam = await response.json();

      // Update local state
      setExams((prev) =>
        prev.map((ex) => (ex._id === examId ? updatedExam : ex))
      );

      alert(`Exam ${examId} launched successfully!`);
    } catch (error) {
      console.error("Error launching exam:", error);
      alert("Error launching exam. Check console.");
    }
  }

  // 3) DISABLE exam (POST /exams/:id/disable)
  async function handleDisable(examId: string) {
    try {
      const response = await fetch(`http://localhost:4000/api/exams/${examId}/disable`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to disable exam");
      const updatedExam: Exam = await response.json();

      // Update local state
      setExams((prev) =>
        prev.map((ex) => (ex._id === examId ? updatedExam : ex))
      );

      alert(`Exam ${examId} disabled successfully!`);
    } catch (error) {
      console.error("Error disabling exam:", error);
      alert("Error disabling exam. Check console.");
    }
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
                <p>Status: {exam.status ?? "unknown"}</p>
              </div>

              <div className="flex gap-2">
                {exam.status !== "launched" && (
                  <Button onClick={() => handleLaunch(exam._id)}>
                    Launch
                  </Button>
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
