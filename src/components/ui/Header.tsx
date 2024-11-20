import * as React from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; value: string }[] = [
  {
    title: "Diagram",
    href: "/docs/primitives/alert-dialog",
    value: "d",
  },
  {
    title: "Programming",
    href: "/docs/primitives/hover-card",
    value: "p",
  },
  {
    title: "Technical",
    href: "/docs/primitives/progress",
    value: "t",
  },
  {
    title: "English",
    href: "/docs/primitives/scroll-area",
    value: "e",
  },
];

export function Header({
  toggler,
}: {
  toggler: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Autograders</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[150px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  onClick={() => toggler(component.value)}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-100 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
