"use client";
import React, { useState } from "react";
import type { CascaderProps } from "antd";
import {
  AutoComplete,
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { RegisterRequest } from "@/types/backendInterface";
import { appFetch, simpleAppFetch } from "@/common/appNetwork";
import { respStatusEnum } from "@/common/respStatusEnum";
import Link from "next/link";
import Icon from "@/public/icon-blue.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { signIn } from "next-auth/react";

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async (values: any) => {
    setIsLoading(true);
    const registerParameter: RegisterRequest = {
      email: values.email,
      password: values.password,
    };
    console.log(registerParameter);
    try {
      const response = await simpleAppFetch("/auth/register", {
        body: JSON.stringify(registerParameter),
        method: "POST",
      });
      if (response.status == respStatusEnum.SUCCESS) {
        toast.success("register success");
        signIn("credential", {
          email: values.email,
          password: values.password,
          redirect: true,
          callbackUrl: "/dashboard/messageTemplate",
        });
      } else {
        throw Error(response.msg);
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster></Toaster>
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200">
        <Card className="shadow-md ">
          <Form
            form={form}
            layout={"vertical"}
            name="register"
            onFinish={onFinish}
            style={{ minWidth: 400 }}
            scrollToFirstError
          >
            <Form.Item
              className="drop-shadow "
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className="drop-shadow "
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              className="drop-shadow "
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button
                className="w-full font-medium"
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                REGISTER
              </Button>
              <div className="mt-3">
                Or{" "}
                <Link href="/login" className="font-semibold underline">
                  log In!
                </Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default App;
