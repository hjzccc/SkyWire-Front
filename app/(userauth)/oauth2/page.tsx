"use client";
import { Spin } from "antd";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const searchParams = useSearchParams();

  if (searchParams?.get("error")) {
    return <p>Authorization Failed</p>;
  }
  if (searchParams) {
    signIn("AuthCallback", {
      token: searchParams?.get("token"),
      redirect: true,
      callbackUrl: "/dashboard/messageTemplate",
    });
  }
  return (
    <div className="w-screen ">
      <Spin tip="Sign in process" className="w-screen ">
        <div className="w-screen" />
      </Spin>
    </div>
  );
}

export default Page;
