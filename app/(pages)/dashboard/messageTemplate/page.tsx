"use client";
import {
  Button,
  Card,
  FloatButton,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
} from "antd";
import React, { useState } from "react";
import { SendChannelConfig } from "@/common/configs/AccountConfigs";
import { ColumnsType } from "antd/es/table";
import { ParameterType } from "@/types";
import {
  getPlaceHolders,
  replacePlaceHolders,
} from "@/common/placeHolderUtils";
import { table } from "console";
import {
  BasicResultVo,
  ChannelAccount,
  MessageTemplate,
  SendRequest,
} from "@/types/backendInterface";
import {
  appFetch,
  useAccounts,
  useAppSWR,
  useMessageTemplates,
} from "@/common/appNetwork";
import { mutate } from "swr";
import { useSession } from "next-auth/react";
import { respStatusEnum } from "@/common/respStatusEnum";
import toast, { Toaster } from "react-hot-toast";
import {
  CommentOutlined,
  ContactsOutlined,
  CustomerServiceOutlined,
  PlusOutlined,
} from "@ant-design/icons";
type FormValueType = {
  id?: number;
  name: string;
  sendChannel: keyof typeof SendChannelConfig;
  accountId: number;
  config: Record<string, string>;
};
function AccountPage() {
  interface FormValue {
    id: number;
    name: string;
    sendChannel: keyof typeof SendChannelConfig;
    config: Record<string, string>;
  }
  const [modalOpen, setModalOpen] = useState(false);
  const { data: session } = useSession();
  const {
    data: channelAccounts,
    mutate: mutateChannelAccounts,
    isLoading,
  } = useAccounts(session?.access_token);
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
        <div>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            New
          </Button>
        </div>
        <Table
          dataSource={channelAccounts}
          pagination={{ pageSize: 5 }}
          columns={tableColumn}
          bordered
          loading={isLoading}
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

function Page() {
  const { data: session } = useSession();
  const { data: channelAccounts, mutate: mutateChannelAccounts } = useAccounts(
    session?.access_token
  );
  const {
    data: messageTemplateData,
    mutate: mutateMessageTemplate,
    isLoading,
  } = useMessageTemplates(session?.access_token);
  console.log(messageTemplateData);
  const [newTemplateForm] = Form.useForm();
  const [testForm] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testMessageTemplate, setTestMessageTemplate] =
    useState<MessageTemplate>();
  const currentChannelType: keyof typeof SendChannelConfig = Form.useWatch(
    "sendChannel",
    newTemplateForm
  );
  const tableColumns: ColumnsType<
    NonNullable<typeof messageTemplateData>[number]
  > = [
    {
      title: "ID",
      key: "id",
      render: (_, record) => <span>{record.id}</span>,
    },
    {
      title: "Name",
      key: "name",
      render: (text, record) => <span>{record.name}</span>,
    },
    {
      title: "Channel",
      key: "channel",
      render: (text, record) => {
        let sendChannel =
          Object.keys(SendChannelConfig).find(
            (value) =>
              SendChannelConfig[value as keyof typeof SendChannelConfig].id ==
              record.sendChannel
          ) ?? "Default";
        return (
          <span>
            {sendChannel[0].toUpperCase().concat(sendChannel.slice(1))}
          </span>
        );
      },
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
              newTemplateForm.setFieldValue("id", record.id);
              newTemplateForm.setFieldValue("name", record.name);
              let sendChannel = Object.keys(SendChannelConfig).find(
                (value) =>
                  SendChannelConfig[value as keyof typeof SendChannelConfig]
                    .id == record.sendChannel
              );
              newTemplateForm.setFieldValue("sendChannel", sendChannel);
              newTemplateForm.setFieldValue("accountId", record.sendAccountId);
              let configs = JSON.parse(record.msgContent);
              for (const key in configs) {
                newTemplateForm.setFieldValue(["config", key], configs[key]);
              }
              setModalOpen(true);
            }}
          >
            Edit
          </Radio.Button>
          <Radio.Button>Copy</Radio.Button>
          <Radio.Button>Recall</Radio.Button>
          <Popconfirm
            title="Delete"
            description="Are you sure to delete this?"
            onConfirm={async () => {
              try {
                const response = await appFetch(
                  `/api/messageTemplate/${record.id}`,
                  session?.access_token,
                  {
                    method: "DELETE",
                  }
                );
                if (response?.status == respStatusEnum.SUCCESS) {
                  mutateMessageTemplate();
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
      let response = await appFetch(
        "/api/messageTemplate/save",
        session?.access_token,
        {
          method: "POST",
          body: JSON.stringify(messageTemplate),
        }
      );
      if (response?.status == respStatusEnum.SUCCESS) {
        mutateMessageTemplate();
        newTemplateForm.resetFields();
        setModalOpen(false);
        toast.success(response.msg);
      } else {
        throw Error(response?.msg ?? "fail");
      }
    } catch (e: any) {
      toast.error(e.message);
      console.log(e);
    }
  };
  const [floatButtonOpen, setFloatButtonOpen] = useState(false);
  return (
    <>
      <Toaster></Toaster>
      <div className="flex flex-col gap-3 lg:flex-row">
        <Card title="Templates" className="flex-1">
          <Button
            className="mb-3"
            type="primary"
            onClick={() => setModalOpen(true)}
          >
            New
          </Button>
          <Table
            pagination={{ pageSize: 5 }}
            dataSource={messageTemplateData}
            columns={tableColumns}
            bordered
            loading={isLoading}
          ></Table>
        </Card>
        <Card title="Accounts" className="flex-1">
          <AccountPage></AccountPage>
        </Card>
      </div>
      <Modal
        destroyOnClose={true}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          newTemplateForm.resetFields();
        }}
        onOk={() => {
          newTemplateForm.submit();
        }}
      >
        <Form form={newTemplateForm} onFinish={onFinishSuccess} className="p-5">
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
                  channelAccounts &&
                  channelAccounts
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
          className="p-5"
          onFinish={async (value: {
            receiver: string;
            configs: Record<string, string>;
          }) => {
            console.log(value);
            const assembledMessage = replacePlaceHolders(
              value.configs,
              testMessageTemplate?.msgContent ?? ""
            );
            console.log(assembledMessage);
            let sendRequest: Partial<SendRequest> = {
              code: "send",
              messageTemplateId: testMessageTemplate?.id,
              messageParam: {
                receiver: value.receiver,
                msgContent: assembledMessage,
              },
            };
            console.log(sendRequest);
            try {
              const response = await appFetch(
                "/api/send",
                session?.access_token,
                {
                  method: "POST",
                  body: JSON.stringify(sendRequest),
                }
              );
              if (response?.status == respStatusEnum.SUCCESS) {
                console.log("ejwjffjwjfiwjwfjfjfjjfwwfjj");
                toast.success("operation success");
                setTestModalOpen(false);
                testForm.resetFields();
              } else {
                throw Error(response?.msg);
              }
            } catch (e: any) {
              toast.error(e.message);
            }
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
