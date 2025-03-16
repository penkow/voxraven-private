import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ReactNode } from "react";
import { useAuth } from "./auth-provider";
import Loading from "./loading";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const temporaryDisabled = false;

  if (!temporaryDisabled) {
    if (isLoading) {
      return <Loading />; // Or your custom loading spinner
    }

    if (!user) {
      router.push("/login");
      return null;
    }
  };

  return children; // If authenticated, render children
};

export default AuthGuard;