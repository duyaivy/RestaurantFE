import { StatusUI } from "./types";

export const CARD_STYLE: React.CSSProperties = {
  backgroundColor: "#171512",
  background: "#171512",
};

export const PAGE_STYLE: React.CSSProperties = {
  backgroundColor: "#0f0e0c",
  background: "#0f0e0c",
};

export const ORDER_STATUS_UI: Record<string, StatusUI> = {
  PENDING: {
    label: "Đang chờ",
    className: "bg-slate-500/15 text-slate-300 border border-slate-500/20",
    dotClassName: "bg-slate-300",
  },
  PREPARING: {
    label: "Đang chuẩn bị",
    className: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    dotClassName: "bg-amber-400",
  },
  SERVED: {
    label: "Đã phục vụ",
    className: "bg-green-500/15 text-green-400 border border-green-500/20",
    dotClassName: "bg-green-400",
  },
  COMPLETED: {
    label: "Hoàn tất",
    className: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    dotClassName: "bg-blue-400",
  },
  CANCELLED: {
    label: "Đã huỷ",
    className: "bg-red-500/15 text-red-400 border border-red-500/20",
    dotClassName: "bg-red-400",
  },
};

export const ORDER_ITEM_STATUS_LABEL: Record<string, string> = {
  ORDERED: "Đã gọi",
  COOKING: "Đang nấu",
  SERVED: "Đã phục vụ",
  CANCELLED: "Đã huỷ",
};
