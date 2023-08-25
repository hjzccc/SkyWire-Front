"use client";
import { useTraceInfo } from "@/common/appNetwork";
import { Timeline } from "antd";
import { useSession } from "next-auth/react";
import React from "react";

function Page({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const { data: dataSource } = useTraceInfo(session?.access_token);
  const record = dataSource
    .find((value) => value.id === params.id)
    ?.state?.sort((a, b) => a.code - b.code);
  const initialItems = [
    {
      color: "gray",
      children: <p>received by message queue</p>,
    },
    {
      color: "gray",
      children: <p>send success/fail</p>,
    },
  ];
  record?.forEach((value, index) => {
    initialItems[index] = {
      color: "blue",
      children: <p>{value.description}</p>,
    };
  });
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen ">
      <Timeline className="scale-150 " items={initialItems}></Timeline>
    </div>
  );
}

export default Page;
