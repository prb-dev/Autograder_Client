// src/pages/technical/lecturer/ViewTechnicalAnswerDetails.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input"; // Removed Textarea import

type AnswerDetail = {
  question: string;
  instructions?: string;
  allocated: number;
  answer: string;
  marks: number;
  feedback: string;
  expectedAnswer: string; // Added expectedAnswer
};

type SubmissionDetail = {
  _id: string;
  studentName: string;
  studentId: string;
  totalMarks: number;
  submittedAt: string; // Changed from 'completedAt' to 'submittedAt'
  reviewed: boolean;
  answers: AnswerDetail[];
};

export default function ViewTechnicalAnswerDetails() {
  const { subId } = useParams<{ subId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm<SubmissionDetail>({
    defaultValues: {
      _id: "",
      studentName: "",
      studentId: "",
      totalMarks: 0,
      submittedAt: "", // Changed from 'completedAt' to 'submittedAt'
      reviewed: false,
      answers: [],
    },
  });

  // Destructure replace along with fields from useFieldArray
  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  useEffect(() => {
    async function fetchSubmission() {
      try {
        const response = await fetch(`http://localhost:4000/api/submissions/${subId}`);
        if (!response.ok) throw new Error("Submission not found");
        const data: SubmissionDetail = await response.json();

        // Ensure marks are numbers and handle 'submittedAt' consistency
        const transformedAnswers = data.answers.map(ans => ({
          ...ans,
          marks: Number(ans.marks), // Ensure number
        }));

        form.reset({
          ...data,
          totalMarks: Number(data.totalMarks), // Ensure number
          submittedAt: data.submittedAt, // Handle possible 'completedAt' field if needed
          answers: transformedAnswers,
        });

        // Update the field array with the fetched answers
        replace(transformedAnswers);
      } catch (error) {
        console.error("Failed to fetch submission:", error);
        alert("Failed to load submission details. Please try again later.");
        navigate("/view-answers/t");
      } finally {
        setLoading(false);
      }
    }
    fetchSubmission();
  }, [subId, form, navigate, replace]);

  async function onSubmit(values: SubmissionDetail) {
    try {
      // Calculate total marks based on edited answers
      const totalMarks = values.answers.reduce((acc, curr) => acc + Number(curr.marks), 0); // Ensure numbers
      const updatedSubmission = {
        ...values,
        totalMarks,
        reviewed: true, // Mark as reviewed
      };

      const response = await fetch(`http://localhost:4000/api/submissions/${values._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSubmission),
      });
      if (!response.ok) throw new Error("Failed to update submission");
      const result = await response.json();
      console.log("Updated submission:", result);
      alert("Marks and feedback updated successfully!");
      navigate("/view-answers/t");
    } catch (error) {
      console.error("Error updating submission:", error);
      alert("Error updating submission. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="p-5">
        <p>Loading submission details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <TypographyH2 className="mt-4">Review Submission: {subId}</TypographyH2>
      <p>
        <strong>Student:</strong> {form.watch("studentName")} ({form.watch("studentId")})
      </p>
      <p>
        <strong>Submitted At:</strong> {new Date(form.watch("submittedAt")).toLocaleString()}
      </p>
      <p>
        <strong>Total Marks:</strong> {form.watch("totalMarks")}
      </p>

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
            <p>
              <strong>Expected Answer:</strong> {fieldItem.expectedAnswer}
            </p>
            <p>
              <strong>Student's Answer:</strong> {fieldItem.answer}
            </p>
            <p>
              <strong>Allocated Marks:</strong> {fieldItem.allocated}
            </p>

            <div>
              <label className="block font-medium">Marks Awarded:</label>
              <Controller
                control={form.control}
                name={`answers.${idx}.marks`}
                rules={{
                  required: "Marks are required",
                  min: { value: 0, message: "Marks cannot be negative" },
                  max: { value: fieldItem.allocated, message: `Marks cannot exceed ${fieldItem.allocated}` },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      type="number"
                      min={0}
                      max={fieldItem.allocated}
                      step="any" 
                      {...field}
                      required
                      className="mt-1"
                      placeholder={`0 - ${fieldItem.allocated}`}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label className="block font-medium">Feedback:</label>
              <Controller
                control={form.control}
                name={`answers.${idx}.feedback`}
                rules={{ required: "Feedback is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <textarea
                      {...field}
                      required
                      placeholder="Provide feedback here..."
                      className="w-full border rounded-md p-2 mt-1"
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        ))}

        <Button type="submit" variant="default">
          Submit Reviews
        </Button>
      </form>
    </div>
  );
}
