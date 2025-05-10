import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode, useState } from "react";

import { useAuth } from "./auth-provider";
import Loading from "./loading";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isAuthenticated) {
    if (isLoading) {
      return <Loading />;
    } else {
      return <>{children}</>;
    }
  }
};

export default AuthGuard;
