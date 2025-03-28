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
} from "../../../components/ui/form";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { TypographyH2 } from "../../../components/ui/TypographyH2";
import { Input } from "../../../components/ui/input";
import { CalendarIcon, EyeOpenIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Rubric from "../../../components/diagram-autograder/lecturer/Rubric";
import clsx from "clsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuestionType } from "@/types/QuestionType";
import { useToast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    question: z.string(),
    diagram: z.instanceof(File),
    deadline: z.date({
      required_error: "A deadline is required.",
    }),
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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [question, setQuestion] = useState<QuestionType>({
    question: "",
    image: null,
    deadline: "",
    diagramType: "",
    rubric: {
      criterias: [],
      ranges: [],
    },
  });
  const [selectedImage, setSelectedImage] = useState<File | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      diagram: undefined,
      deadline: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/questions/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values.question),
        }
      );

      if (res.status !== 200) {
        throw new Error();
      }

      const data = await res.json();

      setQuestion((prev) => ({
        ...prev,
        question: values.question,
        deadline: values.deadline.toString(),
        image: values.diagram,
        rubric: data.rubric,
        diagramType: data.diagram_type,
      }));

      setCreated(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the question.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
  };

  return (
    <>
      <div className={clsx("flex justify-start p-5", created && "hidden")}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-8"
          >
            <TypographyH2>Create the Question</TypographyH2>

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
                  <FormLabel className="flex gap-2">
                    Diagram Image
                    {selectedImage && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="w-4 h-4 p-0">
                            <EyeOpenIcon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] max-w-[90%] max-h-[90%] p-0 overflow-hidden bg-transparent border-none">
                          <DialogHeader className="hidden">
                            <DialogTitle>Image</DialogTitle>
                            <DialogDescription>
                              Selected image.
                            </DialogDescription>
                          </DialogHeader>
                          <div>
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt={selectedImage.name}
                              className="w-full h-full object-scale-down"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setSelectedImage(e.target.files?.[0]);
                        field.onChange(e.target.files?.[0]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the answer diagram image
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
      <div className={clsx("h-[100vh] flex p-5", !created && "hidden")}>
        <Rubric
          question={question}
          toggler={setCreated}
          resetForm={resetForm}
        />
      </div>
    </>
  );
};

export default CreateQuestion;
