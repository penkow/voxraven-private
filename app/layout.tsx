/* eslint react/no-children-prop: 0 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import LayoutSelector from "./layout-selector";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoxRaven - Content Creator AI Agents",
  description: "Early Alpha",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body>
        <Providers>
          <LayoutSelector children={children} />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}