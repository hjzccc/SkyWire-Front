"use client";
import { Provider } from "react-redux";
import "../globals.css";
import { store } from "@/hooks/store";
import { SessionProvider, signOut } from "next-auth/react";
import { SWRConfig } from "swr";
import { Button, ConfigProvider, Divider } from "antd";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Icon from "@/public/icon.svg";
import Image from "next/image";
import Link from "next/link";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <html lang="en">
      <body className="dark">
        <ConfigProvider
          theme={{
            token: {},
          }}
        >
          <SessionProvider refetchInterval={3600} refetchOnWindowFocus>
            <SWRConfig>
              <Provider store={store}>
                <div className="flex flex-col ">
                  <div className="flex items-center justify-between h-20 gap-6 border-b">
                    <div className="flex items-center px-3 gap-9 ">
                      <p className="block text-2xl font-semibold text-blue-600 font-comfortta">
                        Skywire
                      </p>
                      <Link
                        className="px-2 py-1 text-sm rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        href={"/dashboard/messageTemplate"}
                      >
                        Templates
                      </Link>
                      <Link
                        className="px-2 py-1 text-sm rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 "
                        href={"/dashboard/account"}
                      >
                        Account
                      </Link>
                      <Link
                        className="px-2 py-1 text-sm rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 "
                        href={"/dashboard/trace"}
                      >
                        History
                      </Link>
                    </div>
                    <div className="mr-20 ">
                      <Button
                        type="link"
                        className="mr-4 text-white"
                        onClick={() => {
                          signOut();
                        }}
                      >
                        Sign out
                      </Button>
                    </div>
                  </div>
                  <div className="mx-2 my-4 ">{children}</div>
                </div>
              </Provider>
            </SWRConfig>
          </SessionProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
