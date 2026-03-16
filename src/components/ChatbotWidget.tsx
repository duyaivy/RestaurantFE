'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface ChatbotWidgetProps {
  question: string
  onClose?: () => void
}

const answerMap: Record<string, string> = {
  'Các hạng mục món ăn?':
    'Chúng tôi cung cấp: Nhang Nu, Hương/Nhang, Tinh dầu, và các sản phẩm khác. Mỗi danh mục có các sản phẩm chất lượng cao được chọn lọc.',
  'Cách đặt hàng?':
    '1️⃣ Duyệt danh sách sản phẩm\n2️⃣ Chọn sản phẩm yêu thích\n3️⃣ Thêm vào giỏ hàng\n4️⃣ Xem lại đơn hàng\n5️⃣ Chọn phương thức thanh toán\n6️⃣ Hoàn tất',
  'Thời gian giao hàng?':
    'Đơn hàng sẽ được giao trong vòng 30-45 phút kể từ khi xác nhận thanh toán. Bạn có thể gọi nhân viên để cập nhật trạng thái.',
  'Có giao hàng không?':
    'Có, chúng tôi cung cấp dịch vụ giao hàng tận nơi. Bạn có thể gọi nhân viên từ giỏ hàng để yêu cầu giao hàng hoặc hỗ trợ khác.',
}

export function ChatbotWidget({ question, onClose }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const answer = answerMap[question] || 'Cảm ơn bạn đã hỏi! Vui lòng liên hệ với nhân viên để được hỗ trợ thêm.'

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-sm bg-card border border-border rounded-2xl p-6">
          <DialogTitle className="sr-only">Chatbot trả lời câu hỏi</DialogTitle>
          <div className="space-y-4">
            {/* Question */}
            <div className="bg-secondary rounded-lg p-3">
              <h3 className="text-sm font-semibold text-foreground mb-1">Câu hỏi</h3>
              <p className="text-sm text-foreground">{question}</p>
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Trả lời</h4>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors text-sm"
            >
              Đóng
            </button>
          </div>
        </DialogContent>
    </Dialog>
  )
}
