import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function generateRandom4DigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

export const cleanErrorOutput = (output: string) => {
  // Remove ANSI escape codes (e.g., colors and formatting)
  const cleanedOutput = output.replace(
    /\x1b\[[0-9;]*m|\[[0-9;]*m/g,
    ""
  );
  return cleanedOutput;
};