"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import RefreshToken from "./refresh-token";
import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from "@/lib/utils";
import { useCallback, useContext, useEffect, useState } from "react";
import { createContext } from "react"
import { RoleType } from "@/types/jwt.types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
const AppContext = createContext({
  role: undefined as RoleType | undefined,
  setRole: (role?:RoleType | undefined) => {},

})
export const useAppContext = ()=>{
  return useContext(AppContext)
}
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;

}) {
const [roleState, setRoleState] = useState(() => {
  const token = getAccessTokenFromLocalStorage()

  if (!token) return null

  const decoded = decodeToken(token)

  return decoded?.role ?? null
})
// const setRole = useCallback((role?: RoleType | undefined) => {
//     setRoleState(role)
//     if (!role) {
//       removeTokensFromLocalStorage()
//     }
//   }, [])


  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
