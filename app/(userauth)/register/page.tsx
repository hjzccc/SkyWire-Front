"use client";
import React, { useState } from "react";
import type { CascaderProps } from "antd";
import {
  AutoComplete,
  Button,
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

  const onFinish = async (values: any) => {
    const registerParameter: RegisterRequest = {
      username: values.username,
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
        signIn("credentials", {
          username: values.username,
          password: values.password,
          redirect: true,
          callbackUrl: "/dashboard/messageTemplate",
        });
      } else {
        throw Error(response.msg);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Toaster></Toaster>
      <div className="flex flex-col items-center">
        <Image src={Icon} height={48} className="my-10" alt=""></Image>
        <Form
          form={form}
          layout={"vertical"}
          name="register"
          onFinish={onFinish}
          style={{ minWidth: 400 }}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please input your uesrname!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
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
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button className="w-full" type="primary" htmlType="submit">
              Register
            </Button>
            Or <Link href="/login">log In!</Link>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default App;
