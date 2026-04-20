"use client";

import { useCategoryQuery } from "@/features/menu/hooks/useCategory";
import MenusPage from "./Menupage";
import useCategoryStore from "@/features/menu/store/useCategoryStore";
import { useEffect } from "react";
import { Suspense } from "react";

export default function Page() {
  const { data, isLoading } = useCategoryQuery();
  const { setCategories, setIsLoading } = useCategoryStore();
  useEffect(() => {
    setIsLoading(isLoading);
    if (data) {
      setCategories(data.payload.data);
    }
  }, [data, isLoading, setCategories, setIsLoading]);
  return (
    <Suspense fallback={null}>
      <MenusPage />
    </Suspense>
  );
}
