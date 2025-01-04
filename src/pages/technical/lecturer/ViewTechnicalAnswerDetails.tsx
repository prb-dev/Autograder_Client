import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/** 
 * One question's "Answer Detail" shape:
 * question, allocated, expected, studentAnswer, studentMarks, feedback 
 */
const answerDetailSchema = z.object({
  question: z.string(),
  allocated: z.number(),
  expected: z.string(),
  studentAnswer: z.string(),
  // Only this field remains editable
  studentMarks: z
    .string()
    .regex(/^\d+$/, { message: "Must be a number" })
    .transform(Number),
  // We'll keep this read-only as well
  feedback: z.string().optional(),
});

/** 
 * Full form shape: an array of these "answer details"
 */
const fullSchema = z.object({
  submissionId: z.string(),
  answers: z.array(answerDetailSchema),
});

type FormType = z.infer<typeof fullSchema>;

export default function ViewTechnicalAnswerDetails() {
  const { subId } = useParams(); // The submission ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // React Hook Form + zod
  const form = useForm<FormType>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      submissionId: subId ?? "",
      answers: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  // On mount, fetch student’s answers for this submission
  useEffect(() => {
    async function fetchSubmissionDetails() {
      try {
        // Mock data. Replace with your real fetch:
        // const res = await fetch(`http://yourapi.com/submissions/${subId}`)
        // const data = await res.json()
        const mockData = {
          submissionId: subId ?? "unknown",
          answers: [
            {
              question: "Explain the difference between compiler and interpreter",
              allocated: 10,
              expected: "Definition, examples, performance differences, etc.",
              studentAnswer:
                "A compiler translates code at once; an interpreter does line by line.\nAlso mention JIT compilers and modern usage.",
              studentMarks: 8,
              feedback: "Good but missing examples",
            },
            {
              question: "What is polymorphism?",
              allocated: 15,
              expected: "Polymorphism is the ability of an object to take many forms, etc.",
              studentAnswer:
                "Polymorphism is re-using code in multiple classes.\nI included an example with overridden methods.",
              studentMarks: 10,
              feedback: "Needs a bit more detail.",
            },
          ],
        };

        form.reset(mockData);
      } catch (error) {
        console.error("Failed to fetch submission details: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissionDetails();
  }, [subId, form]);

  // Save changes (only studentMarks is editable here)
  async function onSubmit(values: FormType) {
    console.log("Updated submission =>", values);
    // e.g. do a PUT request to update the student's marks
    // await fetch(`http://yourapi.com/submissions/${values.submissionId}`, { 
    //   method: 'PUT', 
    //   body: JSON.stringify(values)
    // })
    alert("Changes saved! Check console for updated data.");
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

      <TypographyH2 className="mt-4">
        Student Answer Details (#{subId})
      </TypographyH2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <div className="overflow-auto">
            <table className="w-full border text-sm">
              <thead className="border-b bg-neutral-100">
                <tr>
                  <th className="p-2 text-left w-48">Question</th>
                  <th className="p-2 text-left w-64">Expected</th>
                  <th className="p-2 text-left w-16">Allocated</th>
                  <th className="p-2 text-left w-64">Student Answer</th>
                  <th className="p-2 text-left w-24">Student Marks</th>
                  <th className="p-2 text-left w-64">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((fieldItem, index) => (
                  <tr key={fieldItem.id} className="border-b">
                    {/* question (read-only, multiline displayed) */}
                    <td className="p-2 align-top whitespace-pre-wrap break-words">
                      <FormField
                        control={form.control}
                        name={`answers.${index}.question`}
                        render={({ field }) => (
                          <>{field.value}</>
                        )}
                      />
                    </td>

                    {/* expected (read-only) */}
                    <td className="p-2 align-top whitespace-pre-wrap break-words">
                      <FormField
                        control={form.control}
                        name={`answers.${index}.expected`}
                        render={({ field }) => (
                          <>{field.value}</>
                        )}
                      />
                    </td>

                    {/* allocated (read-only) */}
                    <td className="p-2 align-top whitespace-pre-wrap break-words">
                      <FormField
                        control={form.control}
                        name={`answers.${index}.allocated`}
                        render={({ field }) => (
                          <>{field.value}</>
                        )}
                      />
                    </td>

                    {/* studentAnswer (read-only) */}
                    <td className="p-2 align-top whitespace-pre-wrap break-words">
                      <FormField
                        control={form.control}
                        name={`answers.${index}.studentAnswer`}
                        render={({ field }) => (
                          <>{field.value}</>
                        )}
                      />
                    </td>

                    {/* studentMarks (editable) */}
                    <td className="p-2 align-top">
                      <FormField
                        control={form.control}
                        name={`answers.${index}.studentMarks`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" className="w-16" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    {/* feedback (read-only) */}
                    <td className="p-2 align-top whitespace-pre-wrap break-words">
                      <FormField
                        control={form.control}
                        name={`answers.${index}.feedback`}
                        render={({ field }) => (
                          <>{field.value}</>
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button type="submit" variant="default">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
