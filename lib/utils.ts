import { Role } from "@prisma/client";
import { navLinks } from "./constants";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export async function hashPassword(password: string) {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPassword = password;
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

export function getNavLinks(role: Role = "USER") {
  return navLinks.filter((link) => link.allowedUser.includes(role));
}

// Pagination
const { floor, min, max } = Math;
const range = (lo: number, hi: number) =>
  Array.from({ length: hi - lo }, (_, i) => i + lo);

export const pagination =
  (count: number, ellipsis = "…") =>
  (page: number, total: number) => {
    const start = max(1, min(page - floor((count - 3) / 2), total - count + 2));
    const end = min(total, max(page + floor((count - 2) / 2), count - 1));
    return [
      ...(start > 2 ? [1, ellipsis] : start > 1 ? [1] : []),
      ...range(start, end + 1),
      ...(end < total - 1 ? [ellipsis, total] : end < total ? [total] : []),
    ];
  };

export const createQueryString = (
  searchParams: ReadonlyURLSearchParams,
  paramsObject: { [key: string]: string }
) => {
  const params = new URLSearchParams(searchParams.toString());

  Object.keys(paramsObject).forEach((key) => {
    params.set(key, paramsObject[key]);
  });

  return params.toString();
};

export function removeTags(htmlString: string) {
  return htmlString.replace(/(<([^>]+)>)/gi, "");
}
