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

export default function LayoutSelector({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname: string = usePathname();
  const isAuthPage =
    pathname === "/login" || pathname === "/logout" || pathname === "/register";

  return (
    <>
      {isAuthPage ? (
        children
      ) : (
        <AuthGuard>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="#">Placeholder</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Placeholder</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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
