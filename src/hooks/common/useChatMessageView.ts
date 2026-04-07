"use client";

import { usePathname } from "next/navigation";
import { ROUTE } from "@/constants/route";
import { useGuestChatMessageView } from "@/hooks/common/useGuestChatMessageView";
import { useManageChatMessageView } from "@/hooks/common/useManageChatMessageView";

export function useChatMessageView() {
  const pathname = usePathname();
  const guestView = useGuestChatMessageView();
  const manageView = useManageChatMessageView();

  const isManageRoute = pathname.startsWith(ROUTE.MANAGE.ROOT);

  const activeView = isManageRoute ? manageView : guestView;

  return {
    isOwnMessage: activeView.isOwnMessage,
    getSenderLabel: activeView.getSenderLabel,
  };
}
