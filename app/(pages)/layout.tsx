"use client";
import { Provider } from "react-redux";
import "../globals.css";
import { store } from "@/hooks/store";
import { SessionProvider, signOut } from "next-auth/react";
import { SWRConfig } from "swr";
import { Button, ConfigProvider } from "antd";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Icon from "@/public/icon.svg";
import Image from "next/image";
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
            token: {
              // Seed Token
              borderRadius: 2,
              lineWidth: 1,

              // Alias Token
              colorBgContainer: " #e2e8f0",
            },
          }}
        >
          <SessionProvider>
            <SWRConfig>
              <Provider store={store}>
                <div className="flex flex-col ">
                  <div className="flex items-center justify-between gap-6 bg-blue-500 shadow-xl h-14 ">
                    <div className="flex px-3">
                      <Image
                        src={Icon}
                        height={28}
                        className=" fill-white"
                        alt=""
                      ></Image>
                      <Button
                        type="link"
                        className="h-full text-white bg-inherit "
                        onClick={() => {
                          router.push("/dashboard/messageTemplate");
                        }}
                      >
                        MessageTemplate
                      </Button>
                      <Button
                        type="link"
                        className="h-full text-white bg-inherit "
                        onClick={() => {
                          router.push("/dashboard/account");
                        }}
                      >
                        Account
                      </Button>
                      <Button
                        type="link"
                        className="h-full text-white bg-inherit "
                        onClick={() => {
                          router.push("/dashboard/trace");
                        }}
                      >
                        History
                      </Button>
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
