"use client";

import { Button, Card, Col, Form, Input, Radio, Row, Select, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

const days = Array.from({ length: 31 }, (_, i) => ({ label: i + 1, value: i + 1 }));
const months = Array.from({ length: 12 }, (_, i) => ({ label: i + 1, value: i + 1 }));
const years = Array.from({ length: 80 }, (_, i) => 1950 + i).map((y) => ({ label: y, value: y }));
const viewingYears = Array.from({ length: 30 }, (_, i) => 2024 + i).map((y) => ({ label: y, value: y }));

const HomePage = () => {
  const router = useRouter();

  const onFinish = async (values: Record<string, unknown>) => {
    const response = await fetch("/api/charts/compute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const payload = await response.json();
    if (response.ok) {
      router.push(`/chart/${payload.id}`);
    }
  };

  return (
    <Row justify="center">
      <Col xs={24} md={16} lg={12}>
        <Card>
          <Title level={3} style={{ textAlign: "center" }}>
            Lập Lá Số Tử Vi
          </Title>
          <Paragraph style={{ textAlign: "center" }}>
            Nhập thông tin để tạo lá số và luận giải tổng quan.
          </Paragraph>
          <Form layout="vertical" onFinish={onFinish} initialValues={{ calendarType: "solar", gender: "male" }}>
            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính">
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="calendarType" label="Thời điểm sinh">
              <Radio.Group>
                <Radio value="lunar">Âm lịch</Radio>
                <Radio value="solar">Dương lịch</Radio>
              </Radio.Group>
            </Form.Item>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item name="day" label="Ngày" rules={[{ required: true }]}
                >
                  <Select options={days} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="month" label="Tháng" rules={[{ required: true }]}>
                  <Select options={months} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="year" label="Năm" rules={[{ required: true }]}>
                  <Select options={years} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="hour" label="Giờ" rules={[{ required: true }]}>
                  <Select options={Array.from({ length: 24 }, (_, i) => ({ label: i, value: i }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="minute" label="Phút" rules={[{ required: true }]}>
                  <Select options={Array.from({ length: 60 }, (_, i) => ({ label: i, value: i }))} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="viewingYear" label="Năm xem hạn" rules={[{ required: true }]}>
              <Select options={viewingYears} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lập lá số
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default HomePage;
