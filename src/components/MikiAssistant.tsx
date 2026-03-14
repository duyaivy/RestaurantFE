'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const chatSuggestions = [
  'Các hạng mục món ăn?',
  'Cách đặt hàng?',
  'Thời gian giao hàng?',
  'Có giao hàng không?',
]

interface MikiAssistantProps {
  userName?: string
}

export function MikiAssistant({ userName }: MikiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<
    { type: 'assistant' | 'user'; content: string }[]
  >([
    {
      type: 'assistant',
      content: `Xin chào${userName ? ' ' + userName : ''}! 👋 Tôi là trợ lý của cửa hàng. Tôi có thể giúp bạn với thông tin về đặt hàng. Bạn cần gì?`,
    },
  ])
  const [input, setInput] = useState('')

  const handleSuggestionClick = (suggestion: string) => {
    setMessages((prev) => [...prev, { type: 'user', content: suggestion }])
    const responses: Record<string, string> = {
      'Các hạng mục món ăn?':
        'Chúng tôi có các hạng mục: Nhang Nu, Hương/Nhang, Tinh dầu, và Khác. Bạn có thể xem chi tiết từng loại trong danh sách.',
      'Cách đặt hàng?':
        'Rất đơn giản! 1. Chọn món ăn → 2. Thêm vào giỏ → 3. Xem giỏ hàng → 4. Thanh toán. Chúng tôi hỗ trợ thanh toán qua thẻ hoặc QR code.',
      'Thời gian giao hàng?':
        'Đơn hàng sẽ được giao trong vòng 30-45 phút kể từ khi xác nhận. Bạn có thể gọi nhân viên nếu cần hỗ trợ.',
      'Có giao hàng không?':
        'Có, chúng tôi cung cấp dịch vụ giao hàng. Bạn có thể gọi nhân viên để yêu cầu giao hoặc tận nơi.',
    }
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content:
            responses[suggestion] ||
            'Cảm ơn bạn đã hỏi! Bạn có câu hỏi khác không?',
        },
      ])
    }, 300)
  }

  const handleSendMessage = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { type: 'user', content: input }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content:
            'Cảm ơn bạn! Nếu cần hỗ trợ thêm, vui lòng gọi nhân viên từ giỏ hàng.',
        },
      ])
    }, 300)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg flex items-center justify-center text-xl transition-all z-40"
        title="Trợ giúp"
      >
        💬
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-sm h-96 flex flex-col bg-card border border-border rounded-2xl p-0">
          {/* Chat Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl">
            <h3 className="font-semibold text-sm">Trợ lý cửa hàng</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.type === 'assistant'
                      ? 'bg-secondary text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions or Input */}
          {messages.length <= 1 ? (
            <div className="p-4 space-y-2 border-t border-border">
              {chatSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 flex gap-2 border-t border-border">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSendMessage()
                }}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-2 py-1.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-xs"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="bg-primary hover:bg-primary/90 px-3 py-1.5 text-xs"
              >
                Gửi
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
