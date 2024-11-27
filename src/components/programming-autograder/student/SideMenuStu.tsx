import {
  EnvelopeClosedIcon,
  // EyeOpenIcon,
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

const SideMenuStu = () => {
  const menuList = [
    {
      group: {
        heading: "Assignments",
        items: [
          {
            link: "/findAssignment",
            icon: <FilePlusIcon className="mr-2 h-4 w-4" />,
            span: <span>Find Assignment</span>,
          },

          {
            link: "/stu/mark",
            icon: <RocketIcon className="mr-2 h-4 w-4" />,
            span: <span>Marks</span>,
          },
        ],
      },
    },

    {
      group: {
        heading: "Settings",
        items: [
          {
            link: "/create/q",
            icon: <PersonIcon className="mr-2 h-4 w-4" />,
            span: <span>Profile</span>,
          },
          {
            link: "/create/q",
            icon: <EnvelopeClosedIcon className="mr-2 h-4 w-4" />,
            span: <span>Mail</span>,
          },
          {
            link: "/create/q",
            icon: <GearIcon className="mr-2 h-4 w-4" />,
            span: <span>Settings</span>,
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

          {menuList.map(({ group }, i) => (
            <div key={`m${i}`}>
              <CommandGroup heading={group.heading}>
                {group.items.map((item, i) => (
                  <Link key={`l${i}`} to={item.link}>
                    <CommandItem>
                      {item.icon}
                      {item.span}
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>

              {i !== menuList.length - 1 && <CommandSeparator />}
            </div>
          ))}
        </CommandList>
      </Command>
    </div>
  );
};

export default SideMenuStu;
