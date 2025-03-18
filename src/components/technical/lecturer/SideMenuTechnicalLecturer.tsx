import React from "react";
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
import { Link } from "react-router-dom";

const SideMenuTechnicalLecturer = () => {
  // NOTE: You can tweak these links/paths as needed:
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

export default SideMenuTechnicalLecturer;
