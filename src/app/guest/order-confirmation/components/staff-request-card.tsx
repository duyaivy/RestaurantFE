import { CARD_STYLE } from "./constants";

type StaffRequestCardProps = {
  isSubmitted: boolean;
  staffRequest: string;
  isSubmitDisabled: boolean;
  onChangeStaffRequest: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function StaffRequestCard({
  isSubmitted,
  staffRequest,
  isSubmitDisabled,
  onChangeStaffRequest,
  onCancel,
  onSubmit,
}: StaffRequestCardProps) {
  return (
    <div
      className="order-card rounded-4xl border border-[#252118] p-4"
      style={CARD_STYLE}
    >
      {isSubmitted ? (
        <p className="text-sm text-green-400">Đã gửi yêu cầu cho nhân viên.</p>
      ) : (
        <>
          <p className="text-[13px] text-white/80 mb-3">Nội dung cần hỗ trợ</p>
          <textarea
            value={staffRequest}
            onChange={(event) => onChangeStaffRequest(event.target.value)}
            rows={2}
            placeholder="Ví dụ: Cho em xin thêm đũa..."
            className="order-input w-full border border-[#2e2820] rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-amber-500/40 resize-none"
            style={{ backgroundColor: "#0f0e0c" }}
          />
          <div className="mt-3 flex gap-2 justify-end">
            <button
              onClick={onCancel}
              className="h-9 px-4 rounded-xl border border-[#2e2820] text-xs text-white/70"
            >
              Huỷ
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitDisabled}
              className="h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-xs font-semibold"
            >
              Gửi yêu cầu
            </button>
          </div>
        </>
      )}
    </div>
  );
}
