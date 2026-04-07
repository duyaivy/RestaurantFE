'use client'
import React, { KeyboardEvent, useRef, useState } from 'react'
export interface ChatInputProps {
    onSend: (message: string) => void
    disabled?: boolean
    placeholder?: string
}
export function ChatInput({
    onSend,
    disabled = false,
    placeholder = 'Type a message…',
}: ChatInputProps) {
    const [value, setValue] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const handleSend = () => {
        const trimmed = value.trim()
        if (!trimmed || disabled) return
        onSend(trimmed)
        setValue('')
        // Reset textarea height after clearing
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }
    // Send on Enter (without Shift), allow Shift+Enter for newlines
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }
    // Auto-grow the textarea up to ~5 lines
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value)
        const el = e.target
        el.style.height = 'auto'
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    }
    const canSend = value.trim().length > 0 && !disabled
    return (
        <div style={styles.wrapper}>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? 'Not connected…' : placeholder}
                disabled={disabled}
                rows={1}
                aria-label="Chat message input"
                style={{
                    ...styles.textarea,
                    cursor: disabled ? 'not-allowed' : 'text',
                    opacity: disabled ? 0.6 : 1,
                }}
            />
            <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                aria-label="Send message"
                style={{
                    ...styles.button,
                    opacity: canSend ? 1 : 0.4,
                    cursor: canSend ? 'pointer' : 'not-allowed',
                }}
            >
                {/* Paper-plane icon (inline SVG — no extra dependency) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="18"
                    height="18"
                >
                    <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
                </svg>
            </button>
        </div>
    )
}
// ─── Styles ──────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        padding: '12px 16px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
    },
    textarea: {
        flex: 1,
        resize: 'none',
        border: '1px solid #d1d5db',
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '14px',
        lineHeight: 1.5,
        fontFamily: 'inherit',
        outline: 'none',
        backgroundColor: '#f9fafb',
        transition: 'border-color 0.15s',
        overflowY: 'hidden',
    },
    button: {
        flexShrink: 0,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#6366f1',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.15s, opacity 0.15s',
    },
}