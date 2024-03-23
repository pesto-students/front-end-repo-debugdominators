"use client";
import locationIcon from "../../../../public/general/Location.svg";
// import chatIcon from "../../../../public/general/Speech Bubble.svg";
// import edit from "../../../../public/general/Edit.svg";
import forward from "../../../../public/general/Forward.svg";
import backward from "../../../../public/general/Backward.svg";
import { Avatar, List, Tooltip } from "antd";
import { Button, Layout, Typography } from "antd";
import { Col, Image as IMG, Row } from "antd";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { BasicUserInfo } from "@/utils/types/mongoose";
import DraggableModal from "@/components/shared/molecular/DraggableModal";
import { AntAlertProps, BlogProps, UserUpdateProps } from "@/utils/types/state";
import AntAlert from "@/components/shared/atomic/AntAlert";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { EditOutlined, UserOutlined, WechatOutlined } from "@ant-design/icons";
import AntSpin from "@/components/shared/atomic/AntSpin";
import { useRouter } from "next/navigation";
import Link from "next/link";
const { Content } = Layout;

export default function Profile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [profileURL, setProfileURL] = useState("");
  const [alert, setAlert] = useState<AntAlertProps>({
    message: "",
    description: "",
    type: "error",
    isShowIcon: true,
    handleClick: () => {},
  });
  const [isAlert, setIsAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [followers, setFollowers] = useState<BasicUserInfo[]>([]);
  const [following, setFollowing] = useState<BasicUserInfo[]>([]);
  const [editTitle, setEditTitle] = useState("");
  const [name, setName] = useState("");
  const [property, setProperty] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [remainCountLiked, setRemainCountLiked] = useState(3);
  const [remainCountSaved, setRemainCountSaved] = useState(3);
  const [remainCountPublished, setRemainCountPublished] = useState(3);
  const [remainCountDrafted, setRemainCountDrafted] = useState(3);
  const [likedBlogs, setLikedBlogs] = useState<BlogProps[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<BlogProps[]>([]);
  const [publishedBlogs, setPublishedBlogs] = useState<BlogProps[]>([]);
  const [draftedBlogs, setDraftedBlogs] = useState<BlogProps[]>([]);
  const [likedPage, setLikedPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);
  const [publishedPage, setPublishedPage] = useState(1);
  const [draftedPage, setDraftedPage] = useState(1);
  const [profileIMG, setProfileIMG] = useState<string | ArrayBuffer | null>("");
  const [editComponent, setEditComponent] = useState<ReactNode>(<></>);
  const [userData, setUserData] = useState<BasicUserInfo>({
    _id: "",
    name: "",
    email: "",
    image: "",
    bio: "",
    address: "",
    followers: [],
    following: [],
  });

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

  const cancelTokenSource = axios.CancelToken.source();
  useEffect(() => {
    if (session?.user?.id)
      setProfileURL(
        `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/profile/${session?.user?.id}`,
      );
    const fetchData = async () => {
      try {
        let userResponse = null;
        setLoading(true);
        if (session && profileURL) {
          userResponse = await axios.get(profileURL);
          const userData = userResponse?.data?.data;
          setUserData(userData);
          setFollowers(userData?.followers);
          setFollowing(userData?.following);
          setLoading(false);
        }
      } catch (error) {
        router.push("/dashboard");
      }
    };
    fetchData();
    return () => cancelTokenSource.cancel("Component unmounted");
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let blogResponse = null;
        setLoading(true);
        if (session && profileURL) {
          if (remainCountLiked >= 1) {
            blogResponse = await axios.get(
              `${profileURL}?blogs=true&page=${likedPage}`,
            );
            const blogData = blogResponse?.data?.data;
            setRemainCountLiked(blogData?.remain_count_liked);
            setLikedBlogs((prevData) => {
              const lastPrevDataId = prevData?.[prevData.length - 1]?._id;
              const lastResponseId =
                blogData?.likedUsers?.[blogData.likedUsers.length - 1]?._id;
              if (!prevData || prevData.length === 0) {
                return [...(blogData?.likedUsers || [])];
              } else if (lastPrevDataId !== lastResponseId) {
                return [...prevData, ...(blogData?.likedUsers || [])];
              }
              return [...prevData];
            });
          }
          setLoading(false);
        }
      } catch (error) {
        throw new Error("axios service error");
      }
    };
    fetchData();
    return () => cancelTokenSource.cancel("Component unmounted");
  }, [session, likedPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let blogResponse = null;
        setLoading(true);
        if (session && profileURL) {
          if (remainCountLiked >= 1 && remainCountSaved >= 1) {
            blogResponse = await axios.get(
              `${profileURL}?blogs=true&page=${savedPage}`,
            );
            const blogData = blogResponse?.data?.data;
            setRemainCountSaved(blogData?.remain_count_saved);
            setSavedBlogs((prevData) => {
              const lastPrevDataId = prevData?.[prevData.length - 1]?._id;
              const lastResponseId =
                blogData?.savedUsers?.[blogData.savedUsers.length - 1]?._id;
              if (!prevData || prevData.length === 0) {
                return [...(blogData?.savedUsers || [])];
              } else if (lastPrevDataId !== lastResponseId) {
                return [...prevData, ...(blogData?.savedUsers || [])];
              }
              return [...prevData];
            });
          }

          setLoading(false);
        }
      } catch (error) {
        throw new Error("axios service error");
      }
    };
    fetchData();
    return () => cancelTokenSource.cancel("Component unmounted");
  }, [session, savedPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let blogResponse = null;
        setLoading(true);
        if (session && profileURL) {
          if (remainCountPublished >= 1) {
            blogResponse = await axios.get(
              `${profileURL}?blogs=true&page=${publishedPage}`,
            );
            const blogData = blogResponse?.data?.data;
            setRemainCountPublished(blogData?.remain_count_published_blogs);
            setPublishedBlogs((prevData) => {
              const lastPrevDataId = prevData?.[prevData.length - 1]?._id;
              const lastResponseId =
                blogData?.publishedBlogs?.[blogData?.publishedBlogs.length - 1]
                  ?._id;
              if (!prevData || prevData.length === 0) {
                return [...(blogData?.publishedBlogs || [])];
              } else if (lastPrevDataId !== lastResponseId) {
                return [...prevData, ...(blogData?.publishedBlogs || [])];
              }
              return [...prevData];
            });
          }
          setLoading(false);
        }
      } catch (error) {
        throw new Error("axios service error");
      }
    };
    fetchData();
    return () => cancelTokenSource.cancel("Component unmounted");
  }, [session, publishedPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let blogResponse = null;
        setLoading(true);
        if (session && profileURL) {
          if (remainCountDrafted >= 1) {
            blogResponse = await axios.get(
              `${profileURL}?blogs=true&page=${draftedBlogs}`,
            );
            const blogData = blogResponse?.data?.data;
            setRemainCountDrafted(blogData?.remain_count_drafted_blogs);
            setDraftedBlogs((prevData) => {
              const lastPrevDataId = prevData?.[prevData.length - 1]?._id;
              const lastResponseId =
                blogData?.draftedBlogs?.[blogData.draftedBlogs.length - 1]?._id;
              if (!prevData || prevData.length === 0) {
                return [...(blogData?.draftedBlogs || [])];
              } else if (lastPrevDataId !== lastResponseId) {
                return [...prevData, ...(blogData?.draftedBlogs || [])];
              }
              return [...prevData];
            });
          }
          setLoading(false);
        }
      } catch (error) {
        throw new Error("axios service error");
      }
    };
    fetchData();
    return () => cancelTokenSource.cancel("Component unmounted");
  }, [session, draftedPage]);

  const handleClick = () => setIsAlert(false);

  const handleSubmit = async (param: string) => {
    const payload: UserUpdateProps = {};
    if (param === "image" && typeof profileIMG === "string" && profileIMG)
      payload[param] = profileIMG;
    if (param === "address" && typeof address === "string" && address)
      payload[param] = address;
    if (param === "bio" && typeof bio === "string" && bio) payload[param] = bio;
    if (param === "name" && typeof name === "string" && name)
      payload[param] = name;

    if (Object.keys(payload).length > 0) {
      const response = await axios.put(profileURL, payload);
      setUserData(response?.data?.data);
      setAlert({
        message: "Profile Updated",
        description: "Your Profile Updated succssfully.",
        type: "success",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    } else {
      setAlert({
        message: "Error",
        description: "Invalid file type.",
        type: "error",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    }
    setProperty("");
    setEditTitle("");
    setProfileIMG("");
    setAddress("");
    setBio("");
    setName("");
    setEditComponent(() => <></>);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    param: string,
  ) => {
    event.preventDefault();
    if (param === "image" && event.target instanceof HTMLInputElement) {
      const file = event?.target?.files?.[0];
      if (file) {
        const data = new FormData();
        data.append("image", file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64data = reader.result;
          setProfileIMG(base64data);
        };
      } else {
        setAlert({
          message: "Profile Image missing",
          description: "Please upload appropriate profile image for your blog.",
          type: "error",
          isShowIcon: true,
          handleClick,
        });
        setIsAlert(true);
      }
    } else if (param === "name") {
      const trimmedName = event.target.value.trim();
      if (!trimmedName) {
        setAlert({
          message: "Profile Image missing",
          description: "Please upload appropriate image for your profile.",
          type: "error",
          isShowIcon: true,
          handleClick,
        });
        setIsAlert(true);
      }
      setName(trimmedName);
    } else if (param === "address") {
      const trimmedAddress = event.target.value.trim();
      if (!trimmedAddress) {
        setAlert({
          message: "Address missing",
          description: "Please add appropriate Address for your profile.",
          type: "error",
          isShowIcon: true,
          handleClick,
        });
        setIsAlert(true);
      }
      setAddress(trimmedAddress);
    } else if (param === "bio") {
      const trimmedBio = event.target.value.trim();
      if (!trimmedBio) {
        setAlert({
          message: "Biography missing",
          description: "Please add appropriate Biography for your profile.",
          type: "error",
          isShowIcon: true,
          handleClick,
        });
        setIsAlert(true);
      }
      setBio(trimmedBio);
    }
  };

  const editTool = (param: string) => {
    setAlert({
      message: "",
      description: "",
      type: "error",
      isShowIcon: true,
      handleClick: () => {},
    });
    setIsAlert(false);
    setEditTitle("");
    setProfileIMG("");
    setAddress("");
    setBio("");
    setName("");
    setEditComponent(() => <></>);
    if (param === "image") {
      setProperty("image");
      setEditTitle("Edit Your Profile Image");
      setEditComponent(() => (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleChange(e, "image")}
        />
      ));
    } else if (param === "name") {
      setProperty("name");
      setEditTitle("Edit Your Profile Name");
      setEditComponent(() => (
        <input
          style={{ border: "2px solid black" }}
          type="text"
          onChange={(e) => handleChange(e, "name")}
        />
      ));
    } else if (param === "bio") {
      setProperty("bio");
      setEditTitle("Edit Your Profile Biography");
      setEditComponent(() => (
        <textarea
          style={{ border: "2px solid black" }}
          onChange={(e) => handleChange(e, "bio")}
        />
      ));
    } else if (param === "address") {
      setProperty("address");
      setEditTitle("Edit Your Profile Address");
      setEditComponent(() => (
        <ReactGoogleAutocomplete
          style={{ border: "2px solid black" }}
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}
          onPlaceSelected={(place) => setAddress(place?.formatted_address)}
        />
      ));
    }
    setIsEdit(true);
  };

  return (
    <Layout className="w-3/5 p-5 container mx-auto my-14">
      {isEdit && (
        <DraggableModal
          state={isEdit}
          setState={setIsEdit}
          component={editComponent}
          title={editTitle}
          handleSubmit={handleSubmit}
          property={property}
        />
      )}
      {isAlert && <AntAlert {...alert} />}
      {loading ? (
        <div className="mt-16">
          <AntSpin size="large" />
        </div>
      ) : (
        <>
          <Row className="mb-5 mt-5">
            <Col
              style={{ width: "600px" }}
              className="flex-col rounded-tr-3xl"
              span={5}
            >
              <IMG
                className="rounded-tr-3xl"
                src={userData?.image}
                alt="profile-image"
              />
              <Content
                onClick={() => editTool("image")}
                className="flex justify-center mt-1"
              >
                <Tooltip title="Edit profile image">
                  <EditOutlined style={{ fontSize: "20px" }} />
                </Tooltip>
              </Content>
            </Col>
            <Col span={1}></Col>
            <Col className=" d-flex flex-row" span={18}>
              <Content className="flex">
                <Typography.Text className="text-xl">
                  Hi there,I&apos;m {userData?.name}
                </Typography.Text>
                <Content onClick={() => editTool("name")}>
                  <Tooltip title="Edit name">
                    <EditOutlined
                      style={{ marginLeft: "10px", fontSize: "20px" }}
                    />
                  </Tooltip>
                </Content>
              </Content>
              <br />
              <Content className="flex">
                <Typography.Title level={2}>
                  {userData?.bio ? userData?.bio : "NA"}
                </Typography.Title>
                <Content onClick={() => editTool("bio")}>
                  <Tooltip title="Edit biography">
                    <EditOutlined
                      style={{
                        marginTop: "15px",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                    />
                  </Tooltip>
                </Content>
              </Content>
              <Content className="flex items-center mb-2">
                <Tooltip title="Address">
                  <Image
                    className="w-5 h-5 flex-shrink-0 cursor-pointer"
                    src={locationIcon}
                    alt="locationIcon"
                  />
                </Tooltip>
                <Typography className="overflow-hidden whitespace-nowrap ml-3">
                  {userData?.address ? userData?.address : "NA"}
                </Typography>
                <Content onClick={() => editTool("address")}>
                  <Tooltip title="Edit address">
                    <EditOutlined
                      style={{ marginLeft: "10px", fontSize: "20px" }}
                    />
                  </Tooltip>
                </Content>
              </Content>
              <Content className="flex items-center mb-2">
                <Tooltip title="Following">
                  <Image
                    className="w-5 h-5  flex-shrink-0"
                    src={forward}
                    alt="following"
                  />
                </Tooltip>
                <Typography className=" w-40 overflow-hidden whitespace-nowrap ml-3">
                  {userData?.following?.length
                    ? userData?.following?.length
                    : 0}
                </Typography>
              </Content>
              <Content className="flex items-center mb-2">
                <Tooltip title="Followers">
                  <Image
                    className="w-5 h-5  flex-shrink-0"
                    src={backward}
                    alt="followback"
                  />
                </Tooltip>
                <Typography className=" w-40 overflow-hidden whitespace-nowrap ml-3">
                  {userData?.followers?.length
                    ? userData?.followers?.length
                    : 0}
                </Typography>
              </Content>
            </Col>
          </Row>
          <Row>
            <Col
              style={{ backgroundColor: "#FFB300" }}
              className="flex justify-center border-2 border-slate-800  text-center"
              span={24}
            >
              <Button
                className="w-full flex items-center justify-center"
                type="text"
              >
                <WechatOutlined style={{ fontSize: "20px" }} />
                Chat
              </Button>
            </Col>
          </Row>
          <Typography.Title
            level={3}
            className={`mt-16 ${innerWidth < 680 && "text-center"}`}
          >
            Followers
          </Typography.Title>
          <Row className="mt-5">
            <Col
              className="border p-5 border-slate-950"
              span={innerWidth < 680 ? 22 : 11}
            >
              <Typography.Title className="ml-5 mt-5" level={3}>
                Following
              </Typography.Title>

              <List
                itemLayout="horizontal"
                dataSource={following}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={item?.image && item?.image}
                          icon={!item?.image && <UserOutlined />}
                        />
                      }
                      title={
                        <Link href={`/profile/${item?._id}`}>{item?.name}</Link>
                      }
                      description={item?.bio ? item?.bio : "No Bio Available"}
                    />
                  </List.Item>
                )}
              />
              {/* <List.Item>
            <Button
              className="my-3"
              style={{
                width: "90%",
                border: "1px solid black",
                backgroundColor: "#F5F5F5",
              }}
              type="text"
            >
              Show Full List
            </Button>
          </List.Item> */}
            </Col>
            <Col span={2}></Col>
            <Col
              className={`border p-5 border-slate-950 ${
                innerWidth < 680 && "mt-5"
              }`}
              span={innerWidth < 680 ? 22 : 11}
            >
              <Typography.Title className={`ml-5 mt-5`} level={3}>
                Followers
              </Typography.Title>
              <List
                itemLayout="horizontal"
                dataSource={followers}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={item?.image && item?.image}
                          icon={!item?.image && <UserOutlined />}
                        />
                      }
                      title={
                        <Link href={`/profile/${item?._id}`}>{item?.name}</Link>
                      }
                      description={item?.bio ? item?.bio : "No Bio Available"}
                    />
                  </List.Item>
                )}
              />
              {/* <List.Item>
            <Button
              className="my-3"
              style={{
                width: "90%",
                border: "1px solid black",
                backgroundColor: "#F5F5F5",
              }}
              type="text"
            >
              Show Full List
            </Button>
          </List.Item> */}
            </Col>
          </Row>
          <Row>
            <Col className="my-8" span={24}>
              <Typography.Title
                className={`${innerWidth < 680 && "text-center"}`}
                level={3}
              >
                Blogs activity
              </Typography.Title>
            </Col>
          </Row>
          <Row>
            <Col
              className="border 2 border-slate-950"
              span={innerWidth < 680 ? 22 : 11}
            >
              <Typography.Title className="ml-5 mt-5" level={3}>
                Liked Blogs
              </Typography.Title>
              <List
                itemLayout="horizontal"
                dataSource={likedBlogs}
                renderItem={(item, index) => {
                  const htmlContent =
                    item?.content.length > 130
                      ? `${item?.content.slice(0, 130)}...`
                      : `${item?.content}...`;
                  return (
                    <>
                      <List.Item key={index}>
                        <List.Item.Meta
                          avatar={<Avatar src={item?.bannerImg} />}
                          title={`${item?.heading}`}
                          description={
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                              href={`blog/${item?._id}`}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: htmlContent,
                                }}
                              />
                            </Link>
                          }
                        />
                      </List.Item>
                    </>
                  );
                }}
              />
              {likedBlogs?.length > 0 && (
                <List.Item>
                  <Button
                    onClick={() => setLikedPage(likedPage + 1)}
                    className="my-3"
                    style={{
                      width: "90%",
                      border: "1px solid black",
                      backgroundColor: "#F5F5F5",
                    }}
                    type="text"
                  >
                    Show Full List
                  </Button>
                </List.Item>
              )}
              {loading && <AntSpin />}
            </Col>
            <Col span={2}></Col>
            <Col
              className={`border 5 border-slate-950 ${
                innerWidth < 680 && "mt-5"
              }`}
              span={innerWidth < 680 ? 22 : 11}
            >
              <Content className="d-flex">
                <Typography.Title className="ml-5 mt-5" level={3}>
                  Saved Blogs{" "}
                </Typography.Title>
              </Content>
              <List
                itemLayout="horizontal"
                dataSource={savedBlogs}
                renderItem={(item, index) => {
                  const htmlContent =
                    item?.content.length > 130
                      ? `${item?.content.slice(0, 130)}...`
                      : `${item?.content}...`;
                  return (
                    <>
                      <List.Item key={index}>
                        <List.Item.Meta
                          avatar={<Avatar src={item?.bannerImg} />}
                          title={`${item?.heading}`}
                          description={
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                              href={`blog/${item?._id}`}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: htmlContent,
                                }}
                              />
                            </Link>
                          }
                        />
                      </List.Item>
                    </>
                  );
                }}
              />
              {savedBlogs?.length > 0 && (
                <List.Item>
                  <Button
                    onClick={() => setSavedPage(savedPage + 1)}
                    className="my-3"
                    style={{
                      width: "90%",
                      border: "1px solid black",
                      backgroundColor: "#F5F5F5",
                    }}
                    type="text"
                  >
                    Show Full List
                  </Button>
                </List.Item>
              )}
              {loading && <AntSpin />}
            </Col>
          </Row>
          <Row>
            <Col className="my-8" span={24}>
              <Typography.Title
                level={3}
                className={`${innerWidth < 680 && "text-center"}`}
              >
                Blogs
              </Typography.Title>
            </Col>
          </Row>
          <Row>
            <Col
              className="border 2 border-slate-950"
              span={innerWidth < 680 ? 22 : 11}
            >
              <Typography.Title className="ml-5 mt-5" level={3}>
                Published Blogs
              </Typography.Title>
              <List
                itemLayout="horizontal"
                dataSource={publishedBlogs}
                renderItem={(item, index) => {
                  const htmlContent =
                    item?.content.length > 130
                      ? `${item?.content.slice(0, 130)}...`
                      : `${item?.content}...`;
                  return (
                    <>
                      <List.Item key={index}>
                        <List.Item.Meta
                          avatar={<Avatar src={item?.bannerImg} />}
                          title={`${item?.heading}`}
                          description={
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                              href={`blog/${item?._id}`}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: htmlContent,
                                }}
                              />
                              <div className="pr-5 block text-right text-blue-500">
                                <Tooltip title="Edit this text data">
                                  <Link
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                    href={`blog/${item?._id}/edit`}
                                  >
                                    <EditOutlined
                                      style={{
                                        fontSize: "15px",
                                        marginRight: "10px",
                                      }}
                                    />
                                    Edit Blog
                                  </Link>
                                </Tooltip>
                              </div>
                            </Link>
                          }
                        />
                      </List.Item>
                    </>
                  );
                }}
              />

              {publishedBlogs?.length > 0 && (
                <List.Item>
                  <Button
                    onClick={() => setPublishedPage(publishedPage + 1)}
                    className="my-3"
                    style={{
                      width: "90%",
                      border: "1px solid black",
                      backgroundColor: "#F5F5F5",
                    }}
                    type="text"
                  >
                    Show Full List
                  </Button>
                </List.Item>
              )}
              {loading && <AntSpin />}
            </Col>
            <Col span={2}></Col>
            <Col
              className={`border 5 border-slate-950 ${
                innerWidth < 680 && "mt-5"
              }`}
              span={innerWidth < 680 ? 22 : 11}
            >
              <Content className="d-flex">
                <Typography.Title className={`ml-5 mt-5`} level={3}>
                  Drafted Blogs{" "}
                </Typography.Title>
              </Content>
              <List
                itemLayout="horizontal"
                dataSource={draftedBlogs}
                renderItem={(item, index) => {
                  const htmlContent =
                    item?.content.length > 130
                      ? `${item?.content.slice(0, 130)}...`
                      : `${item?.content}...`;
                  return (
                    <>
                      <List.Item key={index}>
                        <List.Item.Meta
                          avatar={<Avatar src={item?.bannerImg} />}
                          title={`${item?.heading}`}
                          description={
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                              href={`blog/${item?._id}`}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: htmlContent,
                                }}
                              />
                              <div className="pr-5 block text-right text-blue-500">
                                <Tooltip title="Edit this text data">
                                  <Link
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                    href={`blog/${item?._id}/edit`}
                                  >
                                    <EditOutlined
                                      style={{
                                        fontSize: "15px",
                                        marginRight: "10px",
                                      }}
                                    />
                                    Edit Blog
                                  </Link>
                                </Tooltip>
                              </div>
                            </Link>
                          }
                        />
                      </List.Item>
                    </>
                  );
                }}
              />
              {draftedBlogs?.length > 0 && (
                <List.Item>
                  <Button
                    onClick={() => setDraftedPage(draftedPage + 1)}
                    className="my-3"
                    style={{
                      width: "90%",
                      border: "1px solid black",
                      backgroundColor: "#F5F5F5",
                    }}
                    type="text"
                  >
                    Show Full List
                  </Button>
                </List.Item>
              )}
              {loading && <AntSpin />}
            </Col>
          </Row>
        </>
      )}
    </Layout>
  );
}
