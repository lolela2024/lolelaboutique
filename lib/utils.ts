import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ț/g, 't')             // Înlocuiește toate aparițiile lui "ț" cu "t"
    .replace(/ă/g, 'a')
    .replace(/ș/g, 's')             // Înlocuiește toate aparițiile lui "ț" cu "t"
    .replace(/\s+/g, '-')           // Înlocuiește spațiile cu "-"
    .replace(/\-\-+/g, '-')         // Înlocuiește multiple "-" cu unul singur
    .replace(/^-+/, '')             // Elimină "-" de la început
    .replace(/-+$/, '');            // Elimină "-" de la sfârșit
}

