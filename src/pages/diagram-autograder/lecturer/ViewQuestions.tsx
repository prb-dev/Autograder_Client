import * as React from "react";
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
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { Link, Params, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/TypographyH4";
import { TypographyInlineCode } from "@/components/ui/TypographyInlineCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ReactJson from "react-json-view";
import { useToast } from "@/hooks/use-toast";

export type Question = {
  _id: string;
  answer_count: number;
  status: "pending" | "processing" | "success" | "failed";
  diagram_type: string;
  created_at: Date;
};

const getColumns = (fetchData: () => Promise<void>): ColumnDef<Question>[] => {
  return [
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
      accessorKey: "_id",
      header: "_id",
      cell: ({ row }) => <div>{row.getValue("_id")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => <div className="capitalize">{"Published"}</div>,
    },
    {
      accessorKey: "diagram_type",
      header: () => <div>Diagram Type</div>,
      cell: ({ row }) => (
        <Badge className="capitalize">{row.getValue("diagram_type")}</Badge>
      ),
    },
    {
      accessorKey: "answer_count",
      header: () => <div>Answers</div>,
      cell: ({ row }) => (
        <div className="font-mono">{row.getValue("answer_count")}</div>
      ),
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
        const { toast } = useToast();
        const handleDelete = async (id: string) => {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_BASE_API_URL}/questions/${id}`,
              {
                method: "DELETe",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );

            if (res.status !== 200) {
              throw new Error();
            }

            const data = await res.json();

            await fetchData();

            toast({
              title: "Success",
              description: data.message,
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "An error occurred while deleting the question.",
            });
            console.log(error);
          }
        };

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
                onClick={() =>
                  navigator.clipboard.writeText(row.getValue("_id"))
                }
              >
                Copy question ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to={`${row.getValue("_id")}`}>
                <DropdownMenuItem>View question details</DropdownMenuItem>
              </Link>
              <Link to={`/view/${row.getValue("_id")}/a`}>
                <DropdownMenuItem>View answers</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(row.getValue("_id"))}
              >
                Delete question
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

const ViewQuestions = () => {
  const params = useParams();
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/questions`,
        {
          credentials: "include",
        }
      );
      const values = await res.json();
      setData(values.questions.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const columns = getColumns(fetchData);

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

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {params.qid ? (
        <ViewQuestion params={params} />
      ) : (
        <div className="w-full p-5">
          <TypographyH2>View Questions</TypographyH2>

          <div className="flex items-center py-4">
            <Input
              placeholder="Filter IDs..."
              value={(table.getColumn("_id")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("_id")?.setFilterValue(event.target.value)
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
      )}
    </>
  );
};

const ViewQuestion = ({ params }: { params: Readonly<Params<string>> }) => {
  const [question, setQuestion] = React.useState<any>();
  React.useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/questions/${params.qid}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        const question = {
          id: data.question._id,
          question: data.question.question,
          deadline: data.question.deadline,
          image: data.question.correct_answer.image,
          textObject: data.question.correct_answer.text_representation,
          rubric: data.question.rubric,
          count: data.question.answer_count,
          type: data.question.diagram_type,
        };

        setQuestion(question);
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuestion();
  }, [params.qid]);

  return (
    <div className="p-5 space-y-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Question Details</CardTitle>
          <Link to={`/view/${question?.id}/a`}>
            <Button>View Answers</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-between mb-10">
            <div className="mt-5">
              <TypographyH4 className="capitalize">Question ID</TypographyH4>
              <TypographyInlineCode>{question?.id}</TypographyInlineCode>
            </div>
            <div className="mt-5">
              <TypographyH4 className="capitalize">Answer count</TypographyH4>
              <TypographyInlineCode>{question?.count}</TypographyInlineCode>
            </div>
            <div className="mt-5 capitalize">
              <TypographyH4>Type</TypographyH4>
              <Badge>{question?.type}</Badge>
            </div>
            <div className="mt-5">
              <TypographyH4 className="capitalize">Deadline</TypographyH4>
              <TypographyInlineCode>{question?.deadline}</TypographyInlineCode>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <TypographyH4 className="capitalize">Question</TypographyH4>
            <p>{question?.question}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Rubric</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={question?.rubric.criterias[0].name}>
              <TabsList className="w-full">
                {question?.rubric.criterias.map((criterion: any) => (
                  <TabsTrigger
                    key={criterion.name}
                    value={criterion.name}
                    className="capitalize"
                  >
                    {criterion.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {question?.rubric.criterias.map((criterion: any) => (
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Answer</CardTitle>
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
                  src={question?.image}
                  alt="Correct UML Diagram"
                  className="w-full max-h-[500px] rounded-lg border object-scale-down"
                />
              </TabsContent>
              <TabsContent value="json">
                <div className="w-full max-h-[500px] overflow-auto">
                  <ReactJson src={question?.textObject} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Link to={"/view/q"}>
          <Button>Done</Button>
        </Link>
      </div>
    </div>
  );
};

export default ViewQuestions;
