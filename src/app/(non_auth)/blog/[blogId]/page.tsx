"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  AntAlertProps,
  Author,
  BlogProps,
  CommentProps,
} from "@/utils/types/state";
import Detail from "@/components/blog/Detail";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ObjectId } from "mongodb";
import AntSpin from "@/components/shared/atomic/AntSpin";

export default function Dashboard() {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [isCommentShow, setIsCommentShow] = useState(false);
  const [alert, setAlert] = useState<AntAlertProps>({
    message: "",
    description: "",
    type: "error",
    isShowIcon: true,
    handleClick: () => {},
  });
  const [isAlert, setIsAlert] = useState(false);
  const pathname = usePathname();
  const blogId = pathname.split("/");
  const { data: session } = useSession();
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
  const [blog, setBlog] = useState<BlogProps>(initialBlog);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [remainComments, setRemainComments] = useState(0);
  const [page, setPage] = useState(1);
  const [isAuthor, setIsAuthor] = useState(false);

  const handleShowComments = async () => {
    setIsCommentShow(!isCommentShow);
  };

  const handleClick = () => setIsAlert(false);

  const loadMoreComments = () => {
    setPage(page + 1);
  };

  const likingBlog = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog`, {
        userId: session?.user?.id,
        blogId: blogId[2],
        like: true,
      });
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  };

  const savingBlog = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog`, {
        userId: session?.user?.id,
        blogId: blogId[2],
        save: true,
      });
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  };

  const handleRedirect = () => router.push(`/blog/${blogId[2]}/edit`);

  const handleSubmitComment = async () => {
    try {
      const response = await axios.post(`/api/blog/${blogId[2]}/comment`, {
        content: comment,
        author: session?.user?.id,
      });
      if (response?.data?.data) {
        setComments((prev: CommentProps[]) => {
          return [...prev, ...(response?.data?.data?.comments || [])];
        });
        setComment("");
        setAlert({
          message: "Comment Created",
          description: "Your new comment created successfully.",
          type: "success",
          isShowIcon: true,
          handleClick,
        });
        setIsAlert(true);
      }
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  };

  const handleDeleteComment = async (commentId: ObjectId) => {
    setCommentLoading(true);
    try {
      const response = await axios.delete(
        `/api/blog/${blogId[2]}/comment?author=${session?.user?.id}&comment_id=${commentId}`,
      );
      setCommentLoading(false);
      if (response?.data?.data?.deletedCount) {
        setPage(1);
        setIsCommentShow(false);
        setAlert({
          message: "Comment Deleted",
          description: "Your comment deleted successfully.",
          type: "success",
          isShowIcon: true,
          handleClick,
        });
        setIsAlert(true);
      }
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      setCommentLoading(true);
      try {
        const response = await axios.get(
          `/api/blog/${blogId[2]}/comment?page=${page}`,
        );
        const responseCommnets = response?.data?.data?.comments;
        setComments((prevData: CommentProps[]) => {
          const lastPrevDataId = prevData?.[prevData.length - 1]?._id;
          const lastCommentId =
            responseCommnets?.[responseCommnets?.length - 1]?._id;
          if (lastPrevDataId === lastCommentId) return responseCommnets;
          return [...prevData, ...responseCommnets];
        });
        setRemainComments(response?.data?.data?.remain_count);
        setCommentLoading(false);
      } catch (error) {
        throw new Error(JSON.stringify(error));
      }
    };
    fetchComments();
  }, [page]);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog/${blogId[2]}`,
        );
        if (!response?.data?.data)
          throw new Error(`Response data from backend is missing`);
        if (session?.user?.id) {
          if (response?.data?.data?.author?._id === session?.user?.id)
            setIsAuthor(true);
          else
            await axios.put(
              `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/blog`,
              { userId: session?.user?.id, blogId: blogId[2], seen: true },
            );
        }
        setBlog(response?.data?.data);
        setLoading(false);
      } catch (error) {
        router.push("/dashboard");
      }
    };
    fetchBlog();
  }, [session?.user?.id]);

  const props = {
    isAlert,
    alert,
    userId: session?.user?.id && session?.user?.id,
    handleRedirect,
    isAuthor,
    handleDeleteComment,
    loadMoreComments,
    likingBlog,
    savingBlog,
    remainComments,
    commentLoading,
    comments,
    isCommentShow,
    handleShowComments,
    handleSubmitComment,
    setComment,
    comment,
    loading,
    blog,
  };

  return (
    <>
      {loading ? (
        <div className="mt-16">
          <AntSpin size="large" />
        </div>
      ) : (
        <Detail props={props} />
      )}
    </>
  );
}
