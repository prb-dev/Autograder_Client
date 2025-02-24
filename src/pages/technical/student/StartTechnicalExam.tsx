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
  const [submitting, setSubmitting] = useState(false);

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
        const response = await fetch(
          `http://localhost:4000/api/exams/${examId}`
        );
        if (!response.ok) {
          throw new Error("Exam not found");
        }
        const examData = await response.json();

        // Map exam questions to the AttemptQuestion structure expected by the form
        const attemptData: AttemptQuestion[] = examData.questions.map(
          (q: ExamQuestion) => ({
            question: q.question,
            instructions: q.instructions,
            allocated: q.marks, // using "marks" from backend as allocated marks
            answer: "",
          })
        );

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
    setSubmitting(true); // show loading overlay
    try {
      const response = await fetch("http://localhost:4000/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: values.examId,
          studentId: "student123", // Replace with actual student ID as needed
          studentName: "John Doe", // Replace with actual student name as needed
          questions: values.questions,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setSubmitting(false);
      alert("Submitted successfully!");
      navigate("/find-assignment/t");
    } catch (error) {
      console.error("Error submitting exam: ", error);
      setSubmitting(false);
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
    <div className="max-w-5xl mx-auto px-4 py-6 relative">
 {submitting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 pointer-events-auto border border-blue-400">
            {/* Spinner Icon */}
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4.0a4 4 0 00-4 4H4z"
              ></path>
            </svg>

            {/* Submitting Text */}
            <p className="font-medium text-lg text-gray-800">
              Submitting your answers...
            </p>
            <p className="text-gray-500 text-sm text-center">
              Please wait without closing or refreshing the page.
            </p>
          </div>
        </div>
      )}


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
