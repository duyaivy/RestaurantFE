"use client";

import { useCategoryQuery } from "@/features/menu/hooks/use-category";
import MenusPage from "@/features/menu/components/MenuPage";
import useCategoryStore from "@/features/menu/store/use-category-store";
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
