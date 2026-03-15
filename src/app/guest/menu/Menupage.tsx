"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { DishCard } from "@/components/DishCard";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { useDishListQuery } from "@/hooks/queries/useDish";
import { Search, MessageCircle, X, ChevronDown } from "lucide-react";
import NextImage from "next/image";

const chatbotQuestions = [
  "Các hạng mục món ăn?",
  "Cách đặt hàng?",
  "Thời gian giao hàng?",
  "Có giao hàng không?",
];

const CATEGORIES = [
  { id: "all", label: "Tất cả", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=120&fit=crop" },
  { id: "rice", label: "Cơm", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=120&h=120&fit=crop" },
  { id: "noodle", label: "Mì & Bún", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=120&h=120&fit=crop" },
  { id: "meat", label: "Thịt", image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=120&h=120&fit=crop" },
  { id: "seafood", label: "Hải sản", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=120&h=120&fit=crop" },
  { id: "vegetarian", label: "Chay", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop" },
  { id: "drink", label: "Đồ uống", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=120&h=120&fit=crop" },
  { id: "dessert", label: "Tráng miệng", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=120&h=120&fit=crop" },
  { id: "bread", label: "Bánh", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=120&fit=crop" },
  { id: "special", label: "Đặc biệt", image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=120&h=120&fit=crop" },
];

const BANNERS = [
  {
    image: "https://i.pinimg.com/1200x/17/0f/4f/170f4f2095a86bd8ed81e0f35c6d2975.jpg",
    sub: "Ưu đãi hôm nay",
    title: "Giảm đến\n50%",
    titleColor: "text-amber-400",
    btn: "Nhận ngay",
  },
  {
    image: "https://i.pinimg.com/1200x/de/0e/b2/de0eb20659172b722d5d992b6bc4c2dd.jpg",
    sub: "Combo đặc biệt",
    title: "Mua 2\ntặng 1",
    titleColor: "text-white",
    btn: "Xem combo",
  },
  {
    image: "https://i.pinimg.com/736x/29/0c/b6/290cb6b815e4bc3fb91e64633c45027e.jpg",
    sub: "Món mới tuần này",
    title: "Free ship\ntoàn quốc",
    titleColor: "text-orange-400",
    btn: "Đặt ngay",
  },
  {
    image: "https://i.pinimg.com/1200x/5c/7d/8c/5c7d8cee11e379df993df7e063a97df7.jpg",
    sub: "Thành viên VIP",
    title: "Tích điểm\nđổi quà",
    titleColor: "text-yellow-400",
    btn: "Tham gia",
  },
];

const SHOW_DEFAULT = 5;

export default function MenusPage() {
  const dishQuery = useDishListQuery({
    page: "1",
    limit: "10",
  });
  const dishes = dishQuery.data?.payload.data.results || []


  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [catExpanded, setCatExpanded] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const touchStartX = useRef(0);

  const visibleCategories = catExpanded ? CATEGORIES : CATEGORIES.slice(0, SHOW_DEFAULT);

  const filteredDishes = useMemo(() => {
    return dishes.filter((d) => {
      const matchSearch = !searchQuery || d.name?.vi?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === "all" || (d as any).category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [dishes, searchQuery, activeCategory]);

  const goTo = useCallback((idx: number) => {
    setBannerIndex((idx + BANNERS.length) % BANNERS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => goTo(bannerIndex + 1), 3500);
    return () => clearInterval(timer);
  }, [bannerIndex, goTo]);

  return (
    <div className="min-h-screen bg-[#0f0e0c] pb-32">

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-amber-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="h-px w-full bg-linear-to-r from-transparent via-amber-600/50 to-transparent" />
        <div className="relative px-6 pt-8 pb-7 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-linear-to-r from-transparent to-amber-600/70" />
            <span className="text-amber-500 text-[9px] font-semibold tracking-[0.5em] uppercase">Fine Dining</span>
            <div className="h-px w-8 bg-linear-to-r from-transparent to-amber-600/70" />
          </div>
          <h1 className="text-4xl font-thin tracking-[0.28em] text-white">THỰC ĐƠN</h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-px w-12 bg-neutral-800" />
            <div className="w-1 h-1 rounded-full bg-amber-600/60" />
            <div className="h-px w-4 bg-neutral-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
            <div className="h-px w-4 bg-neutral-800" />
            <div className="w-1 h-1 rounded-full bg-amber-600/60" />
            <div className="h-px w-12 bg-neutral-800" />
          </div>
        </div>
        <div className="h-px w-full bg-linear-to-r from-transparent via-amber-900/40 to-transparent" />
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
            className="bg-transparent outline-none w-full text-white text-sm tracking-wide placeholder:text-neutral-600 placeholder:text-xs placeholder:tracking-widest placeholder:uppercase"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="w-5 h-5 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-neutral-600 transition-colors shrink-0">
              <X size={10} className="text-neutral-300" />
            </button>
          )}
        </div>
      </div>

      {/* ── PROMO BANNER ── */}
      <div className="px-4 mt-1 mb-1">
        <div
          className="overflow-hidden rounded-2xl"
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (dx < -40) goTo(bannerIndex + 1);
            if (dx > 40) goTo(bannerIndex - 1);
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
          >
            {BANNERS.map((banner, i) => (
              <div key={i} className="relative w-full shrink-0 h-37">
                {/* Dùng <img> thường cho banner vì ảnh ngoài domain, tránh config next/image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image}
                  alt={banner.sub}
                  className="w-full h-full object-cover brightness-75"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-transparent flex flex-col justify-center px-5 gap-1">
                  <p className="text-white/70 text-[11px] tracking-wide">{banner.sub}</p>
                  <p className={`text-[22px] font-extrabold leading-tight whitespace-pre-line ${banner.titleColor}`}>
                    {banner.title}
                  </p>
                  <div className="mt-1 inline-flex items-center bg-white text-[#111] text-[11px] font-bold px-4 py-1.5 rounded-full w-fit">
                    {banner.btn} →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-1.25 mt-3">
          {BANNERS.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{ width: i === bannerIndex ? 14 : 5, height: 5, borderRadius: 999, background: i === bannerIndex ? '#f0c040' : '#3a3428', transition: 'all 0.3s', cursor: 'pointer', flexShrink: 0 }}
            />
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className="pt-4 pb-2 px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-base font-semibold tracking-wide">Danh mục</h2>
          <button
            onClick={() => setCatExpanded((v) => !v)}
            className="text-amber-500 text-xs tracking-wide hover:text-amber-400 transition-colors"
          >
            {catExpanded ? "Thu gọn" : "Xem tất cả"}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-x-1 gap-y-3">
          {visibleCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform duration-150"
              >
                <div className={`relative w-full aspect-square rounded-full overflow-hidden border-2 transition-all duration-200 ${isActive ? "border-amber-400 shadow-[0_3px_14px_rgba(201,160,48,0.4)]" : "border-transparent"
                  }`}>
                  <NextImage
                    src={cat.image}
                    alt={cat.label}
                    sizes="20vw"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className={`text-[10px] font-medium text-center leading-tight transition-colors duration-200 ${isActive ? "text-amber-400" : "text-neutral-500"
                  }`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SECTION LABEL ── */}
      <div className="px-5 pt-6 pb-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-linear-to-r from-amber-900/40 to-[#2c2820]" />
        <span className="text-[9px] tracking-[0.4em] text-amber-600/80 uppercase font-semibold px-1">
          {filteredDishes.length} món
        </span>
        <div className="h-px flex-1 bg-linear-to-l from-amber-900/40 to-[#2c2820]" />
      </div>

      {/* ── DISH LIST ── */}
      <div className="px-4 flex flex-col gap-4">
        {filteredDishes.length > 0 ? (
          filteredDishes.map((dish) => (
            <DishCard key={dish.id} {...dish} name={dish.name?.vi} description={dish.description?.vi} />
          ))
        ) : (
          <div className="text-center py-20 px-8">
            <div className="w-12 h-12 rounded-2xl bg-[#1c1a16] border border-[#2e2a22] flex items-center justify-center mx-auto mb-4">
              <Search size={18} className="text-neutral-600" strokeWidth={1.5} />
            </div>
            <p className="text-neutral-500 text-sm tracking-widest mb-3">Không tìm thấy món ăn</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="text-amber-500 text-xs tracking-widest uppercase border border-amber-700/30 px-4 py-2 rounded-xl hover:bg-amber-950/20 transition-colors"
            >
              Xoá bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* ── CHATBOT SECTION ── */}
      <div className="px-4 mt-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-linear-to-r from-[#2c2820] to-amber-900/30" />
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-amber-700/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600/70" />
            <div className="w-1 h-1 rounded-full bg-amber-700/50" />
          </div>
          <div className="h-px flex-1 bg-linear-to-l from-[#2c2820] to-amber-900/30" />
        </div>

        <button
          onClick={() => setChatbotOpen((v) => !v)}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 ${chatbotOpen ? "border-amber-600/40 bg-amber-950/20" : "border-[#2e2a22] bg-[#161410] hover:border-[#4a4030]"
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 ${chatbotOpen ? "bg-amber-500/20 border border-amber-600/30" : "bg-[#1c1a16] border border-[#2e2a22]"
              }`}>
              <MessageCircle size={14} className="text-amber-500" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <p className="text-stone-200 text-sm font-light tracking-wide">Cần hỗ trợ?</p>
              <p className="text-neutral-600 text-[11px] tracking-wider mt-0.5">Hỏi AI trợ lý</p>
            </div>
          </div>
          <ChevronDown
            size={14}
            className={`text-yellow-600 transition-transform duration-300 ${chatbotOpen ? "rotate-180" : "rotate-0"
              }`}
            strokeWidth={1.5}
          />
        </button>

        {chatbotOpen && (
          <div className="mt-2 rounded-2xl border border-[#2e2a22] bg-[#161410] overflow-hidden divide-y divide-[#2e2a22]/60">
            {chatbotQuestions.map((question, i) => (
              <button
                key={question}
                onClick={() => {
                  setSelectedChatbot(question);
                  setChatbotOpen(false);
                }}
                className="group w-full text-left px-4 py-3 rounded-lg border border-yellow-900/20 bg-white/2 hover:bg-yellow-900/10 hover:border-yellow-600/50 hover:pl-5 transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-amber-700/40 text-[10px] font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs text-neutral-400 tracking-wide group-hover:text-amber-300 transition-colors duration-200">{question}</span>
                </div>
                <span className="text-amber-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-sm">→</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="text-center mt-12 mb-4 px-8">
        <div className="h-px bg-linear-to-r from-transparent via-amber-900/30 to-transparent mb-5" />
        <p className="text-neutral-700 text-[9px] tracking-[0.4em] uppercase mb-1">Fine Dining Collection</p>
        <p className="text-amber-800/30 text-[10px]">✦</p>
      </div>

      {selectedChatbot && (
        <ChatbotWidget question={selectedChatbot} onClose={() => setSelectedChatbot(null)} />
      )}
    </div>
  );
}