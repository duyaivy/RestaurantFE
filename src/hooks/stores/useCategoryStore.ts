import { CategoryType } from "@/schemaValidations/category.schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CategoryState {
  categories: CategoryType[];
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setCategories: (categories: CategoryType[]) => void;
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  setIsLoading: () => {},
  setCategories: () => {},
};

const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      ...initialState,
      setCategories: (categories: CategoryType[]) => set({ categories }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: "category",
    },
  ),
);

export default useCategoryStore;
