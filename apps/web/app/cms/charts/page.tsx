"use client";

import { Button, Card, Table, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

const { Title } = Typography;

type ChartRow = {
  id: string;
  createdAt: string;
  fullName: string;
  gender: string;
  viewingYear: number;
};

const CmsChartsPage = () => {
  const [data, setData] = useState<ChartRow[]>([]);

  const fetchCharts = async () => {
    const response = await fetch("/api/cms/charts");
    const payload = await response.json();
    setData(payload.items ?? []);
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  return (
    <Card>
      <Title level={3}>Danh sách lá số</Title>
      <Table
        rowKey="id"
        dataSource={data}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Họ tên", dataIndex: "fullName" },
          { title: "Giới tính", dataIndex: "gender" },
          { title: "Năm xem hạn", dataIndex: "viewingYear" },
          {
            title: "Chi tiết",
            render: (_, record) => (
              <Link href={`/cms/charts/${record.id}`}>Xem</Link>
            )
          }
        ]}
      />
      <Button href="/cms/prompts">Quản lý Prompt</Button>
    </Card>
  );
};

export default CmsChartsPage;
