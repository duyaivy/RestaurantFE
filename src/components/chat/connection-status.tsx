'use client'
import React from 'react'
import { useSocket } from '@/hooks/common/useSocket'
type BadgeVariant = 'connected' | 'connecting' | 'disconnected'
const LABELS: Record<BadgeVariant, string> = {
    connected: 'Connected',
    connecting: 'Connecting…',
    disconnected: 'Disconnected',
}
const STYLES: Record<BadgeVariant, React.CSSProperties> = {
    connected: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        border: '1px solid #6ee7b7',
    },
    connecting: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fcd34d',
    },
    disconnected: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fca5a5',
    },
}
const DOT_COLORS: Record<BadgeVariant, string> = {
    connected: '#10b981',
    connecting: '#f59e0b',
    disconnected: '#ef4444',
}
export interface ConnectionStatusProps {
    /** Override the variant from the hook (useful for Storybook / tests) */
    variant?: BadgeVariant
}
export function ConnectionStatus({ variant: variantProp }: ConnectionStatusProps) {
    const { isConnected, isConnecting } = useSocket()
    const variant: BadgeVariant = variantProp
        ?? (isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected')
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: 1.5,
                userSelect: 'none',
                ...STYLES[variant],
            }}
        >
            {/* Animated dot */}
            <span
                style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: DOT_COLORS[variant],
                    display: 'inline-block',
                    animation: variant === 'connecting' ? 'pulse 1.2s infinite' : 'none',
                }}
            />
            {LABELS[variant]}
            {/* Inline keyframes for the pulse animation */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
        </span>
    )
}