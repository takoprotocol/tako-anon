import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSecureRandomString() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  const maxByte = 251;

  while (result.length < 8) {
    const buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);

    for (const byte of buffer) {
      // Skip bytes greater than maxByte to avoid bias
      if (byte > maxByte) continue;
      result += chars[byte % 36];
      if (result.length === 8) break;
    }
  }
  return result;
}
