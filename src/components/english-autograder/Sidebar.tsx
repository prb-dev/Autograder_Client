import React from 'react';
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
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SidebarProps {
  onUploadEssay: () => void;
  onViewResults: () => void;
  onDownloadReport: () => void;
}

const EnglishEssaySidebar: React.FC<SidebarProps> = ({ onUploadEssay, onViewResults, onDownloadReport }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'upload') {
      onUploadEssay();
    } else if (value === 'view') {
      onViewResults();
    } else if (value === 'download') {
      onDownloadReport();
    }
  };

  return (
    <aside className="h-screen w-64 p-4 border-r bg-white">
      <Command className="rounded-lg border shadow-md">
        <select onChange={handleSelectChange} className="w-full p-2 border rounded-md mb-4">
          <option value="">Select Command</option>
          <option value="upload">Upload Essay</option>
          <option value="view">View Results</option>
          <option value="download">Download Report</option>
        </select>
        <CommandList>
          {/* AI Essay Grading Section */}
          <CommandGroup heading="AI Essay Grading">
            <CommandItem onSelect={onUploadEssay}>
              <FilePlusIcon className="mr-2 h-4 w-4" />
              Upload Essay
            </CommandItem>
            <CommandItem onSelect={onViewResults}>
              <EyeOpenIcon className="mr-2 h-4 w-4" />
              View Results
            </CommandItem>
            <CommandItem onSelect={onDownloadReport}>
              <RocketIcon className="mr-2 h-4 w-4" />
              Download Report
            </CommandItem>
          </CommandGroup>

          {/* Grading Reports Section */}
          <CommandGroup heading="Grading Reports">
            <CommandItem>
              <EyeOpenIcon className="mr-2 h-4 w-4" />
              View Reports
            </CommandItem>
          </CommandGroup>

          {/* Settings Section */}
          <CommandGroup heading="Settings">
            <CommandItem>
              <PersonIcon className="mr-2 h-4 w-4" />
              Profile
            </CommandItem>
            <CommandItem>
              <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
              Notifications
            </CommandItem>
            <CommandItem>
              <GearIcon className="mr-2 h-4 w-4" />
              Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </aside>
  );
};

export default EnglishEssaySidebar;