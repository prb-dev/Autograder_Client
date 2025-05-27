import React, { useRef } from "react";
import {
  FilePlusIcon,
  EyeOpenIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import mammoth from "mammoth";

interface SidebarProps {
  onUploadEssay: (text: string) => void;
  onViewResults: () => void;
  onDownloadReport: () => void;
}

const EnglishEssaySidebar: React.FC<SidebarProps> = ({
  onUploadEssay,
  onViewResults,
  onDownloadReport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 📂 Handle file selection for .docx
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (!e.target?.result) return;
      const arrayBuffer = e.target.result as ArrayBuffer;
      const extractedText = await extractDocxText(arrayBuffer);
      onUploadEssay(extractedText);
    };
    reader.readAsArrayBuffer(file);
  };

  // 📝 Extract text from `.docx` using mammoth
  const extractDocxText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value.trim();
    } catch (error) {
      console.error("Error extracting .docx text:", error);
      return "Error reading document.";
    }
  };

  return (
    <aside
      className="
        fixed top-0 left-0 z-50
        w-72 h-screen
        overflow-y-auto border-r bg-white shadow-lg
        flex flex-col
        p-6
      "
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Essay Grader</h2>
        <p className="text-sm text-gray-600">
          Quickly manage & grade your essays
        </p>
      </div>

      <Command className="rounded-md border shadow-sm flex-grow">
        <CommandList>
          <CommandGroup heading="AI Essay Grading" className="px-4 py-4">
            {/* 1) Upload Essay */}
            <CommandItem
              onSelect={() => fileInputRef.current?.click()}
              className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer"
            >
              <FilePlusIcon className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Upload Essay (.docx)</span>
            </CommandItem>
            <input
              type="file"
              ref={fileInputRef}
              accept=".docx"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* 2) View Results */}
            <CommandItem
              onSelect={onViewResults}
              className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer"
            >
              <EyeOpenIcon className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">View Results</span>
            </CommandItem>

            {/* 3) Download Report */}
            <CommandItem
              onSelect={onDownloadReport}
              className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer"
            >
              <RocketIcon className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Download Report</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-3">
        © {new Date().getFullYear()} AI Essay Grader
      </footer>
    </aside>
  );
};

export default EnglishEssaySidebar;