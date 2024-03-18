"use client";
import {
  cssColors,
  editTools,
  fileType,
  formats,
  headers,
  listOptions,
} from "../../../../constants/random";
import { useEffect, useMemo, useState } from "react";
import "react-quill/dist/quill.snow.css";
import "../../../../utils/styles/package.module.css";
import axios, { AxiosResponse } from "axios";
import dynamic from "next/dynamic";
import Hyperlink from "../../../../../public/general/Hyperlink.svg";
import Picture from "../../../../../public/general/Picture.svg";
import Unsplash from "../../../../../public/general/Unsplash.svg";
import Document from "../../../../../public/general/Document.svg";
import YouTube from "../../../../../public/general/YouTube.svg";
import Remove from "../../../../../public/general/Remove.svg";
import Close from "../../../../../public/general/Close.svg";
import Bot from "../../../../../public/general/Bot.svg";
import Plus from "../../../../../public/general/Plus.svg";
import Save from "../../../../../public/general/Save.svg";
import Image from "next/image";
import { AntAlertProps, BlogItem } from "@/utils/types/state";
import { usePathname, useRouter } from "next/navigation";
import AntUpload from "@/components/shared/atomic/AntUpload";
import AntAlert from "@/components/shared/atomic/AntAlert";
import { useSession } from "next-auth/react";
import AntSearchInput from "@/components/shared/atomic/AntSearchInput";
import React from "react";
import NumberInput from "@/components/shared/atomic/AntNumberInput";
import AntButton from "@/components/shared/atomic/AntButton";

const modules = {
  toolbar: {
    container: [
      [{ header: headers }],
      editTools,
      [{ color: cssColors }],
      listOptions,
      ["link"],
      ["clean"],
    ],
  },
};
const { GIF, JPG, SVG, PNG } = fileType;

