import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "MZN"): string {
  return `${amount.toLocaleString("pt-MZ")} ${currency}`;
}

export function formatDate(date: string | Date, locale: string = "pt"): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === "pt" ? "pt-MZ" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  return time;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getLoyaltyLevel(points: number): "bronze" | "silver" | "gold" | "diamond" {
  if (points >= 1000) return "diamond";
  if (points >= 500) return "gold";
  if (points >= 200) return "silver";
  return "bronze";
}

export function getLoyaltyColor(level: string): string {
  switch (level) {
    case "diamond":
      return "text-purple-600 bg-purple-100";
    case "gold":
      return "text-yellow-600 bg-yellow-100";
    case "silver":
      return "text-gray-600 bg-gray-100";
    case "bronze":
    default:
      return "text-orange-600 bg-orange-100";
  }
}
