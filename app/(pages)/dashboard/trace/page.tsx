"use client";
import { useTraceInfo } from "@/common/appNetwork";
import { Table, Timeline } from "antd";
import { ColumnType, ColumnsType } from "antd/es/table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

function Page() {
  const { data: session } = useSession();
  const { data: dataSource } = useTraceInfo(session?.access_token);
  const router = useRouter();
  const tableColumns: ColumnsType<NonNullable<typeof dataSource>[number]> = [
    {
      title: "MessageTemplate",
      key: "template",
      render: (text, record) => <span>{record.messageTemplateId}</span>,
    },
    {
      title: "Account",
      key: "account",
      render: (text, record) => <span>{record.sendAccountId}</span>,
    },
    {
      title: "Receiver",
      key: "receiver",
      render: (text, record) => <span>{record.receiver.join(",")}</span>,
    },
    {
      title: "Content",
      key: "content",
      render: (text, record) => <span>{record.contentModel}</span>,
    },
    {
      title: "Time",
      key: "time",
      render: (text, record) => (
        <span>{new Date(record.logTimeStamp * 1000).toLocaleString()}</span>
      ),
    },
  ];
  return (
    <Table
      dataSource={dataSource}
      columns={tableColumns}
      onRow={(record, index) => ({
        onClick: (event) => {
          router.push(`/dashboard/trace/${record.id}`);
        },
        style: {
          cursor: "pointer",
        },
      })}
    ></Table>
  );
}

export default Page;
