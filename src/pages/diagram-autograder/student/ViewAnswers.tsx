import React from "react";
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
import { Link, Params, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypographyH4 } from "@/components/ui/TypographyH4";

const ViewAnswers = () => {
  const params = useParams();
  const [answers, setAnswers] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const uid = "66e8e84cdd16f4ca22cd3c26";
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/${uid}/answers`,
          {
            credentials: "include",
          }
        );
        const values = await res.json();
        setAnswers(values.answers.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5">
      {params.aid ? (
        <AnswerDetails params={params} />
      ) : (
        <>
          <TypographyH2 className="m-5">Answers</TypographyH2>
          <div className="flex flex-col gap-5 p-5">
            {answers.map((answer: any, i: number) => (
              <Card key={answer._id} className="">
                <CardHeader>
                  <CardTitle className="self-end">
                    <div className="flex items-center">
                      <TypographyInlineCode>Submitted:</TypographyInlineCode>
                      <p className="font-mono text-sm">
                        {answer.created_at.split(" ")[0]}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <div className="flex gap-2 leading-7 font-mono">
                    <Badge>Answer ID:</Badge> {answer._id}
                  </div>
                  <div className="flex gap-2 leading-7 font-mono">
                    <Badge>Question ID:</Badge> {answer.question_id}
                  </div>
                  <div className="flex gap-2 leading-7 font-mono">
                    <Badge>Total Marks:</Badge> {answer.marks.total}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full justify-end">
                    <Link to={answer._id}>
                      <Button>View Details</Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AnswerDetails = ({ params }: { params: Readonly<Params<string>> }) => {
  const [answers, setAnswers] = React.useState([]);
  const [answer, setAnswer] = React.useState<any>();

  React.useEffect(() => {
    const fetchData = async () => {
      const uid = "66e8e84cdd16f4ca22cd3c26";
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/${uid}/answers`,
          {
            credentials: "include",
          }
        );
        const values = await res.json();
        setAnswers(values.answers.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    console.log(answers.find((ans: any) => ans._id === params.aid));
    setAnswer(answers.find((ans: any) => ans._id === params.aid));
  }, [answers]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Answers Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="flex flex-wrap justify-between mb-10">
                <div className="mt-5">
                  <TypographyH4 className="capitalize">Answer ID</TypographyH4>
                  <TypographyInlineCode>{answer?._id}</TypographyInlineCode>
                </div>
                <div className="mt-5">
                  <TypographyH4 className="capitalize">
                    Submission Date
                  </TypographyH4>
                  <TypographyInlineCode>
                    {answer?.created_at}
                  </TypographyInlineCode>
                </div>
                <div className="mt-5">
                  <TypographyH4 className="capitalize">
                    Total marks
                  </TypographyH4>
                  <TypographyInlineCode>
                    {answer?.marks.total}
                  </TypographyInlineCode>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <TypographyH4 className="capitalize">
                    Question ID
                  </TypographyH4>
                  <TypographyInlineCode>
                    {answer?.question._id}
                  </TypographyInlineCode>
                </div>

                <div>
                  <TypographyH4 className="capitalize">Question</TypographyH4>
                  <p>{answer?.question.question}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Marks for each criterion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criterion</TableHead>
                    <TableHead>Correctness</TableHead>
                    <TableHead className="text-right">Sub Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {answer?.marks &&
                    Object.entries(answer.marks)
                      .filter(([key]) => key !== "total")
                      .map(([key, value]: [string, any]) => (
                        <TableRow key={key}>
                          <TableCell className="capitalize">{key}</TableCell>
                          <TableCell className="font-mono">
                            <Badge>{value.correctness.toFixed(0)}%</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {value.mark}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {answer?.marks.total}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">UML Diagram</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={answer?.answer.image}
                alt="Correct UML Diagram"
                className="w-full max-h-[500px] rounded-lg border object-scale-down"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Link to={`/view/a`}>
          <Button>Done</Button>
        </Link>
      </div>
    </div>
  );
};

export default ViewAnswers;
