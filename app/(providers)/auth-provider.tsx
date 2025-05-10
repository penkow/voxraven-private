import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Models } from "appwrite";
import { toast } from "sonner";

interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  memberships: string[];
}

// Create AuthContext
const AuthContext = createContext<{
  user: UserPayload | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const USER_ENDPOINT = new URL("api/auth", process.env.NEXT_PUBLIC_API_URL);

  const LOGOUT_ENDPOINT = new URL(
    "api/auth/logout",
    process.env.NEXT_PUBLIC_API_URL
  );

  const LOGIN_ENDPOINT = new URL(
    "api/auth/login",
    process.env.NEXT_PUBLIC_API_URL
  );

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (response.status === 200) {
      const user: UserPayload = await response.json();
      setUser(user);
      setIsLoading(false);
      setIsAuthenticated(true);
      toast.success("Login successful");
    } else {
      setUser(null);
      setIsLoading(false);
      setIsAuthenticated(false);
      toast.error("Login failed");
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await fetch(LOGOUT_ENDPOINT, {
      method: "POST",
      credentials: "include",
    });
    toast.success("Logout successful");
    setUser(null);
    setIsLoading(false);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      const response = await fetch(USER_ENDPOINT, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        const user: UserPayload = await response.json();
        setUser(user);
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Helper hook to access AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
