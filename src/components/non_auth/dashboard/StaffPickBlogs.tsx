import { findHowmanyDaysBefore } from "@/utils/helpers/methods";
import { BlogProps } from "@/utils/types/state";
import { Image } from "antd";
import { Divider } from "antd";
import { Typography } from "antd";
import { Col, Row } from "antd";
import { Layout } from "antd";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
const { Content } = Layout;

const StaffPickBlogs = ({ innerWidth }: { innerWidth: number }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    async function getData() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/dashboard?staff_pick=true`,
      );
      if (!res.data) {
        throw new Error("Failed to fetch data");
      }
      setBlogs(res?.data?.data);
    }
    getData();
    return () => cancelTokenSource.cancel("Component unmounted");
  }, []);

  return (
    <div className="fixed">
      {innerWidth >= 768 ? (
        <>
          <Typography.Text className="text-xl font-semibold">
            Staff Picks
          </Typography.Text>
          <Divider className="divide-black-800" />
          {blogs?.map((blog: BlogProps, index) => (
            <button className={`${innerWidth < 1020 && "mb-5"}`} key={index}>
              <Row key={index} className=" h-84  m-3">
                <Col style={{ height: "175px", width: "25%" }} span={9}>
                  <Image
                    style={{ height: "175px", width: "100%" }}
                    className=" rounded-tr-3xl"
                    src={blog?.bannerImg}
                    alt={blog?.heading}
                  />
                </Col>
                <Col span={2}></Col>
                <Col style={{ width: "100%" }} className=" " span={13}>
                  <Content className="mb-3 leading-4 flex-content text-left  max-h-20 ">
                    <Typography.Text className="text-xl font-bold">
                      <Link
                        style={{ textDecoration: "none", color: "inherit" }}
                        href={`${process.env.NEXT_PUBLIC_BASE_PATH}/blog/${blog?._id}`}
                      >
                        {blog?.heading.slice(0, 30)}
                      </Link>
                    </Typography.Text>
                  </Content>
                  <Content className="max-h-32 mb-1 text-left">
                    <Typography className="leading-4 font-semibold text-left">
                      <Link
                        style={{ textDecoration: "none", color: "inherit" }}
                        href={`${process.env.NEXT_PUBLIC_BASE_PATH}/blog/${blog?._id}`}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              blog?.content.length > 120
                                ? `${blog.content.slice(0, 120)}...`
                                : `${blog?.content}...`,
                          }}
                        />
                      </Link>
                    </Typography>
                    <Typography className="mt-5">
                      {blog?.readingTime} min read
                      <span className="text-slate-800 font-bold m-2">•</span>
                      {findHowmanyDaysBefore(blog?.updatedAt)}
                    </Typography>
                  </Content>
                </Col>
              </Row>
            </button>
          ))}
        </>
      ) : null}
      <Divider className="divide-black-800 mt-5" />
    </div>
  );
};

export default StaffPickBlogs;
