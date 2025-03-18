import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { TypographyInlineCode } from "@/components/ui/TypographyInlineCode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ViewQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/questions`,
          {
            credentials: "include",
          }
        );
        const values = await res.json();
        setQuestions(values.questions.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <TypographyH2 className="m-5">Questions</TypographyH2>
      <div className="flex flex-col gap-5 p-5">
        {questions.map((question: any, i: number) => (
          <Card key={question._id} className="">
            <CardHeader>
              <CardTitle className="self-end">
                <div className="flex items-center">
                  <TypographyInlineCode>Deadline:</TypographyInlineCode>
                  <p className="font-mono text-sm">
                    {question.deadline.split(" ")[0]}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex">
              <QuestionNumber number={i + 1} />
              <p className="leading-7 ">{question.question}</p>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end">
                <Link to={question._id}>
                  <Button>Answer</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const QuestionNumber = ({ number }: { number: number }) => {
  return (
    <div className="flex justify-center p-3 items-center rounded-[100%] bg-sidebar-primary text-neutral-50 mr-5 w-3 h-3 mt-1">
      <p className="text-sm font-mono">{number}</p>
    </div>
  );
};

export default ViewQuestions;
