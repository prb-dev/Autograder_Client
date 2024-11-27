import React, { useEffect, useState } from "react";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const ViewSingleAssignment = () => {
  const { toast } = useToast();

  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/assignments/singleForStudent/${assignmentId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch assignment");
        }

        const values = await res.json();
        setAssignment(values.data);
      } catch (error) {
        console.error(error);
        setAssignment(null);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const requestBody = {
        assignment_id: assignment._id,
        student_id: "64b7a1234fa9c34567890111", // Demo student ID
        answer_code: data.answer_code,
        input_data: data.input_data,
        rubric: assignment.rubric,
      };

      const res = await fetch(
        "http://localhost:5001/api/submissions/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit answer");
      }

      const response = await res.json();
      console.log("Submission successful:", response);

      // Show success toast here
      toast({
        title: "Success!",
        description: "Answer submitted successfully.",
      });

      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-5">
      {assignment ? (
        <>
          <TypographyH2>Assignment Details</TypographyH2>
          <Card className="shadow-lg my-6">
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Assignment ID:</strong> {assignment.assignmentID}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Description:</strong> {assignment.description}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Deadline:</strong>{" "}
                {format(new Date(assignment.deadline), "yyyy-MM-dd '12:00 AM'")}
              </p>
            </CardContent>
          </Card>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6"
          >
            <TypographyH2>Submit Your Answer</TypographyH2>

            <div className="flex flex-col gap-4">
              <label className="font-medium" htmlFor="answer_code">
                Answer Code
              </label>
              <Textarea
                {...register("answer_code", { required: true })}
                placeholder="Enter your code here..."
                rows={10}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="font-medium" htmlFor="input_data">
                Input Data (Optional)
              </label>
              <Input
                {...register("input_data")}
                placeholder="Enter any input data..."
                className="w-full border rounded-md p-2"
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              disabled={isLoading}
              className="w-fit self-end"
            >
              {isLoading ? "Submitting..." : "Submit Answer"}
            </Button>
          </form>
        </>
      ) : (
        <TypographyH2>Loading Assignment...</TypographyH2>
      )}
    </div>
  );
};

export default ViewSingleAssignment;
