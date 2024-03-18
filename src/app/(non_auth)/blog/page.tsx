"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Blog() {
  const [blog, setBlog] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const path = pathname.split("/");
  const endPath = path[path?.length - 1];
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blog/${endPath}`);
        if (!response?.data?.data)
          throw new Error(`Response data from backend is missing ${blog}`);
        setBlog(response?.data?.data);
      } catch (error) {
        router.back();
      }
    };
    fetchBlog();
  }, [session]);
  return <>Hi</>;
}
