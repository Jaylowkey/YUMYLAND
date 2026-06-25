"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  variant?: "rectangle" | "circle" | "text";
  className?: string;
}

export default function Skeleton({ variant = "rectangle", className }: SkeletonProps) {
  const variants = {
    rectangle: "h-24 w-full rounded-lg",
    circle: "h-10 w-10 rounded-full",
    text: "h-4 w-full rounded",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200",
        variants[variant],
        className
      )}
    />
  );
}
