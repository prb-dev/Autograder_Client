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
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const EnglishEssaySidebar: React.FC = () => {
  return (
    <aside className="h-screen w-64 p-4 border-r bg-white">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command or search..." />

        <CommandList>
          {/* AI Essay Grading Section */}
          <CommandGroup heading="AI Essay Grading">
            <CommandItem>
              <FilePlusIcon className="mr-2 h-4 w-4" />
              Upload Essay
            </CommandItem>
            <CommandItem>
              <EyeOpenIcon className="mr-2 h-4 w-4" />
              View Results
            </CommandItem>
            <CommandItem>
              <RocketIcon className="mr-2 h-4 w-4" />
              Launch Grading
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