import { cn } from "../../utils/shadcn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded bg-[#3A3D3D]", className)} {...props} />;
}

export { Skeleton };
