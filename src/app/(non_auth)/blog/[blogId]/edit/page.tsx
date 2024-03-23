"use client";
import {
  cssColors,
  editTools,
  fileType,
  formats,
  headers,
  listOptions,
} from "../../../../../constants/random";
import { useEffect, useMemo, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import "../../../../../utils/styles/package.module.css";
import axios, { AxiosResponse } from "axios";
import dynamic from "next/dynamic";
import Hyperlink from "../../../../../../public/general/Hyperlink.svg";
import Picture from "../../../../../../public/general/Picture.svg";
import Unsplash from "../../../../../../public/general/Unsplash.svg";
import Document from "../../../../../../public/general/Document.svg";
import YouTube from "../../../../../../public/general/YouTube.svg";
import Remove from "../../../../../../public/general/Remove.svg";
import Close from "../../../../../../public/general/Close.svg";
import Bot from "../../../../../../public/general/Bot.svg";
import Plus from "../../../../../../public/general/Plus.svg";
import Save from "../../../../../../public/general/Save.svg";
import Image from "next/image";
import {
  AntAlertProps,
  Author,
  BlogContentProps,
  BlogProps,
} from "@/utils/types/state";
import { usePathname, useRouter } from "next/navigation";
import AntUpload from "@/components/shared/atomic/AntUpload";
import AntAlert from "@/components/shared/atomic/AntAlert";
import { useSession } from "next-auth/react";
import AntSearchInput from "@/components/shared/atomic/AntSearchInput";
import React from "react";
import NumberInput from "@/components/shared/atomic/AntNumberInput";
import AntSpin from "@/components/shared/atomic/AntSpin";
import Detail from "@/components/blog/Detail";
import { ObjectId } from "mongodb";
import { Button, Col, Popover, Row, Tooltip } from "antd";
import { StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";

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
  const initialAuthor: Author = {
    _id: "",
    name: "",
    email: "",
    image: "",
  };
  const initialBlog: BlogProps = {
    author: initialAuthor,
    bannerImg: "",
    content: [],
    createdAt: new Date(),
    heading: "",
    isPublished: false,
    readingTime: 5,
    staffPick: false,
    topic: "",
    updatedAt: new Date(),
    _id: "",
  };
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [blog, setBlog] = useState<BlogProps>(initialBlog);
  const [unsplashPage, setUnsplashPage] = useState(1);
  const [loading, setLoading] = useState(false);
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
  const endPath = path[path?.length - 2];
  const router = useRouter();

  const scrollToBottom = () => {
    bottomRef &&
      bottomRef.current &&
      bottomRef.current &&
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleClick = () => setIsAlert(false);

  const updateBlog = async (data: string, type: string) => {
    setLoading(true);
    const payload: { [key: string]: string } = {};
    payload[type] = data;
    try {
      const response = await axios.put<AxiosResponse>(
        `http://localhost:3000/api/blog/${endPath}`,
        { author: session?.user?.id, ...payload },
      );
      setBlog(response?.data?.data);
      setLoading(false);
      setIsAlert(true);
      setAlert({
        message: "Updated",
        description: "Your data updated successfully",
        type: "success",
        isShowIcon: true,
        handleClick,
      });
      setTimeout(() => scrollToBottom(), 1);
    } catch (error) {
      setLoading(false);
      throw new Error(JSON.stringify(error));
    }
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
        setTimeout(() => scrollToBottom(), 1);
      } catch (error) {
        setLoading(false);
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

  const handleSaveAI = async () => {
    setLoading(true);
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
      isOpenTool("document");
      setIsDoc(true);
      setText(`${AIresponse.data?.data}`);
      setLoading(false);
      setTimeout(() => scrollToBottom(), 1);
    }
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
          await updateBlog(trimmedImg, "image");
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
          await updateBlog(trimmedVideoLink, "video");
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
          await updateBlog(trimmedUrl, "url");
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
      // else if (tool === "ai") {
      //   const trimmedAI = ai.trim();
      //   if (!trimmedAI) {
      //     setEdit(false);
      //     setAlert({
      //       message: "AI Content Missing",
      //       description: `Please add appropriate prompt for generating text for your blog.`,
      //       type: "error",
      //       isShowIcon: true,
      //       handleClick,
      //     });
      //     setIsAlert(true);
      //   } else {
      //     setIsAlert(false);
      //     const AIresponse = await axios.post<AxiosResponse>(
      //       `http://localhost:3000/api/blog/ai`,
      //       {
      //         question: ai,
      //       },
      //     );
      //     setIsAlert(false);
      //     await updateBlog(
      //       `<div>${AIresponse?.data?.data}</div>`,
      //       "html",
      //     );
      //   }
      // }
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
    setLoading(true);
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blog/${endPath}`);
        if (!response?.data?.data)
          throw new Error("Response data from backend is missing");
        if (
          session?.user?.id &&
          session?.user?.id !== response?.data?.data?.author?._id
        )
          router.push(`/blog/${endPath}`);
        setBlog(response?.data?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        router.back();
      }
    };
    fetchBlog();
  }, []);

  const handleSubmit = async () => {
    setLoading(false);
    try {
      let response = null;
      if (blog?.isPublished) {
        response = await axios.delete(
          `/api/blog/${endPath}?author=${session?.user?.id}`,
        );
      } else {
        response = await axios.post(`/api/blog/${endPath}`, {
          readingTime,
          isPublished: blog?.isPublished,
          author: session?.user?.id,
        });
      }
      if (!response?.data?.data) throw new Error("Sever Error");
      if (response?.data?.data?.deletedCount) {
        setAlert({
          message: "Blog Deleted",
          description: "Your new blog deleted successfully.",
          type: "success",
          isShowIcon: true,
          handleClick,
        });
        router.push("/dashboard");
      } else {
        setAlert({
          message: "Blog Published",
          description: "Your new blog published successfully.",
          type: "success",
          isShowIcon: true,
          handleClick,
        });
      }
      setIsAlert(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  const pathToEdit = () =>
    router.push(
      `/blog?blog_id=${endPath}&img=${blog?.bannerImg}&heading=${blog?.heading}&topic=${blog?.topic}`,
    );
  const deletContent = async (id: ObjectId) => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/blog/${endPath}`, {
        author: session?.user?.id,
        contentId: id,
      });
      setIsAlert(true);
      setAlert({
        message: "Deleted",
        description: "Your data deleted successfully",
        type: "success",
        isShowIcon: true,
        handleClick,
      });
      setBlog(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw new Error(JSON.stringify(error));
    }
  };

  const editContent = async (content: BlogContentProps) => {
    if (content?.html) {
      isOpenTool("document");
      setIsDoc(true);
      setText(`${content.html}`);
    } else if (content?.image) {
      isOpenTool("image");
      setIsPic(true);
      setImg(content.image);
    } else if (content?.video) {
      isOpenTool("video");
      setIsVideo(true);
      setVideoLink(`${content.video}`);
    } else if (content?.url) {
      isOpenTool("url");
      setIsUrl(true);
      setUrl(content.url);
    }
    setTimeout(() => scrollToBottom(), 1);
  };

  const props = {
    editMeta: true,
    deleteConetent: true,
    isEditContent: true,
    editContent,
    loading,
    blog,
    pathToEdit,
    deletContent,
  };

  const deletePopup = () => {
    const content = "Are you sure you want to delete this blog?";
    return (
      <div>
        <p>{content}</p>
        <div
          style={{ margin: "10px 0px", display: "flex", justifyContent: "end" }}
        >
          <Button
            onClick={handleSubmit}
            style={{ background: "red", color: "white", fontWeight: "bold" }}
          >
            Delete Blog
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      {alert?.message && isAlert && <AntAlert {...alert} />}
      {loading ? (
        <div className="mt-16">
          <AntSpin size="large" />
        </div>
      ) : (
        <>
          <Detail props={props} />
          <div
            ref={bottomRef}
            className="w-3/4 mx-auto p-4 flex flex-col items-center"
          >
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
                        const lastImgElement =
                          doc.querySelector("img:last-child");
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
                  value={img ? img : ""}
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
                {unsplashImages && searchUnSplash && (
                  <>
                    <Row className="bg-gray-100 m-2">
                      {unsplashImages.map((url: string, idx: number) => (
                        <>
                          <Col
                            span={4}
                            offset={4}
                            className={`cursor-pointer hover:bg-slate-600 p-2 ${
                              img === url && "bg-slate-800"
                            }`}
                          >
                            <Image
                              key={idx}
                              onClick={() => setImg(url)}
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
                  value={url}
                  size="large"
                  isButton={false}
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
          </div>
          <div className="flex w-3/4 mx-auto p-4 justify-end">
            <NumberInput
              value={readingTime}
              handleChange={setReadingTime}
              maxLength={2}
              placeholder="Reading Time"
            />
            <button
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                background: "#1890ff",
                color: "#fff",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Edit Reading Time For The Blog
            </button>
          </div>
          <div className="text-right w-3/4 mx-auto mt-8 p-4">
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
              onClick={() =>
                router.push(
                  `${process.env.NEXT_PUBLIC_BASE_PATH}/blog/${endPath}`,
                )
              }
            >
              Cancel
            </button>
            {session?.user?.id && blog?.isPublished ? (
              <>
                <Popover content={deletePopup} trigger="click">
                  <button
                    style={{
                      padding: "8px 16px",
                      borderRadius: "4px",
                      border: "none",
                      background: "red",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Delete Your Blog
                  </button>
                </Popover>
              </>
            ) : (
              <>
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
                  Publish Your Blog
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
