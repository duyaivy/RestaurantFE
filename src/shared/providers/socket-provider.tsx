"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import { destroySocketClient, getSocketClient } from "@/shared/sockets/socket-client";
import { SOCKET_EVENTS } from "@/shared/sockets/socket-events";
import { getAccessTokenFromLocalStorage } from "@/shared/lib/utils";
import { subscribeAuthTokenChanged } from "@/shared/auth/token-events";

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  lastError: string | null;
}
const SocketContext = createContext<SocketContextType | undefined>(undefined);
export interface SocketProviderProps {
  children: React.ReactNode;
  /**
   * Called when the backend signals token expiry (401 connect_error).
   * Consumers should trigger logout via the existing auth context — never
   * hard-code router.push here so the provider stays auth-agnostic.
   */
  onTokenExpired?: () => void;
}
export function SocketProvider({
  children,
  onTokenExpired,
}: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const onTokenExpiredRef = useRef(onTokenExpired);
  useEffect(() => {
    onTokenExpiredRef.current = onTokenExpired;
  }, [onTokenExpired]);
  // Track current token to detect changes
  const [currentToken, setCurrentToken] = useState<string | null>(() =>
    getAccessTokenFromLocalStorage()
  );

  // Effect to monitor token changes in this tab and across tabs.
  useEffect(() => {
    setCurrentToken(getAccessTokenFromLocalStorage());

    return subscribeAuthTokenChanged(({ accessToken }) => {
      setCurrentToken(accessToken);
    });
  }, []);

  // Effect to manage socket connection based on token
  useEffect(() => {
    // No token = no connection
    if (!currentToken) {
      destroySocketClient();
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
      return;
    }

    // Token exists = establish connection
    const newSocket = getSocketClient(currentToken);

    const handleConnect = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setLastError(null);
    };

    const handleDisconnect = (reason: string) => {
      setIsConnected(false);
      setIsConnecting(false);
      if (reason === "io server disconnect") {
        setLastError("Server closed the connection");
      }
    };

    const handleConnectError = (err: Error) => {
      setIsConnected(false);
      setIsConnecting(false);
      const msg = err.message ?? "";
      setLastError(msg);
      if (
        msg.toLowerCase().includes("401") ||
        msg.toLowerCase().includes("unauthorized")
      ) {
        onTokenExpiredRef.current?.();
        return;
      }
    };

    const handleReconnect = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setLastError(null);
    };

    newSocket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    newSocket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    newSocket.on(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
    newSocket.on(SOCKET_EVENTS.RECONNECT, handleReconnect);

    setSocket(newSocket);
    if (newSocket.connected) {
      handleConnect();
    } else {
      setIsConnecting(true);
      newSocket.connect();
    }

    return () => {
      newSocket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      newSocket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      newSocket.off(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
      newSocket.off(SOCKET_EVENTS.RECONNECT, handleReconnect);
      destroySocketClient();
    };
  }, [currentToken])
  return (
    <SocketContext.Provider
      value={{ socket, isConnected, isConnecting, lastError }}
    >
      {children}
    </SocketContext.Provider>
  );
}
export function useSocketContext(): SocketContextType {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocketContext must be used inside <SocketProvider>");
  }
  return ctx;
}
