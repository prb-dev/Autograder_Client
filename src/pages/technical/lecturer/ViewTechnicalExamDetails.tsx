// src/pages/technical/ViewTechnicalExamDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/** 1) The question object shape (for editing) */
const questionSchema = z.object({
  question: z.string(),
  instructions: z.string().optional(),
  // Accept either a string or a number
  marks: z
    .union([z.string(), z.number()])
    // Convert string to number if needed:
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    // Double-check it's not NaN
    .refine((val) => !isNaN(val), { message: "Must be a number" }),
  expected: z.string(),
});

/** 2) The full exam shape for editing */
const examSchema = z.object({
  _id: z.string(),
  moduleName: z.string(),
  moduleCode: z.string(),
  year: z.string(),
  semester: z.string(),
  questions: z.array(questionSchema),
});

type ExamFormType = z.infer<typeof examSchema>;

export default function ViewTechnicalExamDetails() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 3) Set up React Hook Form (with an empty default so we don't get undefined errors)
  const form = useForm<ExamFormType>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      _id: "",
      moduleName: "",
      moduleCode: "",
      year: "",
      semester: "",
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // 4) Fetch exam details by ID on mount
  useEffect(() => {
    async function fetchExam() {
      try {
        const res = await fetch(`${import.meta.env.VITE_TECHNICAL_API_URL}/api/exams/${examId}`);
        if (!res.ok) throw new Error("Exam not found");
        const exam = await res.json();

        // exam will have _id, moduleName, moduleCode, year, semester, questions array, etc.
        form.reset(exam); // Populate the form
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExam();
  }, [examId, form]);

  // 5) Handle Save
  async function onSubmit(values: ExamFormType) {
    console.log("Updated exam =>", values);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_TECHNICAL_API_URL}/api/exams/${values._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) throw new Error("Failed to update exam");
      alert("Exam updated successfully!");
    } catch (error) {
      console.error("Error updating exam:", error);
      alert("Error updating exam. Check console for details.");
    }
  }

  if (loading) {
    return (
      <div className="p-5">
        <p>Loading exam details...</p>
      </div>
    );
  }

  // 6) The editable layout
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <TypographyH2 className="mt-4">Edit Exam Details</TypographyH2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-5">
          {/* Basic info (read-only or up to you) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="moduleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moduleCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <select
                      // We'll use existing 'field' for onChange, value, etc.
                      {...field}
                      className="border rounded-md p-2 text-sm w-full"
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border rounded-md p-2 text-sm w-full"
                    >
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Editable questions list */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Questions</h3>

            {fields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="p-4 border rounded-md space-y-3 relative"
              >
                {/* Optional remove button if you want to remove questions */}
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}

                {/* Question text */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* instructions */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.instructions`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* allocated marks */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.marks`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allocated Marks</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* expected answer */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.expected`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Correct Answer</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            {/* add new question */}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  question: "",
                  instructions: "",
                  marks: 0,
                  expected: "",
                })
              }
            >
              + Add Question
            </Button>
          </div>

          <Button type="submit" className="mt-5">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
