import { chatbotQuestions } from '@/constants/category';
import useChatbotStore from '@/hooks/stores/useChatbotStore';
import { MessageCircle } from 'lucide-react';
import React from 'react'

const ChatbotSection = () => {
    const { setSelectedChatbot } = useChatbotStore()

    return (
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

            {/* Header — static, no toggle */}
            <div className="flex items-center gap-3 px-5 py-4 rounded-t-2xl border border-b-0 border-amber-600/40 bg-amber-950/20">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-500/20 border border-amber-600/30">
                    <MessageCircle size={14} className="text-amber-500" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                    <p className="text-stone-200 text-sm font-light tracking-wide">Cần hỗ trợ?</p>
                    <p className="text-neutral-600 text-[11px] tracking-wider mt-0.5">Hỏi AI trợ lý</p>
                </div>
            </div>

            {/* Questions list */}
            <div className="rounded-b-2xl border border-t-0 border-[#2e2a22] bg-[#161410] overflow-hidden divide-y divide-[#2e2a22]/60">
                {chatbotQuestions.map((question, i) => (
                    <button
                        key={question}
                        onClick={() => setSelectedChatbot(question)}
                        className="group w-full text-left px-4 py-3 bg-white/2 hover:bg-yellow-900/10 hover:pl-5 transition-all duration-300 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-amber-700/40 text-[10px] font-mono">{String(i + 1).padStart(2, "0")}</span>
                            <span className="text-xs text-neutral-400 tracking-wide group-hover:text-amber-300 transition-colors duration-200">{question}</span>
                        </div>
                        <span className="text-amber-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-sm">→</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ChatbotSection