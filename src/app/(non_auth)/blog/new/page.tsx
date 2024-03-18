"use client";
import AntAlert from "@/components/shared/atomic/AntAlert";
import AntButton from "@/components/shared/atomic/AntButton";
import AntSearchInput from "@/components/shared/atomic/AntSearchInput";
import AntSelect from "@/components/shared/atomic/AntSelect";
import AntTextArea from "@/components/shared/atomic/AntTextArea";
import AntUpload from "@/components/shared/atomic/AntUpload";
import { fileType } from "@/constants/random";
import {
  AntAlertProps,
  SelectStateProps,
  TopicItem,
} from "@/utils/types/state";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const BlogDetails = () => {
  const [topics, setTopics] = useState<SelectStateProps[]>([
    { value: "", label: "" },
  ]);
  const [topic, setTopic] = useState("");
  const [heading, setHeading] = useState("");
  const [bannerImg, setBannerImg] = useState("");
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
  const { data: session } = useSession();
  const router = useRouter();
  const { GIF, JPG, SVG, PNG } = fileType;

  useEffect(() => {
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
      } catch (error) {
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
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog`,
          { heading, topic, bannerImg, author: session?.user?.id },
        );
        router.push(`/blog/new${response?.data?.data?._id}`);
      } catch (error) {
        throw new Error(JSON.stringify(error));
      }
    }
  };

  const handleUnSplashChange = (value: string) => {
    setSearchUnSplash(value);
  };

  const handleUnSplashSearch = async () => {
    const trimmedSearch = searchUnSplash.trim();
    if (trimmedSearch) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog/image?search=${trimmedSearch}&page=1&per_page=9`,
        );
        setUnsplashImages(response?.data?.data?.imgLinks);
      } catch (error) {
        throw new Error(JSON.stringify(error));
      }
    }
  };

  return (
    <>
      {topics.length > 0 ? (
        <div>
          <AntSelect
            setTopic={setTopic}
            options={topics}
            placeholder={"Select your topic"}
          />
          <AntTextArea
            setHeading={setHeading}
            placeholder="Add Your Blog Heading"
          />
          <AntUpload
            setImage={setBannerImg}
            type={[GIF, JPG, SVG, PNG]}
            maxCount={1}
          />
          <AntSearchInput
            placeholder="Search Unsplash Images"
            buttonName="Search"
            size="large"
            handleClick={handleUnSplashSearch}
            handleChange={handleUnSplashChange}
            allowClear={true}
            isLoading={true}
          />
          {unsplashImages.map((url: string, idx: number) => (
            <Image
              key={idx}
              onClick={() => setBannerImg(url)}
              src={url}
              alt={searchUnSplash}
              width={100}
              height={100}
            />
          ))}
          {session?.user?.id && (
            <AntButton
              name="Create New Blog"
              type="primary"
              handleSubmit={handleSubmit}
            />
          )}
          {alert?.message && isAlert && <AntAlert {...alert} />}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default BlogDetails;
