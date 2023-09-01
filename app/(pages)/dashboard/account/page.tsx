"use client";
import useSWR, { mutate, useSWRConfig } from "swr";
import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
} from "antd";
import { SendChannelConfig } from "@/common/configs/AccountConfigs";
import { getSession, useSession } from "next-auth/react";
import { BasicResultVo, ChannelAccount } from "@/types/backendInterface";
import { appFetch, useAccounts, useAppSWR } from "@/common/appNetwork";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { respStatusEnum } from "@/common/respStatusEnum";
import { ColumnType, ColumnsType } from "antd/es/table";
import { table } from "console";
interface FormValue {
  id: number;
  name: string;
  sendChannel: keyof typeof SendChannelConfig;
  config: Record<string, string>;
}
function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: session } = useSession();
  const { data: channelAccounts, mutate: mutateChannelAccounts } = useAccounts(
    session?.access_token
  );
  const [form] = Form.useForm();
  const currentAccountType: keyof typeof SendChannelConfig = Form.useWatch(
    "sendChannel",
    form
  );
  const accountOptions = Object.keys(SendChannelConfig).map((key) => ({
    value: key,
  }));
  const onFinishSuccess = async (value: FormValue) => {
    const account: Partial<ChannelAccount> = {
      id: value.id,
      name: value.name,
      sendChannel: SendChannelConfig[value.sendChannel].id,
      accountConfig: JSON.stringify(value.config),
    };
    try {
      const response = await appFetch(
        "/api/channelAccount/save",
        session?.access_token,
        {
          method: "POST",
          body: JSON.stringify(account),
        }
      );
      if (response?.status == respStatusEnum.SUCCESS) {
        toast.success(response.msg);
        mutateChannelAccounts();
        form.resetFields();
        setModalOpen(false);
      } else {
        throw Error(response?.msg);
      }
    } catch (e: any) {
      toast.error(e.message);
      console.log(e);
    }
  };
  const tableColumn: ColumnsType<NonNullable<typeof channelAccounts>[number]> =
    [
      {
        title: "ID",
        key: "id",
        render: (text, record) => <span>{record.id}</span>,
      },
      {
        title: "Name",
        key: "name",
        render: (text, record) => <span>{record.name}</span>,
      },
      {
        title: "channel",
        key: "channel",
        render: (text, record) => (
          <span>
            {Object.keys(SendChannelConfig).find(
              (value) =>
                SendChannelConfig[value as keyof typeof SendChannelConfig].id ==
                record.sendChannel
            )}
          </span>
        ),
      },
      {
        title: "operation",
        key: "operation",
        render: (text, record) => (
          <Radio.Group>
            <Popconfirm
              title="Delete"
              description="Are you sure to delete this?"
              onConfirm={async () => {
                try {
                  const response = await appFetch(
                    `/api/channelAccount/${record.id}`,
                    session?.access_token,
                    {
                      method: "DELETE",
                    }
                  );
                  if (response?.status == respStatusEnum.SUCCESS) {
                    mutateChannelAccounts();
                    toast.success(response.msg ?? "success");
                  } else {
                    throw Error(response?.msg ?? "fail");
                  }
                } catch (e: any) {
                  toast.error(e.message);
                }
              }}
            >
              <Radio.Button>Delete</Radio.Button>
            </Popconfirm>

            <Radio.Button
              onClick={() => {
                form.setFieldValue("id", record.id);
                form.setFieldValue("name", record.name);
                let sendChannel = Object.keys(SendChannelConfig).find(
                  (value) =>
                    SendChannelConfig[value as keyof typeof SendChannelConfig]
                      .id == record.sendChannel
                );
                form.setFieldValue("sendChannel", sendChannel);
                let configs = JSON.parse(record.accountConfig);
                for (const key in configs) {
                  form.setFieldValue(["config", key], configs[key]);
                }
                setModalOpen(true);
              }}
            >
              Edit
            </Radio.Button>
          </Radio.Group>
        ),
      },
    ];
  return (
    <>
      <div className="flex flex-col gap-3">
        <Toaster position="top-center" reverseOrder={false} />
        <div>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            New
          </Button>
        </div>
        <Table
          dataSource={channelAccounts}
          columns={tableColumn}
          bordered
        ></Table>
      </div>
      <Modal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={() => {
          form.submit();
        }}
      >
        <Form form={form} onFinish={onFinishSuccess} className="px-5 py-5">
          <Form.Item name="id" label="id" style={{ display: "none" }}>
            <Input></Input>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input account name",
              },
            ]}
            label="Account name"
            name="name"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="sendChannel"
            rules={[
              {
                required: true,
                message: "Please select account type",
              },
            ]}
          >
            <Radio.Group>
              {accountOptions.map((option, index) => (
                <Radio key={index} value={option.value}>
                  {option.value[0].toUpperCase() + option.value.slice(1)}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          {SendChannelConfig[currentAccountType] &&
            Object.keys(
              SendChannelConfig[currentAccountType].accountTEmpalte
            ).map((key, index) => (
              <Form.Item key={index} label={key} name={["config", key]}>
                <Input />
              </Form.Item>
            ))}
        </Form>
      </Modal>
    </>
  );
}

export default Page;
