import { SHOW_DEFAULT } from "@/constants/category";
import { DishListConfig } from "@/constants/interface";
import { useDishQueryConfig } from "@/hooks/common/useDishQueryConfig";
import useCategoryStore from "@/hooks/stores/useCategoryStore";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { CategoryGridSkeleton } from "./category-skeleton";

interface Props {
  onChangeQueryParam: <K extends keyof DishListConfig>(
    key: K,
    value: DishListConfig[K],
  ) => void;
}

const Categories = ({ onChangeQueryParam }: Props) => {
  const [catExpanded, setCatExpanded] = useState(false);
  const { category_id } = useDishQueryConfig();
  const { categories, isLoading } = useCategoryStore();
  const visibleCategories = catExpanded
    ? categories
    : categories?.slice(0, SHOW_DEFAULT);
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
          Danh mục
        </h2>
        <button
          onClick={() => setCatExpanded((v) => !v)}
          className="text-amber-500 text-xs tracking-wide hover:text-amber-400 transition-colors"
        >
          {catExpanded ? "Thu gọn" : "Xem tất cả"}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-x-1 gap-y-3">
        {isLoading ? (
          <div className="col-span-5">
            <CategoryGridSkeleton count={5} />
          </div>
        ) : (
          visibleCategories?.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleActiveCategory(cat.id)}
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform duration-150"
              >
                <div
                  className={`relative w-full aspect-square rounded-full overflow-hidden border-2 transition-all duration-200 ${
                    isActive
                      ? "border-amber-400 shadow-[0_3px_14px_rgba(201,160,48,0.4)]"
                      : "border-transparent"
                  }`}
                >
                  <NextImage
                    src={cat.image}
                    alt={cat.name.vi}
                    sizes="20vw"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span
                  className={`text-[10px] font-medium text-center leading-tight transition-colors duration-200 ${
                    isActive ? "text-amber-400" : "text-neutral-500"
                  }`}
                >
                  {cat.name.vi}
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
