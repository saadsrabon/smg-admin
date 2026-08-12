import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const PUBLIC_SITE = import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173';
