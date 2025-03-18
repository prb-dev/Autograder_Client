import * as React from "react";
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
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypographyH2 } from "@/components/ui/TypographyH2";

export type Submission = {
  _id: string;
  student_id: string;
  total_score: number;
  submitted_at: string;
  assignment_id: string;
};

export const columns: ColumnDef<Submission>[] = [
  {
    accessorKey: "_id",
    header: "Submission ID",
    cell: ({ row }) => <div>{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "student_id",
    header: "Student ID",
    cell: ({ row }) => <div>{row.getValue("student_id")}</div>,
  },
  {
    accessorKey: "total_score",
    header: "Total Marks",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("total_score")}</div>
    ),
  },
  {
    accessorKey: "submitted_at",
    header: "Submitted At",
    cell: ({ row }) => (
      <div className="font-mono">
        {new Date(row.getValue("submitted_at")).toLocaleString()}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="outline"
          onClick={() =>
            navigate(`/submissions/details/${row.getValue("_id")}`)
          }
        >
          View Details
        </Button>
      );
    },
  },
];

const ViewSubmissions = () => {
  const { assignmentId } = useParams();
  const [data, setData] = React.useState<Submission[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
  const url = import.meta.env.VITE_API_PRO_URL;
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${url}/api/submissions/assignment/${assignmentId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch submissions");
        }
        const values = await res.json();
        if (Array.isArray(values.data)) {
          setData(values.data);
        } else {
          console.error("Unexpected API response format");
          setData([]);
        }
      } catch (error) {
        console.error(error);
        setData([]);
      }
    };

    fetchData();
  }, [assignmentId]);

  return (
    <div className="w-full p-5">
      <TypographyH2>
        View Submissions for Assignment ID: {assignmentId}
      </TypographyH2>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Submissions..."
          value={
            (table.getColumn("student_id")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("student_id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  No submissions found.
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
  );
};

export default ViewSubmissions;
