'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, MessageCircle, ChevronDown } from 'lucide-react'

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
      content: `Xin chào${userName ? ' ' + userName : ''}! Tôi là trợ lý cửa hàng. Bạn cần hỗ trợ gì?`,
    },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSuggestionClick = (suggestion: string) => {
    setMessages((prev) => [...prev, { type: 'user', content: suggestion }])
    const responses: Record<string, string> = {
      'Các hạng mục món ăn?':
        'Chúng tôi có các hạng mục: Cơm, Mì & Bún, Thịt, Hải sản, Chay, Đồ uống, Tráng miệng và Bánh. Bạn muốn xem hạng mục nào?',
      'Cách đặt hàng?':
        'Rất đơn giản! 1. Chọn món từ Menu → 2. Thêm vào giỏ hàng → 3. Vào Giỏ hàng kiểm tra → 4. Bấm Đặt món. Xong!',
      'Thời gian giao hàng?':
        'Đơn hàng sẽ được phục vụ trong vòng 15–30 phút. Bạn có thể gọi nhân viên nếu cần hỗ trợ thêm.',
      'Có giao hàng không?':
        'Hiện tại chúng tôi phục vụ tại bàn. Bạn có thể gọi nhân viên từ mục Giỏ hàng để được hỗ trợ.',
    }
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: responses[suggestion] || 'Cảm ơn bạn đã hỏi! Bạn có câu hỏi nào khác không?',
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
          content: 'Cảm ơn bạn! Nếu cần hỗ trợ thêm, vui lòng gọi nhân viên từ giỏ hàng.',
        },
      ])
    }, 300)
  }

  return (
    <>
      {/* FAB Button — bottom-[80px] để trên nav bar */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-[80px] right-4 z-40 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(245,158,11,0.4)]"
        title="Trợ lý cửa hàng"
      >
        {isOpen
          ? <ChevronDown className="w-5 h-5 text-black" strokeWidth={2.5} />
          : <MessageCircle className="w-5 h-5 text-black" strokeWidth={2} />
        }
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-[136px] right-4 z-40 w-[calc(100vw-2rem)] max-w-[320px] rounded-[24px] bg-[#161412] border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden"
          style={{ height: '420px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white leading-none">Trợ lý cửa hàng</p>
                <p className="text-[10px] text-green-400/80 mt-0.5">● Đang hoạt động</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-xl bg-white/[0.06] flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white/50" strokeWidth={2} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed ${
                  msg.type === 'assistant'
                    ? 'bg-white/[0.07] text-white/80 rounded-tl-sm'
                    : 'bg-amber-500 text-black font-medium rounded-tr-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-col gap-1.5">
              {chatSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.06] text-white/60 text-[11px] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {messages.length > 1 && (
            <div className="px-3 pb-3 pt-2 border-t border-white/[0.06] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/25 outline-none focus:border-amber-500/30 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 flex items-center justify-center transition-colors shrink-0 self-end"
              >
                <Send className="w-3.5 h-3.5 text-black" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}