import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useForm, useFieldArray } from "react-hook-form";

/** 
 * Each question might look like this 
 */
type ExamQuestion = {
  question: string;
  instructions?: string;
  marks: number; // Note: Use 'marks' as defined in your backend model
};

/** 
 * For the student's attempt, we store the "answer" for each question 
 */
type AttemptQuestion = {
  question: string;
  instructions?: string;
  allocated: number;
  answer: string; // student’s typed answer
};

type FormDataType = {
  examId: string;
  questions: AttemptQuestion[];
};

export default function StartTechnicalExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 1) set up react-hook-form
  const form = useForm<FormDataType>({
    defaultValues: {
      examId: examId ?? "",
      questions: [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // 2) On mount, fetch the exam by ID from the backend
  useEffect(() => {
    async function fetchExam() {
      try {
        const response = await fetch(`http://localhost:4000/api/exams/${examId}`);
        if (!response.ok) {
          throw new Error("Exam not found");
        }
        const examData = await response.json();

        // Map exam questions to the AttemptQuestion structure expected by the form
        const attemptData: AttemptQuestion[] = examData.questions.map((q: ExamQuestion) => ({
          question: q.question,
          instructions: q.instructions,
          allocated: q.marks, // using "marks" from backend as allocated marks
          answer: "",
        }));

        form.reset({
          examId: examId ?? "",
          questions: attemptData,
        });
      } catch (error) {
        console.error("Failed to fetch exam details: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExam();
  }, [examId, form]);

  // 3) Handle "Submit" the student’s answers
  async function onSubmit(values: FormDataType) {
    try {
      const response = await fetch("http://localhost:4000/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: values.examId,
          studentId: "student123",       // Replace with actual student ID as needed
          studentName: "John Doe",       // Replace with actual student name as needed
          questions: values.questions,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      alert("Submitted successfully!");
      navigate("/find-assignment/t");
    } catch (error) {
      console.error("Error submitting exam: ", error);
      alert("Error submitting exam.");
    }
  }

  if (loading) {
    return (
      <div className="p-5">
        <p>Loading exam details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <TypographyH2 className="mt-4">Start Exam (#{examId})</TypographyH2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
        {fields.map((fieldItem, idx) => (
          <div key={fieldItem.id} className="p-4 border rounded-md space-y-3">
            <h3 className="font-semibold">
              Question {idx + 1}: {fieldItem.question}
            </h3>
            {fieldItem.instructions && (
              <p className="text-sm text-neutral-600">
                Instructions: {fieldItem.instructions}
              </p>
            )}
            <p className="text-sm font-medium">
              Allocated Marks: {fieldItem.allocated}
            </p>

            {/* Student's answer */}
            <textarea
              className="w-full border rounded-md p-2 mt-2"
              rows={4}
              {...form.register(`questions.${idx}.answer` as const)}
            />
          </div>
        ))}

        <Button type="submit" variant="default">
          Submit
        </Button>
      </form>
    </div>
  );
}
