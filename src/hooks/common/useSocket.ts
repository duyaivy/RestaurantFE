
import { useSocketContext } from '@/context/socket-provider'
import type { SocketContextType } from '@/context/socket-provider'
/**
 * Low-level hook that surfaces the raw socket and connection state.
 *
 * Rules:
 *   – Must be called inside <SocketProvider> (throws otherwise).
 *   – Do NOT use the socket directly in UI components; use it here or in a
 *     higher-level hook like useTableChat.
 */
export function useSocket(): SocketContextType {
    // useSocketContext already throws a clear error when called outside the provider
    return useSocketContext()
}
