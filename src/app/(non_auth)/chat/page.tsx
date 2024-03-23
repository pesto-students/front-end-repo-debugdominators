"use client";
import { useEffect, useState } from "react";
import { Button, Input, List } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { s3bucket } from "@/constants/service";
import AntSpin from "@/components/shared/atomic/AntSpin";
import { pusherClient } from "@/lib/pusher";
import { Message } from "@/utils/types/mongoose";
import { UserUpdateProps } from "@/utils/types/state";

const Chat = () => {
  const { data: session } = useSession();
  const [selectedChat, setSelectedChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    image: "",
    email: "",
  });
  const [chatUserData, seChatUserData] = useState({
    _id: "",
    name: "",
    image: "",
    email: "",
  });
  const [chatUserId, setChatUserId] = useState("");
  const [chatUsers, setChatUsers] = useState<UserUpdateProps[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    if (session?.user?.id) {
      const profileURL = `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/profile/${session?.user?.id}`;
      const fetchData = async () => {
        try {
          let userResponse = null;
          setLoading(true);
          if (session && profileURL) {
            userResponse = await axios.get(profileURL);
            const userData = userResponse?.data?.data;
            const { following, followers } = userData;
            const mergedArray = [...following, ...followers];
            const uniqueChatUsers = mergedArray.filter(
              (value, index, self) =>
                index === self.findIndex((obj) => obj._id === value._id),
            );
            setChatUsers(uniqueChatUsers);
            const { _id, name, image, email } = userData;
            setUserData({ _id, name, image, email });
            setLoading(false);
          }
        } catch (error) {
          throw new Error("axios service error");
        }
      };
      fetchData();
    }
    return () => cancelTokenSource.cancel("Component unmounted");
  }, [session]);

  const handleSelectChat = async (chatId: string) => {
    setLoading(true);
    setChatUserId(chatId);
    try {
      const profileURL = `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/profile/${chatId}`;
      const chatUserResponse = await axios.get(profileURL);
      const { _id, name, image, email } = chatUserResponse?.data?.data || {};
      seChatUserData({ _id, name, image, email });
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/chat/${session?.user?.id}?user_id=${chatId}`,
      );
      setSelectedChat(response?.data?.data);
      setLoading(false);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  };

  const sendMessage = async (message: string) => {
    try {
      if (message.trim())
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/chat/${session?.user?.id}?user_id=${chatUserId}`,
          { message },
        );
      setMessage("");
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  };

  useEffect(() => {
    const channel = pusherClient.subscribe("chat");
    channel.bind("chat-event", function (data: Message) {
      setSelectedChat((prevState) => {
        const id = prevState[prevState.length - 1]?._id;
        if (id === data?._id) return prevState;
        return [...prevState, data];
      });
    });

    return () => {
      pusherClient.unsubscribe("chat");
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 border-r border-gray-800 overflow-y-auto">
        <List
          className="cursor-pointer"
          itemLayout="horizontal"
          dataSource={chatUsers}
          renderItem={(user) => (
            <List.Item
              onClick={() => handleSelectChat(`${user?._id}`)}
              className={chatUserData?._id === user?._id ? "bg-gray-200" : ""}
            >
              <List.Item.Meta
                avatar={
                  <div className="relative">
                    <Image
                      src={user?.image ? user?.image : s3bucket.NO_USER_IMG}
                      width={40}
                      height={40}
                      style={{ borderRadius: "0px 15px 0px 0px" }}
                      alt="profile-image"
                    />
                    {/* <span
                      className={`absolute -top-1 -left-1 w-2 h-2 rounded-full border-1 border-white`}
                    ></span> */}
                  </div>
                }
                title={user?.name}
                // description={<p>{user?.lastMessage}</p>}
              />
            </List.Item>
          )}
        />
      </div>
      <div className="flex-1 p-4">
        {chatUserId && session?.user?.id && (
          <>
            <div
              style={{ zIndex: 0 }}
              className="flex items-center mb-4 border border-red-800 w-full relative"
            >
              <Image
                src={
                  chatUserData?.image
                    ? chatUserData?.image
                    : s3bucket.NO_USER_IMG
                }
                width={40}
                height={40}
                style={{ borderRadius: "0px 15px 0px 0px" }}
                className="mr-4"
                alt="profile"
              />
              <div>
                <p className="text-lg font-semibold">{chatUserData?.name}</p>
                {/* <p
                  className={
                    selectedChat.online ? "text-green-500" : "text-red-500"
                  }
                >
                  {selectedChat.online ? "Online" : "Offline"}
                </p> */}
              </div>
            </div>
            <div
              style={{
                height: "calc(100% - 80px)",
                overflowY: "auto",
                zIndex: -2,
              }}
            >
              <div className="mt-5 mb-5">
                {loading && <AntSpin size="large" />}
              </div>
              {selectedChat.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex-grow  pt-16 message-container ${
                    message?.sender === session?.user?.id
                      ? "outgoing"
                      : "incoming"
                  }`}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent:
                      message?.sender === session?.user?.id
                        ? "flex-end"
                        : "flex-start",
                    marginBottom: "15px",
                  }}
                >
                  <UserOutlined
                    className="mr-2"
                    style={{ alignSelf: "flex-end", marginBottom: "8px" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "8px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "gray" }}>
                      {message?.sender === session?.user?.id
                        ? userData?.name
                        : chatUserData?.name}
                    </span>
                    <div
                      style={{
                        border: "2px solid grey",
                        borderRadius: "10px 10px 10px 0px",
                        maxWidth: "70%",
                        padding: "10px",
                        boxSizing: "border-box",
                      }}
                      className="message-content"
                    >
                      {message?.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ width: "100%", height: "150px" }}></div>
            <div
              style={{ position: "fixed", bottom: 0, width: "75%", zIndex: 1 }}
              className="flex items-center p-4 bg-gray-300"
            >
              <Input
                value={message}
                placeholder="Type a message..."
                className="flex-1 border border-gray-800"
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                type={message ? "primary" : "default"}
                className="ml-2 border border-gray-800 bg-slate-900 text-tahiti"
                onClick={() => sendMessage(message)}
              >
                {message ? "Send" : "Write msg to send"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
