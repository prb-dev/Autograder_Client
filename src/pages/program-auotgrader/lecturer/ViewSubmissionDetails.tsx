import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ViewSubmissionDetails = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/submissions/${submissionId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch submission details");
        }
        const values = await res.json();
        setSubmission(values.data);
      } catch (error) {
        console.error(error);
        setSubmission(null);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  return (
    <div className="w-full p-5">
      {submission ? (
        <>
          <TypographyH2>Submission Details</TypographyH2>
          <Card className="shadow-lg my-6">
            <CardHeader>
              <CardTitle>Submission ID: {submission._id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Student ID:</strong> {submission.student_id}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Total Marks:</strong> {submission.total_score}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Submitted Code:</strong>
              </p>
              <pre className="bg-gray-100 p-4 rounded-md mt-2 whitespace-pre-wrap">
                {submission.submitted_code}
              </pre>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Detailed Grades:</strong>
              </p>
              {Object.entries(submission.detailed_results).map(
                ([criteria, score], index) => (
                  <p key={index} className="text-sm text-gray-700">
                    <strong>{criteria.replace(/_/g, " ")}:</strong> {score}
                  </p>
                )
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <TypographyH2>Loading Submission Details...</TypographyH2>
      )}
    </div>
  );
};

export default ViewSubmissionDetails;
