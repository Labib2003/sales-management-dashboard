import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Response } from "~/server/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const catchAcync = async (
  fn: () => Promise<Response>,
): Promise<Response> => {
  try {
    return await fn();
  } catch (error) {
    const castedError = error as Error;
    return {
      success: false,
      message: castedError.message ?? "An error occurred",
    };
  }
};
