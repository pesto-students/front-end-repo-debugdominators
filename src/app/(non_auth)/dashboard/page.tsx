"use client";
import { Typography } from "antd";
import { Col, Row } from "antd";
import { Layout } from "antd";
import { useEffect, useState } from "react";
import GeneralBlogs from "@/components/non_auth/dashboard/GeneralBlogs";
import StaffPickBlogs from "@/components/non_auth/dashboard/StaffPickBlogs";
const { Content } = Layout;

export default function Dashboard() {
  const [innerWidth, setInnerWidth] = useState(0);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    const handleResize = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Content className="container mx-auto mt-5">
      <div className="ml-5 mb-5">
        <Typography.Text className="text-5xl font-mono font-medium">
          HANDPICKED BLOGS FOR YOU
        </Typography.Text>
      </div>
      <Row className="ml-5 mr-5">
        <Col className="" span={innerWidth > 768 ? 12 : 24}>
          <GeneralBlogs />
        </Col>

        <Col span={innerWidth > 768 ? 2 : 0}></Col>
        <Col className="" span={innerWidth > 768 ? 10 : 0}>
          <StaffPickBlogs innerWidth={innerWidth} />
        </Col>
      </Row>
    </Content>
  );
}
