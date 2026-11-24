import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Helper used by shadcn/ui: joins class names and resolves Tailwind conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
