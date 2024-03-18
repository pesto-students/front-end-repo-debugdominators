import React, { useEffect, useState } from "react";
import AntSpin from "@/components/shared/atomic/AntSpin";
import { Button, Image, Layout, Row, Typography } from "antd";
const { Content } = Layout;
import axios from "axios";
import { BlogProps } from "@/utils/types/state";
import { findHowmanyDaysBefore } from "@/utils/helpers/methods";

const GeneralBlogs = () => {
  const [blogs, setBlogs] = useState<BlogProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [remainCount, setRemainCount] = useState(10);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/dashboard?page=${page}&per_page=10`,
      );
      if (!res.data) {
        throw new Error("Failed to fetch data");
      }
      const response = res?.data?.data;
      setRemainCount(response?.remain_count);
      setBlogs((prevData) => {
        const lastPrevDataId = prevData?.[prevData.length - 1]?._id;
        const lastResponseId =
          response?.blogs?.[response.blogs.length - 1]?._id;
        if (!prevData || prevData.length === 0) {
          return [...(response?.blogs || [])];
        } else if (lastPrevDataId !== lastResponseId) {
          return [...prevData, ...(response?.blogs || [])];
        }
        return [...prevData];
      });
      setLoading(false);
      return res.data?.data?.blogs;
    }
    if (remainCount >= 10) getData();

    const handleScroll = () => {
      if (
        window.innerHeight + Math.ceil(document.documentElement.scrollTop) ===
          document.documentElement.offsetHeight ||
        window.innerHeight +
          parseInt(`${document.documentElement.scrollTop}`) ===
          document.documentElement.offsetHeight
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);
  return (
    <div className="mb-5">
      {blogs?.map((blog: BlogProps, index: number) => (
        <Row key={index}>
          <Content className="">
            <Content>
              <Image
                style={{
                  borderRadius: "0 100px 0 0",
                  width: "800px",
                  height: "300px",
                  margin: "10px 0",
                }}
                src={blog?.bannerImg}
                alt="Your Alt Text"
              />
            </Content>

            <Typography.Text>{blog?.topic}</Typography.Text>
            <Typography.Title className="text-2xl">
              {blog?.heading}
            </Typography.Title>
            <Typography.Text className="font-semibold">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    blog?.content.length > 500
                      ? `${blog?.content.slice(0, 500)}...`
                      : `${blog?.content}...`,
                }}
              />
            </Typography.Text>
            <Content className="  d-flex   flex items-center mt-5 mb-10 ">
              <Image
                className="border-2 border-slate-800 mr-3 max-h-10 max-w-10"
                src={blog?.author?.image}
                alt="profile-image"
              />
              <Typography.Text className="">
                {blog?.author?.name}
              </Typography.Text>
              <span className="text-slate-800 font-bold m-2">•</span>

              <Typography.Text className="">
                {blog?.readingTime} minute read
              </Typography.Text>
              <span className="text-slate-800 font-bold m-2">•</span>

              <Typography.Text className="">
                {findHowmanyDaysBefore(blog?.updatedAt)}
              </Typography.Text>
            </Content>
            <Button
              type="text"
              className="border-2 border-slate-700 w-full mb-8"
              block
            >
              Read More
            </Button>
          </Content>
        </Row>
      ))}
      {loading && <AntSpin />}
    </div>
  );
};

export default GeneralBlogs;
