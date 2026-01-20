"use client";

import { Button, Card, Descriptions, Table, Typography } from "antd";
import { useEffect, useState } from "react";

const { Title } = Typography;

type ChartDetail = {
  id: string;
  createdAt: string;
  input: {
    fullName: string;
    gender: string;
    viewingYear: number;
  };
  readings: {
    id: string;
    status: string;
    createdAt: string;
    promptVersion?: string | null;
  }[];
};

const CmsChartDetailPage = ({ params }: { params: { id: string } }) => {
  const [detail, setDetail] = useState<ChartDetail | null>(null);

  const fetchDetail = async () => {
    const response = await fetch(`/api/cms/charts/${params.id}`);
    const payload = await response.json();
    setDetail(payload);
  };

  const rerun = async () => {
    await fetch(`/api/cms/charts/${params.id}/rerun-reading?promptVersion=v1`, { method: "POST" });
    fetchDetail();
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (!detail) {
    return null;
  }

  return (
    <Card>
      <Title level={3}>Chi tiết lá số</Title>
      <Descriptions bordered>
        <Descriptions.Item label="ID">{detail.id}</Descriptions.Item>
        <Descriptions.Item label="Họ tên">{detail.input.fullName}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{detail.input.gender}</Descriptions.Item>
        <Descriptions.Item label="Năm xem hạn">{detail.input.viewingYear}</Descriptions.Item>
      </Descriptions>
      <Button onClick={rerun} style={{ marginTop: 16 }}>
        Chạy lại luận giải (v1)
      </Button>
      <Title level={4} style={{ marginTop: 24 }}>
        Lịch sử luận giải
      </Title>
      <Table
        rowKey="id"
        dataSource={detail.readings}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Trạng thái", dataIndex: "status" },
          { title: "Prompt", dataIndex: "promptVersion" },
          { title: "Ngày tạo", dataIndex: "createdAt" }
        ]}
      />
    </Card>
  );
};

export default CmsChartDetailPage;