export default function EditBlog() {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [],
  );
  const [alert, setAlert] = useState<AntAlertProps>({
    message: "",
    description: "",
    type: "error",
    isShowIcon: true,
    handleClick: () => {},
  });
  const [isAlert, setIsAlert] = useState(false);
  const [blog, setBlog] = useState<BlogItem[]>([]);
  const [text, setText] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [isDoc, setIsDoc] = useState(false);
  const [isPic, setIsPic] = useState(false);
  const [isUnSplash, setIsUnSplash] = useState(false);
  const [searchUnSplash, setSearchUnSplash] = useState("");
  const [unsplashImages, setUnsplashImages] = useState([]);
  const [img, setImg] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [url, setUrl] = useState("");
  const [isUrl, setIsUrl] = useState(false);
  // const [isCode, setIsCode] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [ai, setAI] = useState("");
  // const [code, setCode] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const pathname = usePathname();
  const { data: session } = useSession();
  const path = pathname.split("/");
  const endPath = path[path?.length - 1];
  const router = useRouter();
  const handleClick = () => setIsAlert(false);
  const updateBlog = async (data: string, type: string) => {
    const payload: { [key: string]: string } = {};
    payload[type] = data;
    const response = await axios.put<AxiosResponse>(
      `http://localhost:3000/api/blog/${endPath}`,
      { author: session?.user?.id, ...payload },
    );
    return response?.data?.data;
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

  const handleUnSplashChange = (value: string) => {
    setSearchUnSplash(value);
  };

  const handleVideoLink = (value: string) => {
    setVideoLink(value);
  };
  const handleUrl = (value: string) => {
    setUrl(value);
  };

  // const handleCode = (value: string) => {
  //   setCode(value);
  // };

  const handleAI = (value: string) => {
    setAI(value);
  };

  const handleSaveAI = () => {};

  const isOpenTool = (tool: string) => {
    setEdit(false);
    if (tool === "document") setIsDoc(true);
    else setIsDoc(false);
    if (tool === "image") setIsPic(true);
    else setIsPic(false);
    if (tool === "unsplash") setIsUnSplash(true);
    else setIsUnSplash(false);
    if (tool === "video") setIsVideo(true);
    else setIsVideo(false);
    if (tool === "url") setIsUrl(true);
    else setIsUrl(false);
    // if (tool === "code") setIsCode(true);
    // else setIsCode(false);
    if (tool === "ai") setIsAI(true);
    else setIsAI(false);
  };

  const handleRemove = () => {
    setIsAlert(false);
    setText("");
    setImg("");
    setIsDoc(false);
    setIsUnSplash(false);
    setIsPic(false);
    setSearchUnSplash("");
    setUnsplashImages([]);
    setVideoLink("");
    setIsVideo(false);
    setIsUrl(false);
    // setIsCode(false);
    // setCode("");
    setIsAI(false);
    setAI("");
  };

  const handleSave = async (tool: string) => {
    let response = [];
    try {
      if (tool === "document") {
        const trimmedText = text.trim();
        if (!trimmedText) {
          setEdit(false);
          setAlert({
            message: "Document missing",
            description: "Please write appropriate content for your blog.",
            type: "error",
            isShowIcon: true,
            handleClick,
          });
          setIsAlert(true);
        } else {
          setIsAlert(false);
          await updateBlog(trimmedText, "html");
        }
      } else if (tool === "image" || tool === "unsplash") {
        const trimmedImg = img.trim();
        if (!trimmedImg) {
          setEdit(false);
          setAlert({
            message: "Image missing",
            description: "Please add appropriate image for your blog.",
            type: "error",
            isShowIcon: true,
            handleClick,
          });
          setIsAlert(true);
        } else {
          setIsAlert(false);
          response = await updateBlog(trimmedImg, "image");
          setBlog(response?.content);
        }
      } else if (tool === "video") {
        const trimmedVideoLink = videoLink.trim();
        if (!trimmedVideoLink) {
          setEdit(false);
          setAlert({
            message: "Video Link Missing",
            description: "Please add appropriate video link for your blog.",
            type: "error",
            isShowIcon: true,
            handleClick,
          });
          setIsAlert(true);
        } else {
          setIsAlert(false);
          const response = await updateBlog(trimmedVideoLink, "video");
          setBlog(response?.content);
        }
      } else if (tool === "url") {
        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
          setEdit(false);
          setAlert({
            message: "URL Missing",
            description: "Please add appropriate URL for your blog.",
            type: "error",
            isShowIcon: true,
            handleClick,
          });
          setIsAlert(true);
        } else {
          setIsAlert(false);
          const response = await updateBlog(trimmedUrl, "url");
          setBlog(response?.content);
        }
      }
      // else if (tool === "code") {
      //   const trimmedCode = code.trim();
      //   if (!trimmedCode) {
      //     setEdit(false);
      //     setAlert({
      //       message: "Code Content Missing",
      //       description: `Please add appropriate code for your blog.`,
      //       type: "error",
      //       isShowIcon: true,
      //       handleClick,
      //     });
      //     setIsAlert(true);
      //   } else {
      //     setIsAlert(false);
      //     const response = await updateBlog(trimmedCode, "code");
      //     setBlog(response?.content);
      //   }
      // }
      else if (tool === "ai") {
        const trimmedAI = ai.trim();
        if (!trimmedAI) {
          setEdit(false);
          setAlert({
            message: "AI Content Missing",
            description: `Please add appropriate prompt for generating text for your blog.`,
            type: "error",
            isShowIcon: true,
            handleClick,
          });
          setIsAlert(true);
        } else {
          setIsAlert(false);
          const AIresponse = await axios.post<AxiosResponse>(
            `http://localhost:3000/api/blog/ai`,
            {
              question: ai,
            },
          );
          setIsAlert(false);
          const response = await updateBlog(
            `<div>${AIresponse?.data?.data}</div>`,
            "html",
          );
          setBlog(response?.content);
        }
      }
      setEdit(false);
      setIsAlert(false);
      setText("");
      setImg("");
      setIsUrl(false);
      setUrl("");
      setIsDoc(false);
      setIsUnSplash(false);
      setIsPic(false);
      setVideoLink("");
      setIsVideo(false);
      setSearchUnSplash("");
      // setIsCode(false);
      // setCode("");
      setUnsplashImages([]);
    } catch (error) {
      setEdit(false);
      setAlert({
        message: "File Saving Error",
        description: "Having issue in severs, please try later.",
        type: "error",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    }
  };

  const ActionButtons = ({ tool }: { tool: string }) => {
    return (
      <div style={{ width: "500px" }} className="flex justify-around">
        <Image
          className="cursor-pointer"
          width={30}
          height={30}
          src={Save}
          alt="save"
          onClick={() => handleSave(tool)}
        />
        <Image
          className="cursor-pointer"
          width={30}
          height={30}
          src={Remove}
          alt="remove"
          onClick={() => handleRemove()}
        />
      </div>
    );
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blog/${endPath}`);
        if (!response?.data?.data)
          throw new Error("Response data from backend is missing");
        setBlog(response?.data?.data);
      } catch (error) {
        router.back();
      }
    };
    fetchBlog();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/blog/${endPath}`, {
        readingTime,
      });
      if (!response?.data?.data) throw new Error("Sever Error");
      setAlert({
        message: "Blog Created",
        description: "Your new blog published successfully.",
        type: "success",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    } catch (error) {
      setAlert({
        message: "server Error",
        description: `Having issue in severs, please try later.${blog}`,
        type: "error",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    }
  };

  return (
    <>
      {alert?.message && isAlert && <AntAlert {...alert} />}
      <div className="flex">
        {isEdit ? (
          <Image
            className="cursor-pointer"
            width={30}
            height={30}
            src={Close}
            alt="ImageSelect"
            onClick={() => setEdit(false)}
          />
        ) : (
          <Image
            className="cursor-pointer"
            width={25}
            height={25}
            src={Plus}
            alt="ImageSelect"
            onClick={() => setEdit(true)}
          />
        )}
        {isEdit && (
          <div className="flex ml-2 bg-white">
            <Image
              className="ml-2 cursor-pointer"
              width={25}
              height={25}
              src={Document}
              alt="ImageSelect"
              onClick={() => isOpenTool("document")}
            />
            <Image
              className="ml-2 cursor-pointer"
              width={25}
              height={25}
              src={Picture}
              alt="ImageSelect"
              onClick={() => isOpenTool("image")}
            />
            <Image
              className="ml-2 cursor-pointer"
              width={32}
              height={32}
              src={Unsplash}
              alt="Unsplash"
              onClick={() => isOpenTool("unsplash")}
            />
            <Image
              className="ml-2 cursor-pointer"
              width={36}
              height={36}
              src={YouTube}
              alt="YouTube"
              onClick={() => isOpenTool("video")}
            />
            <Image
              className="ml-2 cursor-pointer"
              width={25}
              height={25}
              src={Hyperlink}
              alt="Hyperlink"
              onClick={() => isOpenTool("url")}
            />
            {/* <Image
              className="ml-2 mr-2 cursor-pointer"
              width={28}
              height={28}
              src={Code}
              alt="Code"
              onClick={() => isOpenTool("code")}
            /> */}
            <Image
              className="ml-2 mr-2 cursor-pointer"
              width={28}
              height={28}
              src={Bot}
              alt="Code"
              onClick={() => isOpenTool("ai")}
            />
          </div>
        )}
      </div>
      {!isEdit && isDoc ? (
        <>
          <div className="flex mb-3">
            <ReactQuill
              style={{ width: "500px", border: "2px solid grey" }}
              className="ql-container"
              formats={formats}
              modules={modules}
              theme="snow"
              value={text}
              onChange={(text) =>
                setText(() => {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(text, "text/html");
                  const lastImgElement = doc.querySelector("img:last-child");
                  if (lastImgElement) {
                    lastImgElement.remove();
                  }
                  return doc.body.innerHTML;
                })
              }
              placeholder="write something here..."
            />
          </div>
          <ActionButtons tool={"document"} />
        </>
      ) : isPic ? (
        <>
          <AntUpload
            setImage={setImg}
            type={[GIF, JPG, SVG, PNG]}
            maxCount={1}
          />
          <ActionButtons tool={"image"} />
        </>
      ) : isUnSplash ? (
        <>
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
              onClick={() => setImg(url)}
              src={url}
              alt={searchUnSplash}
              width={100}
              height={100}
            />
          ))}
          <ActionButtons tool={"unsplash"} />
        </>
      ) : isVideo ? (
        <>
          <AntSearchInput
            placeholder="Paste your video link"
            buttonName="Submit"
            size="large"
            handleClick={() => {}}
            handleChange={handleVideoLink}
            allowClear={true}
            isLoading={true}
          />
          <ActionButtons tool={"video"} />
        </>
      ) : isUrl ? (
        <>
          <AntSearchInput
            placeholder="Paste your URL"
            buttonName="Save"
            size="large"
            handleClick={() => {}}
            handleChange={handleUrl}
            allowClear={true}
            isLoading={true}
          />
          <ActionButtons tool={"url"} />
        </>
      ) : // ) : isCode ? (
      //   <>
      //     <AntSearchInput
      //       placeholder="Paste your URL"
      //       buttonName="Save"
      //       size="large"
      //       handleClick={() => {}}
      //       handleChange={handleCode}
      //       allowClear={true}
      //       isLoading={true}
      //     />
      //     <ActionButtons tool={"code"} />
      //   </>
      isAI ? (
        <>
          <AntSearchInput
            placeholder="Message to AI"
            buttonName="Save"
            size="large"
            handleClick={handleSaveAI}
            handleChange={handleAI}
            count={true}
            allowClear={true}
            isLoading={true}
          />
          <ActionButtons tool={"ai"} />
        </>
      ) : (
        <></>
      )}
      <>
        <NumberInput
          value={readingTime}
          handleChange={setReadingTime}
          maxLength={2}
          placeholder="Reading Time"
        />
        <AntButton handleSubmit={handleSubmit} />
      </>
    </>
  );
}
