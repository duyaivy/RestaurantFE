"use client";

import { useCallback, useRef, useState } from "react";
import { ChatbotWidget } from "@/features/messages/components/ChatbotWidget";
import { useDishListQuery } from "@/features/dishes/hooks/use-dish";
import { Search, X } from "lucide-react";
import useChatbotStore from "@/features/messages/store/use-chatbot-store";
import ChatbotSection from "@/features/menu/components/chatbot";
import Footer from "@/features/menu/components/footer";
import LabelFood from "@/features/menu/components/label-food";
import PromoBanner from "@/features/menu/components/promo-banner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "@/features/menu/components/header";
import Categories from "@/features/menu/components/category-list/categories";
import DishListGuest from "@/features/menu/components/dish-list/dish-list";
import { useDishQueryConfig } from "@/features/dishes/hooks/use-dish-query-config";
import { DishListConfig } from "@/features/dishes/types/dish-list-config.types";

export default function MenusPage() {
  const { category_id, page, limit, search } = useDishQueryConfig();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchFocused, setSearchFocused] = useState(false);

  const { data: dishData, isLoading } = useDishListQuery({
    page: page,
    limit: limit,
    category_id: category_id,
    search: search,
  });

  const dishes = dishData?.payload.data.results || [];

  const { selectedChatbot, setSelectedChatbot } = useChatbotStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const createSearchUrl = useCallback(
    <K extends keyof DishListConfig>(key: K, value: DishListConfig[K]) => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());

      if (value === undefined || value === null || value === "") {
        nextSearchParams.delete(key);
      } else {
        nextSearchParams.set(key, String(value));
      }

      router.push(`${pathname}?${nextSearchParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="min-h-screen bg-[#0f0e0c] pb-32 pt-16 max-w-md mx-auto">
      <Header />
      <div className="z-20 px-5 py-3 bg-neutral-950/90 backdrop-blur-md border-b border-yellow-900/20">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-white/3 border transition-colors duration-300 ${
            searchFocused ? "border-yellow-600/70" : "border-yellow-900/30"
          }`}
        >
          <Search
            size={14}
            className="text-yellow-600 shrink-0"
            strokeWidth={1.5}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm món ăn..."
            key={search || ""}
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createSearchUrl("search", e.currentTarget.value.trim());
              }
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent outline-none w-full text-white text-sm tracking-wide placeholder:text-neutral-600 placeholder:text-xs placeholder:tracking-widest placeholder:uppercase"
          />
          {search && (
            <button
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
                createSearchUrl("search", "");
              }}
              className="w-5 h-5 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-neutral-600 transition-colors shrink-0"
            >
              <X size={10} className="text-neutral-300" />
            </button>
          )}
        </div>
      </div>
      <PromoBanner />
      <Categories onChangeQueryParam={createSearchUrl} />
      <LabelFood length={dishes.length} />
      <DishListGuest dishes={dishes} isLoading={isLoading} />
      <ChatbotSection />
      <Footer />
      {selectedChatbot && (
        <ChatbotWidget
          question={selectedChatbot}
          onClose={() => setSelectedChatbot(null)}
        />
      )}
    </div>
  );
}
