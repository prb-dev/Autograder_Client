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
  allocated: number;
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

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // 2) On mount, fetch the exam by ID
  useEffect(() => {
    async function fetchExam() {
      try {
        // Example mock exam
        // In real code, do:
        // const res = await fetch(`http://yourapi.com/exams/${examId}`)
        // const examData = await res.json()
        const mockExam: ExamQuestion[] = [
          {
            question: "Explain the main components of OSI model?",
            instructions: "Focus on layers 1-7 and their functions",
            allocated: 10,
          },
          {
            question: "What is DNS and how does it work?",
            instructions: "Include real-world examples (like google.com).",
            allocated: 10,
          },
        ];

        // Convert exam questions into "attempt" shape
        const attemptData: AttemptQuestion[] = mockExam.map((q) => ({
          question: q.question,
          instructions: q.instructions,
          allocated: q.allocated,
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
    console.log("Student submission => ", values);
    // e.g. POST to your server with the student's answers
    // await fetch(`http://yourapi.com/submissions`, {
    //   method: 'POST',
    //   body: JSON.stringify(values)
    // })
    alert("Submitted successfully! Check console for data.");
    navigate("/find-assignment/t"); // Or anywhere else you want after submission
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
        {fields.map((fieldItem, idx) => {
          const baseName = `questions.${idx}`;
          return (
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
          );
        })}

        <Button type="submit" variant="default">
          Submit
        </Button>
      </form>
    </div>
  );
}
