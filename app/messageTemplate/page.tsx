"use client";
import { Button, Form, Input, Modal, Radio, Select, Table } from "antd";
import React, { useState } from "react";
import { SendChannelConfig } from "@/common/configs/AccountConfigs";
import { ColumnsType } from "antd/es/table";
import { ParameterType } from "@/types";
import {
  getPlaceHolders,
  replacePlaceHolders,
} from "@/common/placeHolderUtils";
import { useMessageTemplateStore } from "@/hooks/messageTemplateStore";
import { table } from "console";
import { BasicResultVo, MessageTemplate } from "@/types/backendInterface";
import {
  appFetch,
  useAccounts,
  useAppSWR,
  useMessageTempaltes,
} from "@/common/appNetwork";
import { mutate } from "swr";
import { useSession } from "next-auth/react";
import { useAccountStore } from "@/hooks/accountStore";
import { respStatusEnum } from "@/common/respStatusEnum";
type FormValueType = {
  id?: number;
  name: string;
  sendChannel: keyof typeof SendChannelConfig;
  accountId: number;
  config: Record<string, string>;
};
function Page() {
  const { data: session } = useSession();
  const { data: accountsData, mutate: mutateAccount } = useAccounts(
    session?.access_token
  );
  const { data: messageTemplateData, mutate: mutateMessageTemplate } =
    useMessageTempaltes(session?.access_token);
  console.log(messageTemplateData);
  const [form] = Form.useForm();
  const [testForm] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testMessageTemplate, setTestMessageTemplate] =
    useState<MessageTemplate>();
  const currentChannelType: keyof typeof SendChannelConfig = Form.useWatch(
    "sendChannel",
    form
  );
  const tableColumns: ColumnsType<
    NonNullable<typeof messageTemplateData>[number]
  > = [
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
      title: "Operations",
      key: "operations",
      render: (text, record) => (
        <Radio.Group>
          <Radio.Button
            onClick={() => {
              setTestModalOpen(true);
              setTestMessageTemplate(record);
            }}
          >
            Test
          </Radio.Button>
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
              form.setFieldValue("accountId", record.sendAccountId);
              let configs = JSON.parse(record.msgContent);
              for (const key in configs) {
                form.setFieldValue(["config", key], configs[key]);
              }
            }}
          >
            Edit
          </Radio.Button>
          <Radio.Button>Copy</Radio.Button>
          <Radio.Button>Recall</Radio.Button>
          <Radio.Button>Delete</Radio.Button>
        </Radio.Group>
      ),
    },
  ];
  const onFinishSuccess = async (value: FormValueType) => {
    let messageTemplate: Partial<MessageTemplate> = {
      id: value.id,
      name: value.name,
      sendChannel: SendChannelConfig[value.sendChannel].id,
      sendAccountId: value.accountId,
      msgContent: JSON.stringify(value.config),
    };
    try {
      let response: BasicResultVo<any> = await appFetch(
        "/api/messageTemplate/save",
        session?.access_token,
        {
          method: "POST",
          body: JSON.stringify(messageTemplate),
        }
      );
      if (response.status == respStatusEnum.SUCCESS) {
        mutateMessageTemplate();
        form.resetFields();
        setModalOpen(false);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div className="flex flex-col">
        <div>
          <Button type={"primary"} onClick={() => setModalOpen(true)}>
            New
          </Button>
        </div>
        <Table dataSource={messageTemplateData} columns={tableColumns}></Table>
      </div>
      <Modal
        destroyOnClose={true}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={() => {
          form.submit();
        }}
      >
        <Form form={form} onFinish={onFinishSuccess}>
          <Form.Item name="id" label="id" style={{ display: "none" }}>
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Template Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input template name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select sending channel",
              },
            ]}
            label={"Sending Channel"}
            name={"sendChannel"}
          >
            <Radio.Group>
              {Object.keys(SendChannelConfig).map((key, index) => (
                <Radio key={index} value={key}>
                  {key[0].toUpperCase() + key.slice(1)}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          {currentChannelType && (
            <Form.Item
              label={"Account Id"}
              name={"accountId"}
              rules={[
                {
                  required: true,
                  message: "Please select account",
                },
              ]}
            >
              <Select
                options={
                  accountsData &&
                  accountsData
                    .filter(
                      (key) =>
                        key.sendChannel ==
                        SendChannelConfig[currentChannelType].id
                    )
                    .map((account) => ({
                      value: account.id,
                      label: `${account.name}||${account.id}`,
                    }))
                }
              ></Select>
            </Form.Item>
          )}

          {currentChannelType &&
            Object.keys(
              SendChannelConfig[currentChannelType].messageTemplate
            ).map((key, index) => (
              <Form.Item key={index} label={key} name={["config", key]}>
                <Input />
              </Form.Item>
            ))}
        </Form>
      </Modal>

      <Modal
        forceRender={false}
        open={testModalOpen}
        onOk={() => testForm.submit()}
        onCancel={() => {
          testForm.resetFields();
          setTestModalOpen(false);
        }}
      >
        <Form
          form={testForm}
          onFinish={(values: {
            recevier: string;
            configs: Record<string, string>;
          }) => {
            console.log(values);
            const assembledMessage = replacePlaceHolders(
              values.configs,
              testMessageTemplate?.msgContent ?? ""
            );
            console.log(assembledMessage);
          }}
        >
          <Form.Item label="Receiver" name="receiver">
            <Input></Input>
          </Form.Item>
          {testMessageTemplate?.msgContent &&
            getPlaceHolders(testMessageTemplate.msgContent)?.map(
              (value, index) => (
                <Form.Item
                  key={index}
                  label={value[0].toUpperCase().concat(value.slice(1))}
                  name={["configs", value]}
                >
                  <Input></Input>
                </Form.Item>
              )
            )}
          <Form.Item></Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Page;
