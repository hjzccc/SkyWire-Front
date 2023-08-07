"use client";
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "@/hooks/store";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <SWRConfig>
            <Provider store={store}>{children}</Provider>
          </SWRConfig>
        </SessionProvider>
      </body>
    </html>
  );
}
