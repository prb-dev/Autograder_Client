import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Link } from "react-router-dom";
import Sidebar from "@/components/english-autograder/Sidebar";
import {
  EnvelopeClosedIcon,
  EyeOpenIcon,
  FilePlusIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

// Sidebar Component
const SideMenuTechnicalLecturer = () => {
  const menuList = [
    {
      group: {
        heading: "Questions",
        items: [
          {
            link: "/create/t",
            icon: <FilePlusIcon className="mr-2 h-4 w-4" />,
            text: "Create",
          },
          {
            link: "/view/t",
            icon: <EyeOpenIcon className="mr-2 h-4 w-4" />,
            text: "View",
          },
          {
            link: "/launch/t",
            icon: <RocketIcon className="mr-2 h-4 w-4" />,
            text: "Launch",
          },
        ],
      },
    },
    {
      group: {
        heading: "Answers",
        items: [
          {
            link: "/view-answers/t",
            icon: <EyeOpenIcon className="mr-2 h-4 w-4" />,
            text: "View",
          },
        ],
      },
    },
    {
      group: {
        heading: "Settings",
        items: [
          {
            link: "/profile/t",
            icon: <PersonIcon className="mr-2 h-4 w-4" />,
            text: "Profile",
          },
          {
            link: "/mail/t",
            icon: <EnvelopeClosedIcon className="mr-2 h-4 w-4" />,
            text: "Mail",
          },
          {
            link: "/settings/t",
            icon: <GearIcon className="mr-2 h-4 w-4" />,
            text: "Settings",
          },
        ],
      },
    },
  ];

  return (
    <div className="h-[100vh] w-64 p-4 border-r">
      <Command className="rounded-lg border shadow-md md:min-w-[300px] pt-5">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="max-h-full">
          <CommandEmpty>No results found.</CommandEmpty>
          {menuList.map(({ group }, idx) => (
            <div key={`menu${idx}`}>
              <CommandGroup heading={group.heading}>
                {group.items.map((item, i) => (
                  <Link key={i} to={item.link}>
                    <CommandItem>
                      {item.icon}
                      {item.text}
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
              {idx !== menuList.length - 1 && <CommandSeparator />}
            </div>
          ))}
        </CommandList>
      </Command>
    </div>
  );
};

// Interfaces
interface GradingParams {
  min_word_count: number;
  max_word_count: number;
  grammar_weight: number;
  vocabulary_weight: number;
  creativity_weight: number;
}

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

interface ProgressMessage {
  type: 'progress';
  sentence_index: number;
  total_sentences: number;
  corrected?: string;
  original?: string;
  status?: string;
  detailed_errors?: SentenceError[];
}

interface ResultMessage {
  type: 'result';
  data: GradingResult;
}

interface ErrorMessage {
  type: 'error';
  message: string;
}

type ServerMessage = ProgressMessage | ResultMessage | ErrorMessage;

const englishAutograder: React.FC = () => {
  // State Variables
  const [essay, setEssay] = useState<string>('');
  const [result, setResult] = useState<GradingResult | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [essayType, setEssayType] = useState<string>('medium');
  const [gradingParams, setGradingParams] = useState<GradingParams>({
    min_word_count: 300,
    max_word_count: 600,
    grammar_weight: 0.35,
    vocabulary_weight: 0.35,
    creativity_weight: 0.3,
  });
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [originalSentences, setOriginalSentences] = useState<string[]>([]);
  const [correctedSentences, setCorrectedSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Removed unused sentenceErrors state

  const wsRef = useRef<ReconnectingWebSocket | null>(null);

  // Handle changes in grading parameters
  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGradingParams(prev => ({
      ...prev,
      [name]: name.includes('weight') ? parseFloat(value) : parseInt(value, 10)
    }));
  };

  // Establish WebSocket connection
  const connectWebSocket = useCallback(() => {
    const rws = new ReconnectingWebSocket('ws://localhost:8000/grade');

    rws.addEventListener('open', () => {
      console.log('WebSocket connection opened');
      // Send the essay data
      rws.send(JSON.stringify({
        essay: essay,
        essay_type: essayType,
        grading_params: gradingParams
      }));
    });

    rws.addEventListener('message', (event: MessageEvent) => {
      try {
        const data: ServerMessage = JSON.parse(event.data);
        console.log('Received message:', data);

        if (data.type === 'progress') {
          const { sentence_index, total_sentences, corrected, original, detailed_errors } = data;

          // Update correctedSentences array
          setCorrectedSentences(prev => {
            const newCorrected = [...prev];
            newCorrected[sentence_index] = corrected || original || '';
            return newCorrected;
          });

          // Removed sentence errors update as it is unused

          // Update progress
          setProgress(((sentence_index + 1) / total_sentences) * 100);

          // Update current sentence index
          setCurrentSentenceIndex(sentence_index);
        } else if (data.type === 'result') {
          setResult(data.data);
          setIsGrading(false);
        } else if (data.type === 'error') {
          setErrorMessage(data.message);
          setIsGrading(false);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
        setErrorMessage('Failed to parse server message.');
        setIsGrading(false);
      }
    });

    rws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setErrorMessage('WebSocket encountered an error.');
      setIsGrading(false);
    });

    rws.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event);
      setIsGrading(false);
      const closeEvent = event as CloseEvent;
      if (!closeEvent.wasClean) {
        setErrorMessage('WebSocket connection closed unexpectedly.');
      }
    });

    wsRef.current = rws;
  }, [essay, essayType, gradingParams]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGrading(true);
    setResult(null);
    setProgress(0);
    setErrorMessage(null);

    // Split essay into sentences
    const sentences = essay.match(/[^\.!\?]+[\.!\?]+/g) || [];
    setOriginalSentences(sentences);
    setCorrectedSentences(new Array(sentences.length).fill(''));
    setSentenceErrors(new Array(sentences.length).fill([]));

    // Establish WebSocket connection
    connectWebSocket();
  };
    // Removed sentenceErrors initialization as it is unused
  // Cleanup WebSocket connection on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Download report as a text file
  const downloadReport = () => {
    if (result) {
      const report = `
Essay Grading Report

Original Essay:
${result.original_essay}

Corrected Essay:
${result.corrected_essay}

Overall Score: ${result.score}/10
Grammar Score: ${result.grammar_score !== null ? result.grammar_score + '/10' : 'N/A'}
Vocabulary Score: ${result.vocabulary_score !== null ? result.vocabulary_score + '/10' : 'N/A'}
Creativity Score: ${result.creativity_score !== null ? result.creativity_score + '/10' : 'N/A'}

Total Words: ${result.total_words}
Error Rate: ${result.error_rate}%

Primary Focus: ${result.primary_focus}

Detailed Errors:
${result.detailed_errors.map(error => `${error.type} Error: "${error.original}" → "${error.corrected}"`).join('\n')}

Feedback:
${result.feedback.join('\n')}
      `;

      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'essay_grading_report.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar/>
      {/* Sidebar */}
       

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          
          {/* Main Content Container */}
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-4xl font-bold mb-5 text-gray-800 text-center">AI Essay Grading</h1>
            
            {/* Essay Submission Form */}
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
                className={`w-full px-4 py-2 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
                  isGrading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isGrading ? 'Grading...' : 'Grade Essay'}
              </button>
            </form>

            {/* Error Display */}
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                <p>Error: {errorMessage}</p>
              </div>
            )}

            {/* Grading Progress */}
            {isGrading && (
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
                      <div
                        key={index}
                        className={`p-3 rounded-lg shadow-sm ${isCurrent ? 'bg-blue-100' : 'bg-gray-50'}`}
                      >
                        <p className="text-sm text-gray-700">
                          <strong>Original:</strong> {original}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Corrected:</strong> {corrected}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grading Results */}
            {result && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default englishAutograder;