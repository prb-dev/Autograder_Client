import React from "react";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/* 
  1) Define the shape of each question.
     Now includes an "instructions" field.
*/
const questionSchema = z.object({
  question: z.string().nonempty("Please enter the question text"),
  instructions: z.string().optional(), // or .nonempty(...) if mandatory
  marks: z
    .string()
    .regex(/^\d+$/, { message: "Must be a number" })
    .transform(Number),
  expected: z.string().nonempty("Please provide the expected answer"),
});

/*
  2) Define the full form shape
*/
const formSchema = z.object({
  moduleName: z.string().nonempty("Module name is required."),
  moduleCode: z.string().nonempty("Module code is required."),
  year: z.enum(["1", "2", "3", "4"]).refine((val) => ["1", "2", "3", "4"].includes(val), {
    message: "Select a valid year",
  }),
  semester: z.enum(["1", "2"]).refine((val) => ["1", "2"].includes(val), {
    message: "Select a valid semester",
  }),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required."),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function CreateTechnicalQuestion() {
  /* 
    3) Set up React Hook Form with Zod
  */
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      moduleName: "",
      moduleCode: "",
      year: "1",
      semester: "1",
      questions: [
        {
          question: "",
          instructions: "",
          marks: "" as unknown as number,
          expected: "",
        },
      ],
    },
  });

  /* 
    4) useFieldArray for dynamic questions
  */
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  /* 
    5) Handle form submission
  */
  async function onSubmit(values: FormSchemaType) {
    // Replace alert + console.log with your real submit logic
    console.log("Form Values =>", values);
    alert("Form submitted! Check console for values.");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <TypographyH2>Create Technical Questions</TypographyH2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mt-5"
        >
          {/* MODULE NAME */}
          <FormField
            control={form.control}
            name="moduleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Module Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Software Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* MODULE CODE */}
          <FormField
            control={form.control}
            name="moduleCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Module Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. SE3020" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* YEAR & SEMESTER via standard <select> */}
          <div className="flex flex-col gap-4 md:flex-row">
            {/* YEAR */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="md:w-1/2">
                  <FormLabel>Academic Year</FormLabel>
                  <FormControl>
                    <select
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

            {/* SEMESTER */}
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem className="md:w-1/2">
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

          {/* DYNAMIC QUESTIONS */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Question List</h3>

            {fields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="p-4 border rounded-md space-y-3 relative"
              >
                {/* Remove button for each question */}
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

                {/* question */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter question here" {...field} />
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
                      <FormLabel>Instructions (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Guidelines for the student, references, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* marks */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.marks`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allocated Marks</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 10" {...field} />
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
                        <Input
                          placeholder="Describe the correct answer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  question: "",
                  instructions: "",
                  marks: "" as any,
                  expected: "",
                })
              }
            >
              + Add Another Question
            </Button>
          </div>

          <Button type="submit" className="mt-5">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
