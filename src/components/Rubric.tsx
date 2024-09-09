import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "./ui/input";
import { TypographyH2 } from "./ui/TypographyH2";
import { Separator } from "./ui/separator";
import { TypographyP } from "./ui/TypographyP";
import { useState } from "react";

type Rubric = {
  criterias: string[];
  ranges: [number, number][];
};

const Rubric = ({ qid, rubric }: { qid: string; rubric?: Rubric }) => {
  const [marks, setMarks] = useState({});
  const [ranges, setRanges] = useState(rubric?.ranges);
  console.log(rubric?.ranges);
  
  return (
    <div className="flex flex-col">
      <TypographyH2 className="self-center">Customize the Rubric</TypographyH2>
      <Tabs defaultValue="account" className="mt-5">
        <TabsList>
          {rubric?.criterias.map((criteria, i) => (
            <TabsTrigger key={i} value={criteria} className="capitalize">
              {criteria}
            </TabsTrigger>
          ))}
        </TabsList>
        {rubric?.criterias.map((criteria, i) => (
          <TabsContent key={i} value={criteria} className="space-y-5 mt-5">
            <div className="flex justify-between">
              <TypographyP className="font-semibold">
                Correctness Percentage
              </TypographyP>
              <TypographyP className="[&:not(:first-child)]:mt-0 mr-5 font-semibold">
                Marks
              </TypographyP>
            </div>
            {ranges?.map((range, i) => (
              <div key={i}>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={range[0]}
                    className="w-16"
                    min={0}
                    max={100}
                    onChange={(e) => {
                      range[0] = Number(e.target.value);
                      setRanges(prev=> [])
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
                      range[0] = Number(e.target.value);
                    }}
                  />
                  <p>%</p>
                  <div className="flex-1 flex items-center justify-end">
                    <Input type="number" className="w-16" min={0} />
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Rubric;
