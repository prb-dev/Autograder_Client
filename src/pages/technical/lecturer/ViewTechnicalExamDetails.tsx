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
  marks: z
    .string()
    .regex(/^\d+$/, { message: "Must be a number" })
    .transform(Number),
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
        // Example mock data. Replace with fetch(...) to your real backend
        // e.g. const res = await fetch(`http://example.com/api/exams/${examId}`)
        // const data = await res.json()
        const mockExam = {
          _id: examId ?? "unknown",
          moduleName: "Software Engineering",
          moduleCode: "SE302",
          year: "3",
          semester: "1",
          questions: [
            {
              question: "Explain the software development lifecycle?",
              instructions: "Focus on Waterfall vs Agile differences.",
              marks: 10,
              expected: "Comparison, examples, at least 200 words",
            },
            {
              question: "Describe UML diagrams used in design phase.",
              instructions: "",
              marks: 15,
              expected: "Class, Sequence diagrams, etc.",
            },
          ],
        };
        // Set form values from fetched data
        form.reset(mockExam);
      } catch (error) {
        console.error("Failed to fetch exam: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExam();
  }, [examId, form]);

  // 5) Handle Save
  async function onSubmit(values: ExamFormType) {
    console.log("Updated exam => ", values);
    alert("Changes saved! Check console for updated exam data.");
    // e.g. do fetch PUT to your server endpoint
    // fetch(`http://example.com/api/exams/${values._id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(values),
    // })
    //   .then(...)
    //   .catch(...)
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
                    <Input {...field} />
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
                    <Input {...field} />
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
              onClick={() => append({ question: "", instructions: "", marks: 0, expected: "" })}
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
