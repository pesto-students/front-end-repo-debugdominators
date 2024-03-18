"use client";
import locationIcon from "../../../../../public/general/Location.svg";
import followIcon from "../../../../../public/general/Plus Math.svg";
import unFollowIcon from "../../../../../public/general/Minus.svg";
import bookIcon from "../../../../../public/general/Timeline Week.svg";
import forward from "../../../../../public/general/Forward.svg";
import backward from "../../../../../public/general/Backward.svg";
import chatIcon from "../../../../../public/general/Speech Bubble.svg";
import cofeeIcon from "../../../../../public/general/Teacup Set.svg";
import { Button, Layout, Tooltip, Typography } from "antd";
import { Col, Image as IMG, Row } from "antd";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BasicUserInfo } from "@/utils/types/mongoose";
import axios from "axios";
import {
  AntAlertProps,
  BlogProps,
  HandlePaymentProps,
} from "@/utils/types/state";
import { s3bucket } from "@/constants/service";
import AntSpin from "@/components/shared/atomic/AntSpin";
import {
  findHowmanyDaysBefore,
  initializeRazorpay,
} from "@/utils/helpers/methods";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import { usePathname, useRouter } from "next/navigation";
import { InlineWidget } from "react-calendly";
import NumberInput from "@/components/shared/atomic/AntNumberInput";
import AntSelect from "@/components/shared/atomic/AntSelect";
import { currencies } from "@/constants/random";
import DraggableModal from "@/components/shared/molecular/DraggableModal";
import AntAlert from "@/components/shared/atomic/AntAlert";
import { RazorSuccessRes } from "@/utils/types/service";
const { Content } = Layout;

