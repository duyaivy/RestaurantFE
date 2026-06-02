"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Role } from "@/shared/constants/type";
import { RoleType } from "@/shared/types/jwt.types";
import { decodeToken, getAccessTokenFromLocalStorage } from "@/shared/lib/utils";
import { subscribeAuthTokenChanged } from "@/shared/auth/token-events";

export interface UserContextType {
  guestName: string;
  setGuestName: (name: string) => void;
  isLoggedIn: boolean;
  role: RoleType | null;
  isGuest: boolean;
  refreshAuthState: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [guestName, setGuestName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("guestName") || "";
    }
    return "";
  });

  const handleSetGuestName = useCallback((name: string) => {
    setGuestName(name);
    if (typeof window !== "undefined") {
      localStorage.setItem("guestName", name);
    }
  }, []);

  const [role, setRole] = useState<RoleType | null>(null);

  const refreshAuthState = useCallback(() => {
    try {
      const accessToken = getAccessTokenFromLocalStorage();
      if (!accessToken) {
        setRole(null);
        return;
      }
      const payload = decodeToken(accessToken);
      setRole(payload?.role ?? null);
    } catch {
      setRole(null);
    }
  }, []);

  useEffect(() => {
    refreshAuthState();

    return subscribeAuthTokenChanged(() => {
      refreshAuthState();
    });
  }, [refreshAuthState]);

  const isLoggedIn = role !== null;
  const isGuest = role === Role.Guest;

  const contextValue = useMemo(
    () => ({
      guestName,
      setGuestName: handleSetGuestName,
      isLoggedIn,
      role,
      isGuest,
      refreshAuthState,
    }),
    [
      guestName,
      handleSetGuestName,
      isLoggedIn,
      role,
      isGuest,
      refreshAuthState,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
