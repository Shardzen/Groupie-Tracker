import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Cette fonction permet de combiner des classes CSS conditionnelles proprement
// Exemple : cn("bg-red-500", estActif && "bg-green-500")
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}