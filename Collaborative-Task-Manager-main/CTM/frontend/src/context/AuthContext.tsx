import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import type { User } from "../types";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
  });

  const setUser = (user: User | null) => {
    if (user) {
      queryClient.setQueryData(["me"], { user });
    } else {
      queryClient.removeQueries({ queryKey: ["me"] });
    }
  };

  const logout = async () => {
    await authApi.logout();
    queryClient.clear();
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user: data?.user ?? null,
      isLoading,
      setUser,
      refresh: async () => {
        await refetch();
      },
      logout,
    }),
    [data?.user, isLoading, refetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
