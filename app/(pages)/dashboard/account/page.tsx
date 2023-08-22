"use client";
import useSWR, { mutate, useSWRConfig } from "swr";
import React, { useState } from "react";
import { Button, Form, Input, Modal, Radio, Select, Table } from "antd";
import { SendChannelConfig } from "@/common/configs/AccountConfigs";
import { useSession } from "next-auth/react";
import { BasicResultVo, ChannelAccount } from "@/types/backendInterface";
import { appFetch, useAccounts, useAppSWR } from "@/common/appNetwork";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast/headless";
import { respStatusEnum } from "@/common/respStatusEnum";
import { ColumnType, ColumnsType } from "antd/es/table";
import { table } from "console";
interface FormValue {
  accountName: string;
  accountType: keyof typeof SendChannelConfig;
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
    "accountType",
    form
  );
  const accountOptions = Object.keys(SendChannelConfig).map((key) => ({
    value: key,
  }));
  const onFinishSuccess = async (value: FormValue) => {
    const account: Partial<ChannelAccount> = {
      name: value.accountName,
      sendChannel: SendChannelConfig[value.accountType].id,
      accountConfig: JSON.stringify(value.config),
    };
    try {
      const response: BasicResultVo<any> = await appFetch(
        "/api/channelAccount/save",
        session?.access_token,
        {
          method: "POST",
          body: JSON.stringify(account),
        }
      );
      if (response.status == respStatusEnum.SUCCESS) {
        toast.success(response.msg, { duration: 2000 });
        setModalOpen(false);
        mutateChannelAccounts();
        return;
      }
      toast.error(response.msg);
    } catch (e) {
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
            <Radio.Button>Delete</Radio.Button>
            <Radio.Button>Edit</Radio.Button>
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
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          console.log("Iamok");
          form.submit();
        }}
      >
        <Form form={form} onFinish={onFinishSuccess} className="px-5 py-5">
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input account name",
              },
            ]}
            label="Account name"
            name="accountName"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="accountType"
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
