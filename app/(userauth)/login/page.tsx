"use client";
import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Icon from "@/public/icon-blue.svg";
import Image from "next/image";
const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: true,
      callbackUrl: "/dashboard/messageTemplate",
    });
  };

  return (
    <div className="flex flex-col items-center">
      <Image src={Icon} height={48} className="my-10" alt=""></Image>
      <Form
        name="normal_login"
        style={{ minWidth: 400 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="float-right " href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full ">
            Log in
          </Button>
          Or <Link href="/register">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
