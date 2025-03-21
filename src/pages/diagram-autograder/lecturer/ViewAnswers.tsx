import * as React from "react";
import { Combobox } from "@/components/ui/combobox";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useEffect, useState } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, Params, useNavigate, useParams } from "react-router-dom";
import { TypographyH4 } from "@/components/ui/TypographyH4";
import { TypographyInlineCode } from "@/components/ui/TypographyInlineCode";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactJson from "react-json-view";

export type Answer = {
  id: string;
  uid: string;
  diagram: string;
  correct_diagram: string;
  marks: any;
  created_at: string;
};

const ViewAnswers = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [qids, setQids] = useState([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = useState<Answer[]>([]);

  const columns: ColumnDef<Answer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "_id",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "uid",
      header: "Student id",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("uid")}</div>
      ),
    },
    {
      accessorKey: "marks",
      accessorFn: (row) => row.marks.total,
      header: "Marks",
      cell: ({ row }) => <div>{row.getValue("marks")}</div>,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created_at
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium font-mono">
          {row.getValue("created_at")}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const answer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(answer.id)}
              >
                Copy answer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to={`${answer.id}`}>
                <DropdownMenuItem>View answer details</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/questions/ids`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        const ids = data.qids.map((item: any) => item._id);

        setQids(ids.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!params.qid) {
      navigate("/view/a");
      setData([]);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/answers/${params.qid}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        const answers = data.answers.map((item: any) => ({
          id: item._id,
          uid: item.user_id,
          marks: item.marks,
          diagram: item.answer.image,
          created_at: item.created_at,
        }));

        setData(answers.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [params.qid]);

  return (
    <div className="p-5 space-y-4">
      {params.aid ? (
        <div>
          <AnswerDetails params={params} />
        </div>
      ) : (
        <div>
          <TypographyH2>View Answers</TypographyH2>

          <Combobox
            title="Select Question..."
            placeholder="Search Question..."
            emptyMessage="No question found."
            values={qids}
          />

          <div className="w-full">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter IDs..."
                value={
                  (table.getColumn("id")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("id")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AnswerDetails = ({ params }: { params: Readonly<Params<string>> }) => {
  const [answer, setAnswer] = useState<any>();
  const [showRubric, setShowRubric] = useState(false);

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_BASE_API_URL}/answers/${params.qid}/${
              params.aid
            }`,
            {
              credentials: "include",
            }
          ),
          fetch(
            `${import.meta.env.VITE_BASE_API_URL}/questions/${params.qid}`,
            { credentials: "include" }
          ),
        ]);
        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

        const answer = {
          id: data1.answer._id,
          uid: data1.answer.user_id,
          marks: data1.answer.marks,
          rubric: data2.question.rubric,
          diagram: data1.answer.answer.image,
          textObject: data1.answer.answer.text_representation,
          correct_diagram: data2.question.correct_answer.image,
          correct_textObject: data2.question.correct_answer.text_representation,
          created_at: data1.answer.created_at,
        };

        setAnswer(answer);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAnswer();
  }, [params.aid]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Answers Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-between mb-10">
              <div className="mt-5">
                <TypographyH4 className="capitalize">Student ID</TypographyH4>
                <TypographyInlineCode>{answer?.uid}</TypographyInlineCode>
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
                <TypographyH4 className="capitalize">Total marks</TypographyH4>
                <TypographyInlineCode>
                  {answer?.marks.total}
                </TypographyInlineCode>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Marks for each criterion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-5">
              <Button onClick={() => setShowRubric(!showRubric)}>
                {showRubric ? "Hide Rubric" : "Show Rubric"}
              </Button>
            </div>
            {showRubric && (
              <Tabs
                defaultValue={answer?.rubric.criterias[0].name}
                className="mb-5"
              >
                <TabsList className="w-full">
                  {answer?.rubric.criterias.map((criterion: any) => (
                    <TabsTrigger
                      key={criterion.name}
                      value={criterion.name}
                      className="capitalize"
                    >
                      {criterion.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {answer?.rubric.criterias.map((criterion: any) => (
                  <TabsContent key={criterion.name} value={criterion.name}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center w-1/2">
                            Correctness
                          </TableHead>
                          <TableHead className="text-center">Marks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-center">
                        {criterion.marks_ranges.map((range: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {`${range.range[0]} - ${range.range[1]} %`}
                            </TableCell>
                            <TableCell>{range.marks}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter className="text-center">
                        <TableRow>
                          <TableCell>SubTotal</TableCell>
                          <TableCell>{criterion.sub_total}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            )}

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
            <CardTitle className="text-xl">Correct UML Diagram</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="image">
              <TabsList className="w-full">
                <TabsTrigger key="image" value="image" className="capitalize">
                  Image
                </TabsTrigger>
                <TabsTrigger key="json" value="json" className="capitalize">
                  Json
                </TabsTrigger>
              </TabsList>
              <TabsContent value="image">
                <img
                  src={answer?.correct_diagram}
                  alt="Correct UML Diagram"
                  className="w-full max-h-[500px] rounded-lg border object-scale-down"
                />
              </TabsContent>
              <TabsContent value="json">
                <div className="w-full max-h-[500px] overflow-auto">
                  <ReactJson src={answer?.correct_textObject} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Student's UML Diagram</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="image">
              <TabsList className="w-full">
                <TabsTrigger key="image" value="image" className="capitalize">
                  Image
                </TabsTrigger>
                <TabsTrigger key="json" value="json" className="capitalize">
                  Json
                </TabsTrigger>
              </TabsList>
              <TabsContent value="image">
                <img
                  src={answer?.diagram}
                  alt="Student's UML Diagram"
                  className="w-full max-h-[500px] rounded-lg border object-scale-down"
                />
              </TabsContent>
              <TabsContent value="json">
                <div className="w-full max-h-[500px] overflow-auto">
                  <ReactJson src={answer?.textObject} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Link to={`/view/${params.qid}/a`}>
          <Button>Done</Button>
        </Link>
      </div>
    </div>
  );
};

export default ViewAnswers;
