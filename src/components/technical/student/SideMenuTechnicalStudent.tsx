import React from "react";
import {
  EnvelopeClosedIcon,
  EyeOpenIcon,
  GearIcon,
  PersonIcon,
  FilePlusIcon,
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
import { Link } from "react-router-dom";

const SideMenuTechnicalStudent = () => {
  // NOTE: Adjust the links/paths here as needed:
  const menuList = [
    {
      group: {
        heading: "Assignments",
        items: [
          {
            link: "/find-assignment/t",
            icon: <FilePlusIcon className="mr-2 h-4 w-4" />,
            text: "Find assignment",
          },
          {
            link: "/marks/t",
            icon: <EyeOpenIcon className="mr-2 h-4 w-4" />,
            text: "Marks",
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
    <div className="h-[100vh]">
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

export default SideMenuTechnicalStudent;
