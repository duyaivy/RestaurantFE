"use client";

import Image from "next/image";
import Link from "next/link";
import { ChatbotRecommendedItem } from "@/features/messages/types/chatbot.types";
import { ROUTE } from "@/shared/constants/route";
import { LocalizedText } from "@/shared/ui/localized-text";

interface ChatRecommendedItemsProps {
  items: ChatbotRecommendedItem[];
}

export function ChatRecommendedItems({ items }: ChatRecommendedItemsProps) {
  return (
    <div className="mt-2 grid gap-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`${ROUTE.GUEST.MENU}/${item.id}`}
          className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 p-2 hover:bg-white/10 transition-colors"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/10">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-white">
              <LocalizedText text={item.name as any} />
            </p>
            <p className="text-[11px] text-white/55">Xem món</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
