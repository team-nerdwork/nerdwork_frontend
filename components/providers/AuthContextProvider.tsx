"use client";

import { signOut, useSession } from "next-auth/react";
import { createContext, useContext, useMemo, ReactNode } from "react";
import { Session } from "next-auth";

export interface UserContext extends Pick<Session["user"], "id" | "email"> {
  token?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const defaultUserContext: UserContext = {
  id: "",
  email: undefined,
  token: undefined,
  isAuthenticated: false,
  isLoading: true,
};

interface AuthContextType {
  user: UserContext;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  const user = useMemo<UserContext>(() => {
    if (status === "loading") {
      return { ...defaultUserContext, isLoading: true };
    }

    if (status === "authenticated" && session) {
      return {
        id: session.user.id ?? "",
        email: session.user.email ?? undefined,
        token: session.token ?? undefined,
        isAuthenticated: true,
        isLoading: false,
      };
    }

    return { ...defaultUserContext, isLoading: false };
  }, [session, status]);

  const logout = async () => {
    await signOut({ redirect: false });
  };

  const value = useMemo(() => ({ user, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
