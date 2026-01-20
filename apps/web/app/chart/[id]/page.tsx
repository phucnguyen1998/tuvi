"use client";

import { Button, Card, Col, Divider, Row, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import sanitizeHtml from "sanitize-html";

const { Title, Paragraph } = Typography;

type ChartSnapshot = {
  id: string;
  fullName: string;
  gender: string;
  solarDate: string;
  lunarDate: string;
  hour: string;
  viewingYear: number;
  menhElement: string;
  menhCuc: string;
  thanPosition: string;
  palaces: {
    key: string;
    label: string;
    diaChi: string;
    mainStars: string[];
    subStars: string[];
    notes: string;
  }[];
  skeletonNote: string;
};

type Reading = {
  id: string;
  status: "pending" | "running" | "done" | "failed";
  content?: string | null;
  errorMessage?: string | null;
};

const ChartPage = ({ params }: { params: { id: string } }) => {
  const [snapshot, setSnapshot] = useState<ChartSnapshot | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchChart = async () => {
    const response = await fetch(`/api/charts/${params.id}`);
    if (response.ok) {
      const payload = await response.json();
      setSnapshot(payload.snapshot);
    }
  };

  const createReading = async () => {
    setLoading(true);
    const response = await fetch(`/api/charts/${params.id}/ai-readings`, { method: "POST" });
    const payload = await response.json();
    setReading(payload);
    setLoading(false);
  };

  const pollReading = async (readingId: string) => {
    const response = await fetch(`/api/readings/${readingId}`);
    if (response.ok) {
      const payload = await response.json();
      setReading(payload);
    }
  };

  useEffect(() => {
    fetchChart();
  }, []);

  useEffect(() => {
    if (!reading || reading.status === "done" || reading.status === "failed") {
      return undefined;
    }

    const timer = setInterval(() => {
      pollReading(reading.id);
    }, 3000);

    return () => clearInterval(timer);
  }, [reading]);

  if (!snapshot) {
    return <Spin />;
  }

  const sanitizedContent = sanitizeHtml(reading?.content ?? "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3", "h4"])
  });

  return (
    <div>
      <Title level={3}>{snapshot.fullName}</Title>
      <Paragraph>
        {snapshot.gender} • {snapshot.solarDate} (Âm: {snapshot.lunarDate}) • {snapshot.hour} • Năm xem hạn: {snapshot.viewingYear}
      </Paragraph>
      <Card className="section-card">
        <Title level={4}>Bàn 12 cung</Title>
        <div className="chart-grid">
          {snapshot.palaces.map((palace) => (
            <Card key={palace.key} size="small" className="chart-card">
              <Title level={5}>{palace.label}</Title>
              <Paragraph>Địa chi: {palace.diaChi}</Paragraph>
              <Paragraph>Sao chính: {palace.mainStars.join(", ")}</Paragraph>
              <Paragraph>Sao phụ: {palace.subStars.join(", ") || "-"}</Paragraph>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="section-card">
        <Title level={4}>Luận giải chi tiết từng cung</Title>
        <Row gutter={[12, 12]}>
          {snapshot.palaces.map((palace) => (
            <Col span={6} key={palace.key}>
              <Card size="small">
                <Title level={5}>{palace.label}</Title>
                <Paragraph>{palace.notes}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card className="section-card">
        <Title level={4}>Luận giải tổng quan (AI)</Title>
        <Paragraph>{snapshot.skeletonNote}</Paragraph>
        <Button type="primary" onClick={createReading} loading={loading}>
          Bắt đầu luận giải
        </Button>
        <Divider />
        {!reading && <Paragraph>Chưa có luận giải.</Paragraph>}
        {reading && reading.status !== "done" && (
          <Paragraph>Trạng thái: {reading.status}</Paragraph>
        )}
        {reading?.status === "failed" && (
          <Paragraph>Thất bại: {reading.errorMessage}</Paragraph>
        )}
        {reading?.status === "done" && (
          <ReactMarkdown>{sanitizedContent}</ReactMarkdown>
        )}
      </Card>
    </div>
  );
};

export default ChartPage;
