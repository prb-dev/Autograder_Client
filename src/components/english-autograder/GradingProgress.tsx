import React from 'react';

interface GradingProgressProps {
  progress: number;
  originalSentences: string[];
  correctedSentences: string[];
  currentSentenceIndex: number;
}

const GradingProgress: React.FC<GradingProgressProps> = ({
  progress, originalSentences, correctedSentences, currentSentenceIndex,
}) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Grading Progress</h2>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center mb-4">{Math.round(progress)}% Complete</p>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {originalSentences.map((original, index) => {
          const corrected = correctedSentences[index] || 'Processing...';
          const isCurrent = index === currentSentenceIndex;
          return (
            <div key={index} className={`p-3 rounded-lg shadow-sm ${isCurrent ? 'bg-blue-100' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-700"><strong>Original:</strong> {original}</p>
              <p className="text-sm text-green-700"><strong>Corrected:</strong> {corrected}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GradingProgress;
