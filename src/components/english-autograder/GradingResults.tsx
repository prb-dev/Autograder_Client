import React from 'react';

interface SentenceError {
  type: string;
  original: string;
  corrected: string;
}

interface GradingResult {
  original_essay: string;
  corrected_essay: string;
  score: number;
  grammar_score: number | null;
  vocabulary_score: number | null;
  creativity_score: number | null;
  total_words: number;
  error_rate: number;
  primary_focus: string;
  detailed_errors: SentenceError[];
  feedback: string[];
}

interface GradingResultsProps {
  result: GradingResult;
  downloadReport: () => void;
}

const GradingResults: React.FC<GradingResultsProps> = ({ result, downloadReport }) => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Grading Results</h2>
      {/* Scores Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-blue-100 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Overall Score</h3>
          <p className="text-3xl font-bold text-blue-600">{result.score}/10</p>
        </div>
        {result.grammar_score !== null && (
          <div className="p-4 bg-green-100 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Grammar Score</h3>
            <p className="text-3xl font-bold text-green-600">{result.grammar_score}/10</p>
          </div>
        )}
        {result.vocabulary_score !== null && (
          <div className="p-4 bg-purple-100 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Vocabulary Score</h3>
            <p className="text-3xl font-bold text-purple-600">{result.vocabulary_score}/10</p>
          </div>
        )}
        {result.creativity_score !== null && (
          <div className="p-4 bg-yellow-100 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">Creativity Score</h3>
            <p className="text-3xl font-bold text-yellow-600">{result.creativity_score}/10</p>
          </div>
        )}
      </div>
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-pink-100 rounded-lg">
          <h3 className="text-lg font-semibold text-pink-800">Error Rate</h3>
          <p className="text-3xl font-bold text-pink-600">{result.error_rate}%</p>
        </div>
        <div className="p-4 bg-indigo-100 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-800">Total Words</h3>
          <p className="text-3xl font-bold text-indigo-600">{result.total_words}</p>
        </div>
      </div>
      {/* Feedback */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Feedback</h3>
        <ul className="list-disc list-inside space-y-2">
          {result.feedback.map((item, index) => (
            <li key={index} className="text-gray-700">{item}</li>
          ))}
        </ul>
      </div>
      {/* Detailed Errors */}
      {result.detailed_errors && result.detailed_errors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Detailed Errors</h3>
          <div className="space-y-3">
            {result.detailed_errors.map((error, index) => (
              <div key={index} className="p-3 bg-red-100 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-semibold">{error.type} Error:</span> 
                  <span className="line-through text-red-500"> {error.original}</span>
                  <span className="text-green-500"> → {error.corrected}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Original and Corrected Essays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Original Essay</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{result.original_essay}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Corrected Essay</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{result.corrected_essay}</p>
        </div>
      </div>
      {/* Download Report Button */}
      <div className="mt-6 text-center">
        <button
          onClick={downloadReport}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default GradingResults;
