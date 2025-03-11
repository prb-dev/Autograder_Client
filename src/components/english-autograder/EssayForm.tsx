
import React from 'react';

interface EssayFormProps {
  essay: string;
  setEssay: (value: string) => void;
  essayType: string;
  setEssayType: (value: string) => void;
  gradingParams: {
    min_word_count: number;
    max_word_count: number;
    grammar_weight: number;
    vocabulary_weight: number;
    creativity_weight: number;
  };
  handleParamChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isGrading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const EssayForm: React.FC<EssayFormProps> = ({
  essay, setEssay, essayType, setEssayType,
  gradingParams, handleParamChange, isGrading, handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="mb-5">
      {/* Essay Type Selection */}
      <div className="mb-4">
        <label htmlFor="essayType" className="block text-sm font-medium text-gray-700">Essay Type</label>
        <select
          id="essayType"
          value={essayType}
          onChange={(e) => setEssayType(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          required
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>
      {/* Grading Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* ...existing input groups... */}
        <div>
          <label htmlFor="min_word_count" className="block text-sm font-medium text-gray-700">Min Word Count</label>
          <input
            type="number"
            id="min_word_count"
            name="min_word_count"
            value={gradingParams.min_word_count}
            onChange={handleParamChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="0"
            required
          />
        </div>
        <div>
          <label htmlFor="max_word_count" className="block text-sm font-medium text-gray-700">Max Word Count</label>
          <input
            type="number"
            id="max_word_count"
            name="max_word_count"
            value={gradingParams.max_word_count}
            onChange={handleParamChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="0"
            required
          />
        </div>
        <div>
          <label htmlFor="grammar_weight" className="block text-sm font-medium text-gray-700">Grammar Weight</label>
          <input
            type="number"
            id="grammar_weight"
            name="grammar_weight"
            value={gradingParams.grammar_weight}
            onChange={handleParamChange}
            step="0.01"
            min="0"
            max="1"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="vocabulary_weight" className="block text-sm font-medium text-gray-700">Vocabulary Weight</label>
          <input
            type="number"
            id="vocabulary_weight"
            name="vocabulary_weight"
            value={gradingParams.vocabulary_weight}
            onChange={handleParamChange}
            step="0.01"
            min="0"
            max="1"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="creativity_weight" className="block text-sm font-medium text-gray-700">Creativity Weight</label>
          <input
            type="number"
            id="creativity_weight"
            name="creativity_weight"
            value={gradingParams.creativity_weight}
            onChange={handleParamChange}
            step="0.01"
            min="0"
            max="1"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>
      {/* Essay Textarea */}
      <div className="mb-4">
        <label htmlFor="essay" className="block text-sm font-medium text-gray-700">Essay</label>
        <textarea
          id="essay"
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter your essay here"
          required
        ></textarea>
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isGrading}
        className={`w-full px-4 py-2 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${isGrading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {isGrading ? 'Grading...' : 'Grade Essay'}
      </button>
    </form>
  );
};

export default EssayForm;