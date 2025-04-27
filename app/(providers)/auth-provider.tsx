import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Models } from "appwrite";
import { toast } from "sonner";

// Create AuthContext
const AuthContext = createContext<{
  user: any | null;
  isLoading: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  get_jwt: () => Promise<string>;
}>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  get_jwt: () => Promise.resolve(""),
});

import { ReactNode } from "react";
import { Account, Client } from "appwrite";
import { account } from "../appwrite";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setisLoading] = useState(true);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    setisLoading(true);

    const promise = account.createEmailPasswordSession(username, password);

    promise.then(
      async function (response) {
        toast.success("Login successful");
        const user = await account.get();
        setUser(user);
        router.push("/analysis");
      },
      function (error) {
        toast.error("Login failed");
      }
    );

    setTimeout(() => {
      setisLoading(false);
    }, 800);
  };

  const get_jwt = async () => {
    const jwt = await account.createJWT();
    return jwt.jwt;
  };

  const get_user = async () => {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      return null;
    }
  };

  const logout = async () => {
    setisLoading(true);
    await account.deleteSession("current");
    toast.success("Logout successful");
    router.push("/login");
    setUser(null);
    setTimeout(() => {
      setisLoading(false);
    }, 800);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
      } catch (error) {}
      setisLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, get_jwt }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper hook to access AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
