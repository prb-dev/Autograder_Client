import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Submission = {
  _id: string;
  student_id?: string;
  total_score?: number;
  code_similarity_percentage?: number;
  submitted_code?: string;
  detailed_results?: Record<string, number>;
  assignment_id?: {
    rubric?: Record<string, number>;
  };
};

const ViewSubmissionDetails = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<Record<string, number>>(
    {}
  );
  const url = import.meta.env.VITE_API_PRO_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await fetch(`${url}/api/submissions/${submissionId}`);
        if (!res.ok) throw new Error("Failed to fetch submission details");

        const data = await res.json();
        const submissionData = data?.data;
        setSubmission(submissionData);

        const rubric = submissionData?.assignment_id?.rubric || {};
        const detailed = submissionData?.detailed_results;

        if (detailed && Object.keys(detailed).length > 0) {
          setEditedDetails(detailed);
        } else {
          const fallback: Record<string, number> = {};
          for (const key in rubric) {
            fallback[key] = 0;
          }
          setEditedDetails(fallback);
        }

        setError("");
      } catch (err) {
        console.error("Fetch error:", err);
        setSubmission(null);
        setError("Unable to load submission details.");
      }
    };

    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId, url]);

  const handleEditChange = (criteria: string, value: string) => {
    setEditedDetails({
      ...editedDetails,
      [criteria]: parseFloat(value),
    });
  };

  const handleSave = async () => {
    const calculatedTotal = Object.values(editedDetails).reduce(
      (sum, val) => sum + val,
      0
    );

    try {
      const res = await fetch(
        `${url}/api/submissions/manual-update/${submissionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            total_score: calculatedTotal,
            grades: editedDetails,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update submission");

      const updated = await res.json();
      setSubmission(updated.data);
      setIsEditing(false);
      setError("");
    } catch (err) {
      console.error("Manual update error:", err);
      setError("Failed to update submission.");
    }
  };

  const calculatedTotal = Object.values(editedDetails).reduce(
    (sum, val) => sum + val,
    0
  );

  return (
    <div className="w-full p-5">
      {error ? (
        <TypographyH2>{error}</TypographyH2>
      ) : submission ? (
        <>
          <TypographyH2>Submission Details</TypographyH2>
          <Card className="shadow-lg my-6">
            <CardHeader>
              <CardTitle>Submission ID: {submission._id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Student ID:</strong> {submission.student_id || "N/A"}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Total Marks:</strong> {calculatedTotal}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Code Similarity:</strong>{" "}
                {submission.code_similarity_percentage ?? "N/A"}%
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Submitted Code:</strong>
              </p>
              <pre className="bg-gray-100 p-4 rounded-md mt-2 whitespace-pre-wrap overflow-x-auto">
                {submission.submitted_code || "No code submitted."}
              </pre>
              <p className="text-sm text-gray-700 mb-2 mt-4">
                <strong>Detailed Grades:</strong>
              </p>
              {editedDetails && Object.keys(editedDetails).length > 0 ? (
                Object.entries(editedDetails).map(
                  ([criteria, score], index) => (
                    <p key={index} className="text-sm text-gray-700">
                      <strong>{criteria.replace(/_/g, " ")}:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="number"
                          value={score}
                          onChange={(e) =>
                            handleEditChange(criteria, e.target.value)
                          }
                          className="border p-1 rounded w-20"
                        />
                      ) : (
                        score
                      )}
                    </p>
                  )
                )
              ) : (
                <p className="text-sm text-gray-500">
                  No detailed results available.
                </p>
              )}
              <div className="mt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="mr-2">
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Grades
                  </Button>
                )}
              </div>
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
