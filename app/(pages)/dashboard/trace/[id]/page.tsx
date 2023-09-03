"use client";
import { useTraceInfo } from "@/common/appNetwork";
import { LoadingOutlined } from "@ant-design/icons";
import { Steps, Timeline } from "antd";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

function Page({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const { data: dataSource } = useTraceInfo(session?.access_token);
  const record =
    dataSource
      .find((value) => value.id === params.id)
      ?.state?.sort((a, b) => a.code - b.code) ?? [];
  const initialItems = [
    {
      title: "Waiting to process",
      icon: record.length == 0 ? <LoadingOutlined /> : null,
    },
    {
      title: "Processing",
      icon: record.length == 1 ? <LoadingOutlined /> : null,
    },
    {
      title: "Done",
    },
  ];
  let status: "error" | "process" | "finish" | "wait" = "process";
  if (record.length == 2) {
    if (record[1].code == 60) {
      status = "finish";
    } else {
      status = "error";
    }
  }
  return (
    <div className="flex items-center justify-center h-full">
      <Steps
        style={{ height: "50%" }}
        current={record.length}
        status={status}
        className="w-1/2 "
        items={initialItems}
      ></Steps>
    </div>
  );
}

export default Page;
