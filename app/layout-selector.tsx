"use client";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";
import AuthGuard from "./(providers)/auth-guard";
import { useAuth } from "./(providers)/auth-provider";
import { AppSidebar } from "./blocks/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

export default function LayoutSelector({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname: string = usePathname();
  const isAuthPage =
    pathname === "/login" || pathname === "/logout" || pathname === "/register";

  const [breadcrumbs, setBreadcrumbs] = useState<
    { href: string; label: string }[]
  >([]);

  useEffect(() => {
    // Split the pathname into segments
    const pathSegments = pathname.split("/").filter((segment) => segment);

    // Construct breadcrumbs
    const breadcrumbList = pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");

      let label = decodeURIComponent(segment).replace(/-/g, " ");

      // make the first letter uppercase
      label = label.charAt(0).toUpperCase() + label.slice(1);

      return { href, label };
    });

    setBreadcrumbs(breadcrumbList);
  }, []);

  return (
    <>
      {isAuthPage ? (
        children
      ) : (
        <AuthGuard>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="p-0 m-0">
                <div className="flex flex-1 flex-col gap-4">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </AuthGuard>
      )}
    </>
  );
}
