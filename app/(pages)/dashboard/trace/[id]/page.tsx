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
  return (
    <div>
      <Timeline
        items={record?.map((value) => ({
          children: (
            <>
              <p>{value.description}</p>
            </>
          ),
        }))}
      ></Timeline>
    </div>
  );
}

export default Page;
