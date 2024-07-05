import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Provider from "@/components/provider";
import { Toaster } from "@/components/ui/sonner";
import { Inter as FontSans } from "next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kashkiddo.vercel.app"),
  title: {
    default: "KashKiddo",
    template: "%s | KashKiddo",
  },
  description: "A digital platform for earning money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
