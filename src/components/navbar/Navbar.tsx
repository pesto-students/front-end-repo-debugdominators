"use client";
import { Menu } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { s3bucket } from "@/constants/service";

const Navbar = ({ session }: { session: string | undefined }) => {
  const itemStylingBlack = { color: "black", fontWeight: "bold" };
  const itemStylingWhite = { color: "white", fontWeight: "bold" };
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const updateScreenWidth = () => {
    if (window.innerWidth < 380) setMobile(true);
    else {
      setMobile(false);
      setCollapsed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateScreenWidth);
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  return (
    <>
      <div className="navbar">
        <Menu
          theme="dark"
          mode={collapsed ? "vertical" : "horizontal"}
          style={{
            backgroundColor: "lightgray",
            width: "100%",
            display: "flex",
            flexDirection: `${collapsed ? "column" : "row"}`,
            justifyContent: "space-around",
          }}
          inlineCollapsed={collapsed}
        >
          <Menu.Item key="logo">
            <Link href="/dashboard">
              <Image width={50} height={50} src={s3bucket.LOGO} alt="logo" />
            </Link>
          </Menu.Item>
          {mobile && !collapsed ? (
            <UnorderedListOutlined
              onClick={toggleCollapsed}
              style={{ fontSize: "30px", ...itemStylingBlack }}
            />
          ) : (
            <>
              <Menu.Item key="home">
                <Link
                  href="/dashboard"
                  style={collapsed ? itemStylingWhite : itemStylingBlack}
                >
                  Home
                </Link>
              </Menu.Item>
              <Menu.Item key="profile">
                <Link
                  href="/profile"
                  style={collapsed ? itemStylingWhite : itemStylingBlack}
                >
                  Profile
                </Link>
              </Menu.Item>
              <Menu.Item key="chat">
                <Link
                  href="/chat"
                  style={collapsed ? itemStylingWhite : itemStylingBlack}
                >
                  Chat
                </Link>
              </Menu.Item>
              {session ? (
                <Menu.Item
                  key="logout"
                  onClick={async () => {
                    await signOut();
                    router.push("/auth/login");
                  }}
                  style={collapsed ? itemStylingWhite : itemStylingBlack}
                >
                  Logout
                </Menu.Item>
              ) : (
                <Menu.Item
                  key="login"
                  style={collapsed ? itemStylingWhite : itemStylingBlack}
                >
                  Login
                </Menu.Item>
              )}
              <Menu.Item key="space" style={{ width: "50px" }}></Menu.Item>
            </>
          )}
        </Menu>
      </div>
    </>
  );
};

export default Navbar;
