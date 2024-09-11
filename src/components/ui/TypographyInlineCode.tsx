import clsx from "clsx";

export function TypographyInlineCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <code
      className={clsx(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
    >
      {children}
    </code>
  );
}
