"use client";

import { useState, useMemo, useRef } from "react";
import { DishCard } from "@/components/DishCard";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { useDishListQuery } from "@/hooks/queries/useDish";
import { Search, MessageCircle, X, ChevronDown } from "lucide-react";

const chatbotQuestions = [
  "Các hạng mục món ăn?",
  "Cách đặt hàng?",
  "Thời gian giao hàng?",
  "Có giao hàng không?",
];

export default function MenusPage() {
  const dishQuery = useDishListQuery({
    page: "1",
    limit: "10",
  });
  const dishes = dishQuery.data?.payload.data.results || []


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredDishes = useMemo(() => {
    if (!searchQuery) return dishes;
    return dishes.filter((d) =>
      d.name?.vi?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dishes, searchQuery]);

  return (
    <div className="min-h-screen pb-32 bg-neutral-950">

      {/* HEADER */}
      <div className="px-6 pt-8 pb-4 text-center">
        <p className="text-yellow-600 tracking-widest text-lg opacity-70">✦ ✦ ✦</p>
        <h1 className="text-3xl font-light tracking-[0.18em] text-stone-100 mt-2">
          THỰC ĐƠN
        </h1>
        <p className="text-xs tracking-[0.28em] text-yellow-600 mt-1 uppercase font-light">
          Fine Dining Collection
        </p>
        <div className="mt-5 mx-8 h-px bg-gradient-to-r from-transparent via-yellow-700/40 to-transparent" />
      </div>

      {/* SEARCH BAR */}
      <div className="sticky top-16 z-20 px-5 py-3 bg-neutral-950/90 backdrop-blur-md border-b border-yellow-900/20">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-white/3 border transition-colors duration-300 ${searchFocused ? "border-yellow-600/70" : "border-yellow-900/30"
            }`}
        >
          <Search size={14} className="text-yellow-600 shrink-0" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent border-none outline-none w-full text-stone-100 text-sm tracking-wide placeholder:text-yellow-700/50 placeholder:text-xs placeholder:tracking-widest placeholder:uppercase"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X size={13} className="text-yellow-700/60" />
            </button>
          )}
        </div>
      </div>

      {/* SECTION LABEL */}
      <div className="px-6 pt-6 pb-2 flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-700/30 to-transparent" />
        <span className="text-[9px] tracking-[0.3em] text-yellow-600 uppercase font-medium">
          {filteredDishes.length} món
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-700/30 to-transparent" />
      </div>

      {/* DISH LIST */}
      <div className="px-4 space-y-3 pt-1">
        {filteredDishes.length > 0 ? (
          filteredDishes.map((dish) => (
            <DishCard key={dish.id} {...dish} name={dish.name?.vi} description={dish.description?.vi} />
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-yellow-600 opacity-70 tracking-widest mb-3">✦</p>
            <p className="text-xl text-yellow-700/50 italic font-light">
              Không tìm thấy món ăn
            </p>
          </div>
        )}
      </div>

      {/* CHATBOT SECTION */}
      <div className="px-5 mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-700/40 to-transparent mb-6" />

        <button
          onClick={() => setChatbotOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-yellow-900/30 bg-yellow-900/5 hover:bg-yellow-900/10 transition-colors duration-200 mb-3"
        >
          <div className="flex items-center gap-3">
            <MessageCircle size={14} className="text-yellow-600" strokeWidth={1.5} />
            <span className="text-base text-stone-100 font-light tracking-wide">
              Cần hỗ trợ?
            </span>
          </div>
          <ChevronDown
            size={14}
            className={`text-yellow-600 transition-transform duration-300 ${chatbotOpen ? "rotate-180" : "rotate-0"
              }`}
            strokeWidth={1.5}
          />
        </button>

        {chatbotOpen && (
          <div className="space-y-2">
            {chatbotQuestions.map((question) => (
              <button
                key={question}
                onClick={() => {
                  setSelectedChatbot(question);
                  setChatbotOpen(false);
                }}
                className="group w-full text-left px-4 py-3 rounded-lg border border-yellow-900/20 bg-white/2 hover:bg-yellow-900/10 hover:border-yellow-600/50 hover:pl-5 transition-all duration-300 flex items-center justify-between"
              >
                <span className="text-xs text-yellow-300/80 tracking-wide font-light">
                  {question}
                </span>
                <span className="text-yellow-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  →
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="text-center mt-10 mb-6">
        <p className="text-yellow-600 opacity-50 tracking-widest text-xs">✦</p>
      </div>

      {/* CHATBOT WIDGET */}
      {selectedChatbot && (
        <ChatbotWidget
          question={selectedChatbot}
          onClose={() => setSelectedChatbot(null)}
        />
      )}
    </div>
  );
}