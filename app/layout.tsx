import Providers from "@/components/assets/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/assets/header";
import { SessionProvider } from "@/components/assets/SessionProvider"

export const metadata: Metadata = {
  title: "EventMinder",
  description: "Generated by Prabhjot Singh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased flex flex-1 h-screen flex-col dark:text-gray-100 text-zinc-800 dark:bg-gray-900 bg-zinc-300`}
      >
        <SessionProvider>
          <Providers>
            <Header/>
            {children}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
