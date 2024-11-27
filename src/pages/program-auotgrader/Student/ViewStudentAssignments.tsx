import React, { useEffect, useState } from "react";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const ViewStudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/assignments/allForStudent"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const values = await res.json();

        if (Array.isArray(values.data)) {
          setAssignments(values.data);
        } else {
          console.error("Unexpected API response format");
          setAssignments([]);
        }
      } catch (error) {
        console.error(error);
        setAssignments([]); // Set to an empty array to avoid undefined
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="w-full p-5">
      <TypographyH2>View Assignments</TypographyH2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {assignments.map((assignment) => (
          <Card
            key={assignment._id}
            className="shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
          >
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
                {format(new Date(assignment.deadline), "PPP")}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="mt-4">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewStudentAssignments;
