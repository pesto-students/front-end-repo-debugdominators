"use client";
import { Menu } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  SignatureOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = ({ session }: { session: string | undefined }) => {
  const router = useRouter();
  return (
    <>
      <Menu
        style={{
          background: "lightgray",
          display: "flex",
          justifyContent: "space-between",
        }}
        mode="horizontal"
      >
        <Menu style={{ background: "lightgray", display: "flex" }}>
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link href="/dashboard">BlogMingle</Link>
          </Menu.Item>
          <Menu.Item key="write" icon={<SignatureOutlined />}>
            <Link href="/blog/new">Write</Link>
          </Menu.Item>
        </Menu>
        <Menu style={{ background: "lightgray", display: "flex" }}>
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <Link href="/profile">Profile</Link>
          </Menu.Item>
          {session ? (
            <Menu.Item
              key="logout"
              onClick={async () => {
                await signOut();
                router.push("/auth/login");
              }}
              icon={<LogoutOutlined />}
            >
              Logout
            </Menu.Item>
          ) : (
            <Menu.Item key="login" icon={<LoginOutlined />}>
              Login
            </Menu.Item>
          )}
        </Menu>
      </Menu>
    </>
  );
};

export default Navbar;
