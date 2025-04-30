import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode, useState } from "react";

import { useAuth } from "./auth-provider";
import Loading from "./loading";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Is Authenticated", isAuthenticated);
    console.log("Is loading", isLoading);

    if (!isAuthenticated && !isLoading) {
      console.log("Going to login");
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
