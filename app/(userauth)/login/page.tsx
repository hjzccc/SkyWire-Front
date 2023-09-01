"use client";
import React from "react";
import { GithubOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Icon from "@/public/icon-blue.svg";
import Image from "next/image";
import { AiFillGithub } from "react-icons/ai";
const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    signIn("credential", {
      email: values.username,
      password: values.password,
      redirect: true,
      callbackUrl: "/dashboard/messageTemplate",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-200">
      <Card className="py-10 shadow-md">
        <div className="flex flex-col items-center font-sans justify-evenly">
          <span className="mb-5 text-xl font-semibold">
            WelCome to SkyWire!
          </span>
          <Form
            name="normal_login"
            style={{ minWidth: 400 }}
            onFinish={onFinish}
          >
            <Form.Item
              className="drop-shadow "
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              className="drop-shadow"
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full font-medium"
              >
                LOG IN
              </Button>
              <Button
                type="primary"
                className="w-full mt-2 bg-black "
                href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/github`}
              >
                <div className="flex items-center justify-center gap-3">
                  <GithubOutlined /> SIGN IN WITH GITHUB
                </div>
              </Button>
              <div className="mt-3">
                Or{" "}
                <Link href="/register" className="font-semibold underline">
                  register now!
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default App;
