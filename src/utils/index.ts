import clsx, { type ClassValue } from "clsx";

export * from "./lead-utils";
export * from "./property-utils";
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
