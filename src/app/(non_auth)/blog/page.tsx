"use client";
import AntAlert from "@/components/shared/atomic/AntAlert";
import AntSearchInput from "@/components/shared/atomic/AntSearchInput";
import AntSelect from "@/components/shared/atomic/AntSelect";
import AntSpin from "@/components/shared/atomic/AntSpin";
import AntTextArea from "@/components/shared/atomic/AntTextArea";
import AntUpload from "@/components/shared/atomic/AntUpload";
import { fileType } from "@/constants/random";
import {
  AntAlertProps,
  SelectStateProps,
  TopicItem,
} from "@/utils/types/state";
import { StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import { Col, Row, Tooltip } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BlogDetails = () => {
  const searchParams = useSearchParams();
  const queryImg = searchParams.get("img");
  const queryHeading = searchParams.get("heading");
  const queryTopic = searchParams.get("topic");
  const blogId = searchParams.get("blog_id");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<SelectStateProps[]>([
    { value: "", label: "" },
  ]);
  const [topic, setTopic] = useState(queryTopic ? queryTopic : "");
  const [heading, setHeading] = useState(queryHeading ? queryHeading : "");
  const [bannerImg, setBannerImg] = useState(queryImg ? queryImg : "");
  const [alert, setAlert] = useState<AntAlertProps>({
    message: "",
    description: "",
    type: "error",
    isShowIcon: true,
    handleClick: () => {},
  });
  const [isAlert, setIsAlert] = useState(false);
  const [searchUnSplash, setSearchUnSplash] = useState("");
  const [unsplashImages, setUnsplashImages] = useState([]);
  const [unsplashPage, setUnsplashPage] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();
  const { GIF, JPG, SVG, PNG } = fileType;

  useEffect(() => {
    setLoading(true);
    const cancelTokenSource = axios.CancelToken.source();
    const fetchTopics = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog/topic`,
        );
        const topicData: SelectStateProps[] = response?.data?.data.map(
          (elem: TopicItem) => {
            return { value: elem?.topic, label: elem?.topic };
          },
        );
        setTopics(topicData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw new Error("axios service error");
      }
    };
    fetchTopics();
    return () => cancelTokenSource.cancel("Component unmounted");
  }, []);

  const handleClick = () => setIsAlert(false);

  const handleSubmit = async () => {
    const trimmedTopic = topic.trim();
    const trimmedHeading = heading.trim();
    const trimmedBannerImg = bannerImg.trim();

    if (!trimmedHeading) {
      setAlert({
        message: "Heading missing",
        description: "Please write appropriate heading for your blog.",
        type: "error",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    } else if (!trimmedTopic) {
      setAlert({
        message: "Topic missing",
        description: "Please add a topic related to your blog.",
        type: "error",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    } else if (!trimmedBannerImg) {
      setAlert({
        message: "Banner image missing",
        description: "Please choose a banner image for your blog.",
        type: "error",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    } else {
      try {
        setLoading(true);
        let response = null;
        if (blogId) {
          response = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog/${blogId}`,
            { heading, topic, bannerImg, author: session?.user?.id },
          );
        } else {
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog`,
            { heading, topic, bannerImg, author: session?.user?.id },
          );
        }
        router.push(`/blog/${response?.data?.data?._id}`);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw new Error(JSON.stringify(error));
      }
    }
  };

  const handleUnSplashChange = (value: string) => {
    setSearchUnSplash(value);
  };

  const handleUnSplashSearch = async (page: undefined | number = 1) => {
    setLoading(true);
    const trimmedSearch = searchUnSplash.trim();
    if (trimmedSearch) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog/image?search=${trimmedSearch}&page=${page}&per_page=9`,
        );
        setUnsplashImages(response?.data?.data?.imgLinks);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw new Error(JSON.stringify(error));
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="mt-5">
          <AntSpin size="large" />
        </div>
      ) : (
        <div className="w-3/5 mx-auto">
          <h1
            style={{
              margin: "30px 0px 50px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "26px",
            }}
          >
            Add your Blog here
          </h1>
          {topics.length > 0 ? (
            <>
              <div className="flex justify-between w-100 mt-16 flex-col md:flex-row">
                <div className="w-50">
                  <p className="font-bold mb-5 text-gray-700">
                    Add Your Blog Heading
                  </p>
                  <AntTextArea
                    value={heading}
                    setHeading={setHeading}
                    placeholder="Add Your Blog Heading"
                  />
                </div>
                <div className="w-50 mt-5 md:mt-0">
                  <p className="font-bold mb-5 text-gray-700">
                    Select your topic
                  </p>
                  <div>
                    <AntSelect
                      value={topic}
                      setTopic={setTopic}
                      options={topics}
                      placeholder={"Select your topic"}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between w-100 mt-16 mb-5 flex-col md:flex-row">
                {!searchUnSplash && (
                  <div className="w-50">
                    <p className="font-bold mb-5 text-gray-700">
                      Add Your Banner Image From Local
                    </p>
                    <AntUpload
                      value={bannerImg}
                      setImage={setBannerImg}
                      type={[GIF, JPG, SVG, PNG]}
                      maxCount={1}
                    />
                  </div>
                )}
                {!bannerImg && (
                  <div className="w-50  mt-5 md:mt-0">
                    <p className="font-bold mb-5 text-gray-700">
                      Add Your Banner Image From Unsplash
                    </p>
                    <AntSearchInput
                      placeholder="Search Unsplash Images"
                      buttonName="Search"
                      size="large"
                      handleClick={handleUnSplashSearch}
                      handleChange={handleUnSplashChange}
                      allowClear={true}
                      isLoading={true}
                    />
                  </div>
                )}
              </div>
              {unsplashImages && searchUnSplash && (
                <>
                  <Row className="bg-gray-100 m-2">
                    {unsplashImages.map((url: string, idx: number) => (
                      <>
                        <Col span={4} offset={4} className="p-2">
                          <Image
                            key={idx}
                            onClick={() => setBannerImg(url)}
                            src={url}
                            alt={searchUnSplash}
                            width={100}
                            height={100}
                          />
                        </Col>
                      </>
                    ))}
                  </Row>
                  {unsplashImages.length > 0 && (
                    <Row className="flex justify-center">
                      {unsplashPage > 1 && (
                        <Tooltip title="Previous">
                          <StepBackwardOutlined
                            onClick={() => {
                              setUnsplashPage(unsplashPage - 1);
                              handleUnSplashSearch(unsplashPage - 1);
                            }}
                            style={{ fontSize: "30px" }}
                          />
                        </Tooltip>
                      )}
                      <Tooltip title="Next" className="ml-5">
                        <StepForwardOutlined
                          onClick={() => {
                            setUnsplashPage(unsplashPage + 1);
                            handleUnSplashSearch(unsplashPage + 1);
                          }}
                          style={{ fontSize: "30px" }}
                        />
                      </Tooltip>
                    </Row>
                  )}
                </>
              )}
              {alert?.message && isAlert && <AntAlert {...alert} />}
              <div style={{ textAlign: "right", marginTop: "50px" }}>
                <button
                  style={{
                    marginRight: "10px",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: "#fff",
                    color: "#333",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </button>
                {session?.user?.id && (
                  <button
                    style={{
                      padding: "8px 16px",
                      borderRadius: "4px",
                      border: "none",
                      background: "#1890ff",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={handleSubmit}
                  >
                    {blogId ? "Update Your Blog" : "Create Your Blog"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default BlogDetails;
