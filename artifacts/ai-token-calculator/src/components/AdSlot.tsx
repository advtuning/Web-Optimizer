import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function AdSlot({ className, ...props }: AdSlotProps) {
  return (
    <div 
      className={cn(
        "w-full max-w-[728px] mx-auto h-[90px] bg-muted/30 border border-dashed border-border flex items-center justify-center rounded-lg text-muted-foreground text-sm font-medium",
        className
      )}
      {...props}
    >
      {/* AdSense slot */}
      Advertisement
    </div>
  );
}
