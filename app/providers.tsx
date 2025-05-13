// app/providers.tsx
"use client";

import { AuthProvider } from "./(providers)/auth-provider";
import { ProjectsProvider } from "./(providers)/projects-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProjectsProvider>
      <AuthProvider>{children}</AuthProvider>
    </ProjectsProvider>
  );
}
