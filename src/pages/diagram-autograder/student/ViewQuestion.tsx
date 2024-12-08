import Countdown from "@/components/diagram-autograder/student/Countdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { TypographyH4 } from "@/components/ui/TypographyH4";
import { TypographyInlineCode } from "@/components/ui/TypographyInlineCode";
import { TypographyP } from "@/components/ui/TypographyP";
import { storage } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOpenIcon, ReloadIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  diagram: z.instanceof(File),
});

const ViewQuestion = () => {
  const { toast } = useToast();

  const [question, setQuestion] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagram: undefined,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/questions/67514a7b102f2807c2a490e5"
        );
        const data = await res.json();
        setQuestion(data.question.question);
        setDeadline(data.question.deadline);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const qid = "67514a7b102f2807c2a490e5";
    const uid = "66e8e84cdd16f4ca22cd3c26";
    const imageRef = ref(
      storage,
      `${qid}/student_answers/${uid}.${values.diagram?.type.split("/").pop()}`
    );

    try {
      setIsLoading(true);

      if (values.diagram) {
        const snapshot = await uploadBytes(imageRef, values.diagram);
        const imageUrl = await getDownloadURL(snapshot.ref);

        const res = await fetch(
          `http://127.0.0.1:8000/answers/submit/${qid}/${uid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(imageUrl),
          }
        );

        const data = await res.json();

        toast({
          title: "Success",
          description: data.message,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx("h-[100vh] overflow-y-scroll p-5 space-y-5")}>
      <div className="flex items-center justify-between">
        <TypographyH2>Answer the Question</TypographyH2>
        <div className="flex flex-col items-center">
          <TypographyInlineCode>Time remaining</TypographyInlineCode>
          <Countdown date={deadline} />
        </div>
      </div>

      <div>
        <TypographyH4>Question</TypographyH4>
        <TypographyP className="first-letter:capitalize">
          {question}
        </TypographyP>
      </div>

      <div>
        <TypographyH4 className="mb-5">Upload the Answer</TypographyH4>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-8"
          >
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
                        <DialogContent className="w-fit h-fit p-0 overflow-hidden bg-transparent border-none">
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

            <Button
              type="submit"
              className="w-fit self-end"
              disabled={isLoading}
            >
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ViewQuestion;
