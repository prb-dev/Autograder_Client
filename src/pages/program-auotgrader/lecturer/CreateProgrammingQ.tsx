import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { TypographyH2 } from "../../../components/ui/TypographyH2";
import { Input } from "../../../components/ui/input";
import { CalendarIcon, ReloadIcon, PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import clsx from "clsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Define the schema with a refinement to ensure the rubric total is not more than 100
const formSchema = z
  .object({
    title: z.string().nonempty({ message: "Title should not be empty." }),
    question: z.string().nonempty({ message: "Question should not be empty." }),
    reference: z
      .string()
      .nonempty({ message: "Reference code should not be empty." }),
    deadline: z.date({ required_error: "A deadline is required." }),
    rubric: z
      .array(
        z.object({
          criteria: z
            .string()
            .nonempty({ message: "Criteria should not be empty." }),
          mark: z.number().min(1, { message: "Mark should be at least 1." }),
        })
      )
      .refine(
        (rubrics) => rubrics.reduce((acc, curr) => acc + curr.mark, 0) <= 100,
        {
          message: "Total marks in rubric must not exceed 100.",
          path: ["rubric"],
        }
      ),
  })
  .refine((data) => !!data.question.trim(), {
    message: "Question should not be empty.",
    path: ["question"],
  });

const CreateProgrammingQ = () => {
  const url = import.meta.env.VITE_API_PRO_URL;

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [question, setQuestion] = useState({
    title: "",
    question: "",
    reference: "",
    deadline: "",
    rubric: [],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      question: "",
      reference: "",
      deadline: undefined,
      rubric: [
        { criteria: "Syntax Correctness", mark: 20 },
        { criteria: "Output Match", mark: 30 },
        { criteria: "Code Quality", mark: 25 },
        { criteria: "Error Handling", mark: 15 },
        { criteria: "Boundary Conditions", mark: 10 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rubric",
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      // Convert rubric array to object with keys in lowercase underscore format
      const rubricObject = values.rubric.reduce((acc, item) => {
        acc[item.criteria.toLowerCase().replace(/\s+/g, "_")] = item.mark;
        return acc;
      }, {} as Record<string, number>);

      const requestBody = {
        title: values.title,
        description: values.question,
        reference_code: values.reference,
        rubric: rubricObject,
        instructor_id: "64b7a1234fa9c34567890111", // Demo instructor ID
        deadline: values.deadline.toISOString(),
      };

      const res = await fetch(`${url}/api/assignments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        const data = await res.json();

        setQuestion({
          title: values.title,
          question: values.question,
          reference: values.reference,
          deadline: values.deadline.toString(),
          rubric: values.rubric,
        });

        setCreated(true);
        toast({
          title: "Success!",
          description: "Assignment created successfully.",
        });
      } else {
        throw new Error("Failed to create assignment");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error!",
        description: "An error occurred while creating the assignment.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={clsx(
          "h-[100vh] overflow-y-scroll flex justify-start p-5",
          created && "hidden"
        )}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-8"
          >
            <TypographyH2>Create Programming Assignment</TypographyH2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the title here" />
                  </FormControl>
                  <FormDescription>
                    Enter the title of the question here
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Enter the question here</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Code</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the reference code here
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the date for the deadline.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <TypographyH2>Marking Rubric</TypographyH2>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name={`rubric.${index}.criteria`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Criteria" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`rubric.${index}.mark`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" {...field} placeholder="Mark" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ criteria: "", mark: 0 })}
                className="flex items-center gap-2"
              >
                <PlusIcon /> Add Criteria
              </Button>
            </div>

            <Button
              type="submit"
              className="w-fit self-end"
              disabled={isLoading}
            >
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Next
            </Button>
          </form>
        </Form>
      </div>
      <div
        className={clsx(
          "h-full overflow-y-scroll flex p-5",
          !created && "hidden"
        )}
      >
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mx-auto mt-8">
          <TypographyH2 className="text-2xl font-bold mb-4">
            Programming Assignment Created
          </TypographyH2>
          <p className="mb-2">
            <strong className="font-semibold">Title:</strong> {question.title}
          </p>
          <p className="mb-2">
            <strong className="font-semibold">Question:</strong>{" "}
            {question.question}
          </p>
          <div className="mb-4">
            <strong className="font-semibold">Reference Code:</strong>
            <pre className="bg-gray-100 p-4 rounded-md mt-2 whitespace-pre-wrap">
              {question.reference}
            </pre>
          </div>
          <p className="mb-4">
            <strong className="font-semibold">Deadline:</strong>{" "}
            {question.deadline}
          </p>
          <div className="mb-6">
            <TypographyH2 className="text-xl font-bold mb-2">
              Marking Rubric
            </TypographyH2>
            {question.rubric.map((item, index) => (
              <div key={index} className="mb-2 border-b border-gray-200 pb-2">
                <p className="mb-1">
                  <strong className="font-semibold">Criteria:</strong>{" "}
                  {item.criteria}
                </p>
                <p>
                  <strong className="font-semibold">Mark:</strong> {item.mark}
                </p>
              </div>
            ))}
          </div>
          <Button
            onClick={() => setCreated(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Edit
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateProgrammingQ;
