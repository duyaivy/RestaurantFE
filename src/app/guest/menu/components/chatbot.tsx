import { chatbotQuestions } from '@/constants/category';
import useChatbotStore from '@/hooks/stores/useChatbotStore';
import { ChevronDown, MessageCircle } from 'lucide-react';
import React, { useState } from 'react'



const ChatbotSection = () => {
    const [chatbotOpen, setChatbotOpen] = useState(false);
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

    )
}

export default ChatbotSection