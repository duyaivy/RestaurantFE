"use client";

import { SHOW_DEFAULT } from "@/features/menu/constants/category";
import { DishListConfig } from "@/features/dishes/types/dish-list-config.types";
import { useDishQueryConfig } from "@/features/dishes/hooks/use-dish-query-config";
import useCategoryStore from "@/features/menu/store/use-category-store";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { CategoryGridSkeleton } from "./category-skeleton";
import { useLocale, useTranslations } from 'next-intl';
import { resolveLocaleText } from "@/shared/lib/resolve-locale-text";

interface Props {
  onChangeQueryParam: <K extends keyof DishListConfig>(
    key: K,
    value: DishListConfig[K],
  ) => void;
}

const Categories = ({ onChangeQueryParam }: Props) => {
  const locale = useLocale();
  const t = useTranslations("menu");
  const { category_id } = useDishQueryConfig();
  const { categories, isLoading } = useCategoryStore();

  const activeCategory = Number(category_id);

  const handleActiveCategory = (id: number) => {
    onChangeQueryParam("category_id", id);
  };

  useEffect(() => {
    if (!categories?.length) return;

    const hasActiveCategory = category_id
      ? categories.some((category) => category.id === Number(category_id))
      : false;

    if (!hasActiveCategory) {
      onChangeQueryParam("category_id", categories[0].id);
    }
  }, [categories, category_id, onChangeQueryParam]);

  return (
    <div className="pt-4 pb-2 px-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-base font-semibold tracking-wide">
          {t("categories")}
        </h2>
      </div>

      <div className="flex  gap-x-1 gap-y-3  overflow-x-auto">
        {isLoading ? (
          <div className="w-full">
            <CategoryGridSkeleton count={5} />
          </div>
        ) : (
          categories?.map((cat) => {
            const isActive = activeCategory === cat.id;
            const categoryName = resolveLocaleText(cat.name, locale as "vi" | "en");
            return (
              <button
                key={cat.id}
                onClick={() => handleActiveCategory(cat.id)}
                className="shrink-0 basis-1/5 flex flex-col items-center gap-2 active:scale-95 transition-transform duration-150"
              >
                <div
                  className={`relative w-full aspect-square rounded-full overflow-hidden border-2 transition-all duration-200 ${isActive
                    ? "border-amber-400 shadow-[0_3px_14px_rgba(201,160,48,0.4)]"
                    : "border-transparent"
                    }`}
                >
                  <NextImage
                    src={cat.image}
                    alt={categoryName}
                    sizes="20vw"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span
                  className={`text-[10px] font-medium text-center leading-tight transition-colors duration-200 ${isActive ? "text-amber-400" : "text-neutral-500"
                    }`}
                >
                  {categoryName}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Categories;
