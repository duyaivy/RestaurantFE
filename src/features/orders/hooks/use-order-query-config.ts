"use client";
import { useSearchParams } from "next/navigation";

export const useOrderQueryConfig = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  return { page, limit };
};
