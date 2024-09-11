import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { TypographyH2 } from "./ui/TypographyH2";
import { Input } from "./ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Rubric from "./Rubric";
import clsx from "clsx";

const formSchema = z
  .object({
    question: z.string(),
    diagram: z.instanceof(File),
  })
  .refine(
    (data) => {
      return !!data.question.trim();
    },
    {
      message: "Question should not be empty.",
      path: ["question"],
    }
  );

const CreateQuestion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qid, setQid] = useState("");
  const [diagramType, setDiagramType] = useState("");
  const [rubric, setRubric] = useState(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      diagram: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("question", values.question);
      formData.append("image", values.diagram);

      const res = await fetch("http://127.0.0.1:8000/questions", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setQid(data.qid);
      setRubric(data.rubric);
      setDiagramType(data.diagram_type);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div
        className={clsx("flex justify-center items-center", rubric && "hidden")}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-96 flex flex-col gap-8"
          >
            <TypographyH2 className="self-center">
              Create the Question
            </TypographyH2>

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
              name="diagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagram Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])} // Capture the selected file
                    />
                  </FormControl>
                  <FormDescription>
                    Select the answer diagram image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <div
        className={clsx(
          "flex justify-center items-center",
          !rubric && "hidden"
        )}
      >
        <Rubric qid={qid} rubric={rubric} diagramType={diagramType} />
      </div>
    </>
  );
};

export default CreateQuestion;
