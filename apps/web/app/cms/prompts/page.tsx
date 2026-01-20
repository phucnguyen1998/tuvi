"use client";

import { Button, Card, Form, Input, Table, Typography } from "antd";
import { useEffect, useState } from "react";

const { Title } = Typography;

const CmsPromptsPage = () => {
  const [items, setItems] = useState([]);

  const fetchPrompts = async () => {
    const response = await fetch("/api/cms/prompt-templates");
    const payload = await response.json();
    setItems(payload.items ?? []);
  };

  const onFinish = async (values: Record<string, string>) => {
    await fetch("/api/cms/prompt-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    fetchPrompts();
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  return (
    <Card>
      <Title level={3}>Prompt Templates</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="version" label="Version" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="system" label="System Prompt" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="user" label="User Prompt" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Tạo phiên bản
        </Button>
      </Form>
      <Table
        rowKey="id"
        dataSource={items}
        style={{ marginTop: 24 }}
        columns={[
          { title: "Version", dataIndex: "version" },
          { title: "Title", dataIndex: "title" },
          { title: "Created", dataIndex: "createdAt" }
        ]}
      />
    </Card>
  );
};

export default CmsPromptsPage;
