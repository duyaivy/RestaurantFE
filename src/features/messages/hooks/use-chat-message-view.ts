"use client";

import { usePathname } from "next/navigation";
import { ROUTE } from "@/shared/constants/route";
import { useGuestChatMessageView } from "@/features/messages/hooks/use-guest-chat-message-view";
import { useManageChatMessageView } from "@/features/messages/hooks/use-manage-chat-message-view";

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