export default function Profile() {
  const pathname = usePathname();
  const router = useRouter();
  const userId = pathname.split("/");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<BlogProps[]>([]);
  const [remainCount, setRemainCount] = useState(5);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isMeeting, setIsMeeting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(1);
  const [currency, setCurrency] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState<AntAlertProps>({
    message: "",
    description: "",
    type: "error",
    isShowIcon: true,
    handleClick: () => {},
  });
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

  const cancelTokenSource = axios.CancelToken.source();
  useEffect(() => {
    if (session?.user?.id) {
      if (session?.user?.id === userId[2]) router.push("/profile");
      const fetchData = async () => {
        try {
          const pathUserData = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/user/${userId[2]}`,
          );
          if (!pathUserData?.data?.data) router.push("/profile");
          const userResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/profile/${pathUserData?.data?.data?._id}`,
          );
          const userData = userResponse?.data?.data;
          setUserData(userData);
          userData?.following?.map((elem: string) => {
            if (elem === userId[2]) return setIsFollowed(true);
          });
        } catch (error) {
          throw new Error("axios service error");
        }
      };
      fetchData();
      return () => cancelTokenSource.cancel("Component unmounted");
    }
  }, [session, pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (session && userId[2]) {
          if (remainCount >= 1) {
            const blogResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog/${userId[2]}?author=${true}&page=${page}`,
            );
            const blogData = blogResponse?.data?.data;
            setRemainCount(blogData?.remain_count);
            setBlogs((prevData) => {
              const lastPrevDataId = prevData?.[prevData.length - 1]?._id;
              const lastResponseId =
                blogData?.blogs?.[blogData.blogs.length - 1]?._id;
              if (!prevData || prevData.length === 0) {
                return [...(blogData?.blogs || [])];
              } else if (lastPrevDataId !== lastResponseId) {
                return [...prevData, ...(blogData?.blogs || [])];
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
      cancelTokenSource.cancel("Component unmounted");
    };
  }, [session, page]);

  const handleClick = () => setIsAlert(false);

  const follow = async (_id: ObjectId, isFollowed: boolean) => {
    setIsFollowed(!isFollowed);
    setIsAlert(false);
    try {
      const userResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/profile/${session?.user?.id}/follow`,
        { isFollowed, following: userId[2], follower: session?.user?.id },
      );
      if (userResponse?.data?.data) {
        setAlert({
          message: `${isFollowed ? "Unfollow" : "Follow"} Successfully`,
          description: `${
            isFollowed ? "Unfollow" : "Follow"
          } the user successfully`,
          type: "success",
          isShowIcon: true,
          handleClick,
        });
        setIsAlert(true);
      } else {
        setAlert({
          message: "Service Error",
          description: "Some service error occured, please try later.",
          type: "error",
          isShowIcon: true,
          handleClick,
        });
        setIsAlert(true);
      }
    } catch (error) {
      setAlert({
        message: "Service Error",
        description: "Some service error occured, please try later.",
        type: "error",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    }
  };

  const handlePayment = async ({ currency, amount }: HandlePaymentProps) => {
    setPayLoading(true);
    const key = process.env.NEXT_PUBLIC_RAZOR_KEY_ID;
    const URL = `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/${session?.user?.id}/payment`;
    const res = await initializeRazorpay();
    if (!res) {
      setAlert({
        message: "Service Error",
        description: "Some service error occured, please try later.",
        type: "error",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    }
    const order = await axios.post(URL, {
      amount,
      currency,
      sender: session?.user?.id,
      receiver: userId[2],
    });
    if (!order) {
      setAlert({
        message: "Service Error",
        description: "Some service error occured, please try later.",
        type: "error",
        isShowIcon: true,
        handleClick,
      });
      setIsAlert(true);
    }
    setPayLoading(false);
    const {
      amount: amt,
      id: order_id,
      currency: cur,
    } = order && order.data && order.data.data;
    const options = {
      key,
      amount: amt,
      currency: cur,
      name: userData?.name,
      description: "BlogMingle App",
      image: `${userData?.image ? userData?.image : s3bucket.NO_USER_IMG}`,
      order_id,
      handler: async function (response: RazorSuccessRes) {
        if (
          response?.razorpay_order_id &&
          response?.razorpay_payment_id &&
          response?.razorpay_signature
        ) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            sender: session?.user?.id,
            receiver: userId[2],
          };
          try {
            const result = await axios.put(URL, data);
            if (result?.data?.data) {
              setAlert({
                message: "Payment Successful",
                description: "Payment successful, Thanks for your initiative.",
                type: "success",
                isShowIcon: true,
                handleClick,
              });
              setIsAlert(true);
            }
          } catch (error) {
            setAlert({
              message: "Service Error",
              description: "Some service error occured, please try later.",
              type: "error",
              isShowIcon: true,
              handleClick,
            });
            setIsAlert(true);
          }
        }
        setAlert({
          message: "Cancelled Payment",
          description:
            "Cancelled payment successfully, No amount credited from your account.",
          type: "success",
          isShowIcon: true,
          handleClick,
        });
        setIsAlert(true);
      },
      prefill: {
        name: "Piyush Garg",
        email: "youremail@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    /* eslint-disable */
    const paymentObject: any = new (window as any).Razorpay(options);
    paymentObject.open();
    /* eslint-enable */
  };

  return (
    <Layout style={{ width: "60%" }} className="container mx-auto mt-14">
      <DraggableModal
        title="Payment Checkout"
        handleSubmit={() => handlePayment({ currency, amount })}
        setState={setVisible}
        state={visible}
        component={
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <NumberInput
              title="Maximum amount can send is one Lakh"
              maxLength={100001}
              placeholder="Enter your amount"
              value={amount}
              handleChange={(value) => setAmount(value)}
            />
            <AntSelect
              setTopic={(value) => setCurrency(value)}
              options={currencies}
              placeholder={"Select your currency"}
            />
          </div>
        }
        footer={[
          <Button
            key="back"
            onClick={() => {
              setVisible(false);
              setAlert({
                message: "Cancelled Payment",
                description:
                  "Cancelled payment successfully, No amount credited from your account.",
                type: "success",
                isShowIcon: true,
                handleClick,
              });
              setIsAlert(true);
            }}
          >
            Cancel Payment
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              if (amount < 1 || !currency.trim()) {
                setAlert({
                  message: "Amount or Currency",
                  description:
                    "Amount should greaterthan zero and need to select a currency.",
                  type: "error",
                  isShowIcon: true,
                  handleClick,
                });
                setIsAlert(true);
              } else handlePayment({ currency, amount });
              setVisible(false);
            }}
          >
            Proceed to Pay
          </Button>,
        ]}
      />
      {alert?.message && isAlert && <AntAlert {...alert} />}
      <Row>
        <Col
          style={{ height: "300px", width: "600px" }}
          className="rounded-tr-3xl"
          span={5}
        >
          <IMG
            className="rounded-tr-3xl"
            src={`${userData?.image ? userData?.image : s3bucket.NO_USER_IMG}`}
            alt="profile-image"
          />
        </Col>
        <Col span={1}></Col>
        <Col className=" d-flex flex-row" span={18}>
          <Typography.Text className="text-xl">
            Hi there,I&apos;m {userData?.name}
          </Typography.Text>
          <br />
          <Typography.Title level={2}>
            {userData?.bio ? userData?.bio : "No Bio Available"}
          </Typography.Title>
          <Content className="flex items-center mb-2">
            <Image
              className="w-5 h-5  flex-shrink-0"
              src={locationIcon}
              alt="locationIcon"
            />
            <Typography className=" w-40 overflow-hidden whitespace-nowrap ml-3">
              {userData?.address ? userData?.address : "NA"}
            </Typography>
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
              {userData?.following?.length ? userData?.following?.length : 0}
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
              {userData?.followers?.length ? userData?.followers?.length : 0}
            </Typography>
          </Content>
        </Col>
      </Row>
      <Row gutter={[2, 2]}>
        <Col
          style={{ backgroundColor: "grey" }}
          className="border-2 border-slate-800 text-center flex items-center justify-center"
          span={4}
        >
          <Button
            className="w-full flex items-center justify-center"
            type="text"
            onClick={() => {
              if (userData?._id) {
                follow(userData._id as Types.ObjectId, isFollowed);
              }
            }}
          >
            <Image
              className="w-5 h-5 mr-1 flex-shrink-0"
              src={isFollowed ? unFollowIcon : followIcon}
              alt="locationIcon"
            />
            {isFollowed ? "UnFollow" : "Follow"}
          </Button>
        </Col>
        {!isMeeting ? (
          <Col
            style={{ backgroundColor: "grey" }}
            className="border-2 border-slate-800 text-center flex items-center justify-center"
            span={14}
            offset={1}
          >
            <Button
              className="w-full flex items-center justify-center"
              type="text"
              onClick={() => setIsMeeting(true)}
            >
              <Image
                className="w-5 h-5 mr-1 flex-shrink-0"
                src={bookIcon}
                alt="locationIcon"
              />
              Book your Meeting
            </Button>
          </Col>
        ) : (
          <InlineWidget url={`https://calendly.com/qwer`} />
        )}
        <Col
          style={{ backgroundColor: "grey" }}
          className="border-2 border-slate-800  text-center flex items-center justify-center"
          span={4}
          offset={1}
        >
          <Button
            className="w-full flex items-center justify-center "
            type="text"
          >
            <Image
              className="w-5 h-5 mr-1  flex-shrink-0"
              src={chatIcon}
              alt="locationIcon"
              onClick={() => router.push("/chat")}
            />
            Chat
          </Button>
        </Col>
        <Col span={1}></Col>
        {payLoading ? (
          <Col
            style={{
              marginTop: "1.25rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            span={24}
          >
            <AntSpin size="large" />
          </Col>
        ) : (
          <Col
            style={{ backgroundColor: "#FFB300" }}
            className="border-2 border-slate-800 mt-4 text-center"
            span={24}
          >
            <Button
              className="w-full flex items-center justify-center "
              type="text"
              onClick={() => setVisible(true)}
            >
              <Image
                className="w-5 h-5 mr-1 flex-shrink-0"
                src={cofeeIcon}
                alt="locationIcon"
              />
              Buy me a coffee
            </Button>
          </Col>
        )}
      </Row>
      <Content className=" my-24">
        {/* <Divider className="divide-x divide-slate-900" /> */}
        <div className="divide-y divide-slate-900">
          <Typography.Title level={3}>Popular blogs</Typography.Title>
          <div className="mb-10"></div>
        </div>
        {blogs?.map((item, index) => {
          const htmlContent =
            item?.content.length > 300
              ? `${item?.content.slice(0, 300)}...`
              : `${item?.content}...`;
          const heading =
            item?.heading?.length > 30
              ? `${item?.heading?.slice(0, 30)}...`
              : `${item?.heading}...`;
          return (
            <button key={index}>
              <Row className=" h-44  my-5 divide-y divide-slate-300 ">
                <Col
                  className=" my-3"
                  style={{ height: "200px", width: "410px" }}
                  span={9}
                >
                  <IMG
                    style={{
                      height: "200px",
                      width: "410px",
                      borderRadius: "0px 50px 0px 0px",
                    }}
                    className="rounded-tr-3xl"
                    src={item?.bannerImg}
                  />
                </Col>
                <Col span={2}></Col>
                <Col style={{ width: "100%" }} className=" " span={13}>
                  <Content className="my-3 leading-4 flex-content text-left  max-h-20 ">
                    <Typography.Text className="text-2xl font-bold  ">
                      {heading}
                    </Typography.Text>
                  </Content>
                  <Content className="max-h-32 mb-1 text-left">
                    <Typography className="leading-6 font-semibold text-left">
                      {
                        <div
                          dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                      }
                    </Typography>
                    <Typography className="mt-5">
                      {item?.readingTime} minute read
                      <span className="text-slate-800 font-bold m-2">•</span>
                      {findHowmanyDaysBefore(item.updatedAt)}
                    </Typography>
                  </Content>
                </Col>
              </Row>
            </button>
          );
        })}
        {loading && <AntSpin />}
      </Content>
    </Layout>
  );
}
