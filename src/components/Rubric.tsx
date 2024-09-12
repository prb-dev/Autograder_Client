import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "./ui/input";
import { TypographyH2 } from "./ui/TypographyH2";
import { Separator } from "./ui/separator";
import { TypographyP } from "./ui/TypographyP";
import { useEffect, useState } from "react";
import { TypographyH4 } from "./ui/TypographyH4";
import { TypographyInlineCode } from "./ui/TypographyInlineCode";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Pencil1Icon, ReloadIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "./ui/checkbox";

type Rubric = {
  criterias: string[];
  ranges: [number, number][];
};

type Mark = {
  [criteria: string]: number[];
};

type SubTotals = {
  [criteria: string]: number;
};

type TempCriterias = {
  [criteria: string]: boolean;
};

const Rubric = ({
  qid,
  rubric,
  diagramType,
}: {
  qid: string;
  rubric?: Rubric;
  diagramType: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [subTotals, setSubTotals] = useState<SubTotals>({});
  const [marks, setMarks] = useState<Mark>({});
  const [ranges, setRanges] = useState<[number, number][] | undefined>(
    undefined
  );
  const [tempCriterias, setTempCriterias] = useState<TempCriterias | undefined>(
    {}
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRanges(rubric?.ranges);

    setTempCriterias(
      rubric?.criterias.reduce((acc, criteria) => {
        acc[criteria] = true;
        return acc;
      }, {} as TempCriterias)
    );

    rubric?.criterias.forEach((criteria) => {
      setMarks((prevMarks) => ({
        ...prevMarks,
        [criteria]: Array(rubric?.ranges.length).fill(0),
      }));
    });
  }, [rubric]);

  useEffect(() => {
    const newSubTotals: SubTotals = {};

    for (const [criteria, marksArray] of Object.entries(marks)) {
      const subtotal = marksArray.reduce((acc, mark) => acc + mark, 0);
      newSubTotals[criteria] = subtotal;
    }

    setSubTotals(newSubTotals);
  }, [marks]);

  useEffect(() => {
    const newTotal = Object.values(subTotals).reduce(
      (acc, subTotal) => acc + subTotal,
      0
    );

    setTotal(newTotal);
  }, [subTotals]);

  const handleRangeChange =
    (rangeIndex: number, valueIndex: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);

      setRanges((prev) => {
        if (!prev) return [];
        const updatedRanges = [...prev];

        updatedRanges[rangeIndex] = [
          valueIndex === 0 ? newValue : updatedRanges[rangeIndex][0],
          valueIndex === 1 ? newValue : updatedRanges[rangeIndex][1],
        ];

        return updatedRanges;
      });
    };

  const handleMarkChange =
    (criteria: string, rangeIndex: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);

      setMarks((prevMarks) => {
        const updatedMarks = [...prevMarks[criteria]];
        updatedMarks[rangeIndex] = newValue;

        return {
          ...prevMarks,
          [criteria]: updatedMarks,
        };
      });
    };

  const toggleCriterias = (criteria: string) => {
    setTempCriterias((prev) => {
      const updatedCriterias = { ...prev };
      updatedCriterias[criteria] = !updatedCriterias[criteria];
      return updatedCriterias;
    });

    setMarks((prevMarks) => {
      const updatedMarks = [...prevMarks[criteria]];
      updatedMarks.fill(0);

      return {
        ...prevMarks,
        [criteria]: updatedMarks,
      };
    });
  };

  const handleSubmit = async () => {
    const updatedMarks = { ...marks };

    rubric?.criterias.forEach((critera) => {
      if (tempCriterias && !tempCriterias[critera]) {
        delete updatedMarks[critera];
      }
    });

    const payload = {
      criterias: Object.entries(updatedMarks).map(([criteria, marksArray]) => ({
        name: criteria,
        marks_ranges: ranges?.map((range, i) => ({
          range,
          marks: marksArray[i],
        })),
      })),
    };

    try {
      setIsLoading(true);
      const res = await fetch(
        `http://127.0.0.1:8000/questions/rubrics/${qid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col pb-5">
      <TypographyH2>Customize the Rubric</TypographyH2>

      <div className="flex justify-between">
        <div className="mt-5">
          <TypographyH4 className="capitalize">Diagram type</TypographyH4>
          <TypographyInlineCode>{diagramType}</TypographyInlineCode>
        </div>
        <div className="mt-5">
          <TypographyH4 className="capitalize">Total marks</TypographyH4>
          <TypographyInlineCode>{total}</TypographyInlineCode>
        </div>
      </div>

      <Tabs defaultValue={rubric?.criterias[0]} className="mt-8">
        <TypographyH4 className="capitalize mb-2">
          Criterias
          <Button variant="ghost">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Pencil1Icon
                  className="h-4 w-4"
                  onClick={() => setOpen(true)}
                />
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Criterias</DialogTitle>
                  <DialogDescription>
                    Select which criterias you want to evaluate for this
                    question.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-3 space-y-5">
                  {rubric?.criterias.map((criteria, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Checkbox
                        id={criteria}
                        checked={tempCriterias && tempCriterias[criteria]}
                        onClick={() => toggleCriterias(criteria)}
                      />
                      <label
                        htmlFor={criteria}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        {criteria}
                      </label>
                    </div>
                  ))}
                </div>

                <DialogFooter>
                  <Button type="submit" onClick={() => setOpen(false)}>
                    Done
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Button>
        </TypographyH4>

        <TabsList className="w-full">
          {tempCriterias &&
            Object.keys(tempCriterias).map(
              (criteria, i) =>
                tempCriterias[criteria] && (
                  <TabsTrigger key={i} value={criteria} className="capitalize">
                    {criteria}
                  </TabsTrigger>
                )
            )}
        </TabsList>

        {tempCriterias &&
          Object.keys(tempCriterias).map(
            (criteria, i) =>
              tempCriterias[criteria] && (
                <TabsContent key={i} value={criteria} className="mt-5">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <TypographyP className="font-semibold">
                          Correctness Percentages
                        </TypographyP>
                        <p className="mr-5 font-semibold">Marks</p>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      {ranges?.map((range, i) => (
                        <div key={i}>
                          <div className="flex gap-2 items-center mb-5">
                            <Input
                              type="number"
                              value={range[0]}
                              className="w-16"
                              min={0}
                              max={100}
                              onChange={(e) => {
                                handleRangeChange(i, 0)(e);
                              }}
                            />
                            <p>-</p>
                            <Input
                              type="number"
                              value={range[1]}
                              className="w-16"
                              min={0}
                              max={100}
                              onChange={(e) => {
                                handleRangeChange(i, 1)(e);
                              }}
                            />
                            <p>%</p>
                            <div className="flex-1 flex items-center justify-end">
                              <Input
                                type="number"
                                className="w-16"
                                min={0}
                                value={marks[criteria][i]}
                                onChange={(e) =>
                                  handleMarkChange(criteria, i)(e)
                                }
                              />
                            </div>
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </CardContent>

                    <CardFooter>
                      <div className="w-full flex items-center">
                        <TypographyP className="flex-1 text-end capitalize font-semibold">
                          Sub total
                        </TypographyP>
                        <p className="w-16 text-center font-bold font-mono">
                          {subTotals && subTotals[criteria]}
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              )
          )}
      </Tabs>

      <Button
        type="submit"
        className="w-fit mt-8 mb-5"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Submit
      </Button>
    </div>
  );
};

export default Rubric;
