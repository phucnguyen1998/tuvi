"use client";

import { Button, Card, Form, Input, Typography } from "antd";
import { signIn } from "next-auth/react";

const { Title } = Typography;

const CmsLoginPage = () => {
  const onFinish = async (values: { email: string; password: string }) => {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: "/cms/charts"
    });
  };

  return (
    <Card style={{ maxWidth: 420, margin: "0 auto" }}>
      <Title level={3}>CMS Login</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng nhập
        </Button>
      </Form>
    </Card>
  );
};

export default CmsLoginPage;
