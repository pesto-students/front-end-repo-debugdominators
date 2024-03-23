import { Button, Image, Input, Popover, Tooltip } from "antd";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  EditOutlined,
  LikeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import Comments from "@/components/blog/Comments";
import Link from "next/link";
import AntSpin from "@/components/shared/atomic/AntSpin";
import { s3bucket } from "@/constants/service";
import { BlogContentProps, BlogDetailPorps } from "@/utils/types/state";
import AntAlert from "../shared/atomic/AntAlert";

const Detail = ({ props }: { props: BlogDetailPorps }) => {
  const {
    loading,
    commentLoading,
    alert,
    isAlert,
    userId = undefined,
    blog,
    comment,
    isAuthor,
    editMeta,
    deleteConetent,
    isEditContent,
    editContent,
    remainComments,
    handleRedirect,
    comments,
    deletContent,
    likingBlog,
    savingBlog,
    pathToEdit,
    setComment,
    handleSubmitComment,
    handleShowComments,
    loadMoreComments,
    handleDeleteComment,
    isCommentShow,
  } = props;
  const commentProps = {
    comments,
    userId,
    commentLoading,
    remainComments,
    loadMoreComments,
    handleDeleteComment,
  };
  const deletePopup = (elem: BlogContentProps) => {
    const content = "Are you sure you want to delete this data?";
    return (
      <div>
        <p>{content}</p>
        <div
          style={{ margin: "10px 0px", display: "flex", justifyContent: "end" }}
        >
          <Button
            onClick={() => deletContent && deletContent(elem && elem?._id)}
            style={{ background: "red", color: "white", fontWeight: "bold" }}
          >
            Delete Data
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="mt-5">{loading && <AntSpin size="large" />}</div>
      <Image
        height={500}
        width="100%"
        src={blog?.bannerImg}
        alt="Banner Image"
      />
      <div className="flex mt-4 justify-between">
        <div className="block text-blue-500">{blog?.topic}</div>
        {isAuthor && (
          <div className="block text-right text-blue-500">
            <Tooltip title="Edit this text data">
              <EditOutlined
                onClick={handleRedirect}
                style={{ fontSize: "15px", marginRight: "10px" }}
              />
              Edit Blog
            </Tooltip>
          </div>
        )}
      </div>
      <div className="w-3/4 mx-auto mt-8 p-4">
        {editMeta && (
          <div className="flex justify-center mb-5 cursor-pointer">
            <Tooltip title="Edit meta data like banner image, topic, and heading">
              <EditOutlined onClick={pathToEdit} style={{ fontSize: "50px" }} />
            </Tooltip>
          </div>
        )}
        <h1 className="text-2xl font-bold text-center">{blog?.heading}</h1>
        <p className="mt-4">
          {blog?.content?.map((elem) => {
            {
              if (Object.keys(elem)[0] === "html" && elem.html)
                return (
                  <>
                    <div className="flex justify-center">
                      {isEditContent && (
                        <div className="flex justify-center mb-5 cursor-pointer mt-16">
                          <Tooltip title="Edit this text data">
                            <EditOutlined
                              onClick={() => editContent && editContent(elem)}
                              style={{ fontSize: "25px" }}
                            />
                          </Tooltip>
                        </div>
                      )}
                      {deleteConetent && (
                        <div className="flex justify-center mb-5 cursor-pointer ml-5 mt-16">
                          <Tooltip title="Delete this text data">
                            <Popover
                              content={() => deletePopup(elem)}
                              trigger="click"
                            >
                              <DeleteOutlined style={{ fontSize: "25px" }} />
                            </Popover>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    <div
                      className="mt-5"
                      dangerouslySetInnerHTML={{ __html: elem.html }}
                    />
                  </>
                );
              if (Object.keys(elem)[0] === "image" && elem.image)
                return (
                  <div className="mt-5">
                    <div className="flex justify-center">
                      {isEditContent && (
                        <div className="flex justify-center mb-5 cursor-pointer mt-16">
                          <Tooltip title="Edit this image data">
                            <EditOutlined
                              onClick={() => editContent && editContent(elem)}
                              style={{ fontSize: "25px" }}
                            />
                          </Tooltip>
                        </div>
                      )}
                      {deleteConetent && (
                        <div className="flex justify-center mb-5 cursor-pointer ml-5 mt-16">
                          <Tooltip title="Delete this image data">
                            <Popover
                              content={() => deletePopup(elem)}
                              trigger="click"
                            >
                              <DeleteOutlined style={{ fontSize: "25px" }} />
                            </Popover>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    <Image
                      width={"100%"}
                      style={{ maxHeight: "600px" }}
                      src={elem.image}
                      alt="content-img"
                    />
                  </div>
                );
              if (Object.keys(elem)[0] === "video" && elem.video)
                return (
                  <>
                    <div className="flex justify-center">
                      {isEditContent && (
                        <div className="flex justify-center mb-5 cursor-pointer mt-16">
                          <Tooltip title="Edit this video data">
                            <EditOutlined
                              onClick={() => editContent && editContent(elem)}
                              style={{ fontSize: "25px" }}
                            />
                          </Tooltip>
                        </div>
                      )}
                      {deleteConetent && (
                        <div className="flex justify-center mb-5 cursor-pointer ml-5 mt-16">
                          <Tooltip title="Delete this video data">
                            <Popover
                              content={() => deletePopup(elem)}
                              trigger="click"
                            >
                              <DeleteOutlined style={{ fontSize: "25px" }} />
                            </Popover>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    <div
                      className="mt-5"
                      dangerouslySetInnerHTML={{ __html: elem.video }}
                    />
                  </>
                );
              if (Object.keys(elem)[0] === "url" && elem.url)
                return (
                  <>
                    <div className="flex justify-center">
                      {isEditContent && (
                        <div className="flex justify-center mb-5 cursor-pointer mt-16">
                          <Tooltip title="Edit this URL data">
                            <EditOutlined
                              onClick={() => editContent && editContent(elem)}
                              style={{ fontSize: "25px" }}
                            />
                          </Tooltip>
                        </div>
                      )}
                      {deleteConetent && (
                        <div className="flex justify-center mb-5 cursor-pointer ml-5 mt-16">
                          <Tooltip title="Delete this URL data">
                            <Popover
                              content={() => deletePopup(elem)}
                              trigger="click"
                            >
                              <DeleteOutlined style={{ fontSize: "25px" }} />
                            </Popover>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    <Link
                      className="mt-5 flex justify-center italic font-bold text-blue-500 text-xl"
                      href={elem.url}
                    >
                      {elem.url}
                    </Link>
                  </>
                );
            }
          })}
        </p>
        {comments && (
          <>
            <div className="flex justify-between mt-8 mb-12 flex-col md:flex-row">
              <div className="flex items-center  justify-between">
                <div className="flex justify-center items-center flex-col md:flex-row">
                  <Image
                    style={{ height: "60px", width: "60px" }}
                    className="w-14 h-14 border-2"
                    src={
                      blog?.author?.image
                        ? blog?.author?.image
                        : s3bucket.NO_USER_IMG
                    }
                    alt="profile-image"
                  />
                  <p className="pl-5">
                    <Link href={`/profile/${blog?.author?._id}`}>
                      {blog?.author?.name}
                    </Link>
                  </p>
                </div>

                <div className="flex justify-center items-center flex-col md:flex-row">
                  <p className="pl-5">
                    {new Date(blog?.updatedAt).toDateString()}
                  </p>
                  <p className="pl-5">{blog?.readingTime} min read</p>
                </div>
              </div>
              <div className="flex items-center  justify-between mt-5 md:mt-0">
                <Button
                  onClick={likingBlog}
                  style={{ border: "0" }}
                  icon={
                    <LikeOutlined
                      style={{
                        color:
                          blog?.likedUsers &&
                          userId &&
                          blog?.likedUsers.includes(userId)
                            ? "green"
                            : "inherit",
                      }}
                    />
                  }
                  size="large"
                ></Button>
                <Button
                  onClick={savingBlog}
                  style={{ border: "0" }}
                  icon={
                    <SaveOutlined
                      style={{
                        color:
                          blog?.savedUsers &&
                          userId &&
                          blog?.savedUsers.includes(userId)
                            ? "green"
                            : "inherit",
                      }}
                    />
                  }
                  size="large"
                ></Button>
              </div>
            </div>

            <Input.TextArea
              value={comment}
              onChange={(e) => setComment && setComment(e.target.value)}
              placeholder="Add to discussion"
              className="border w-full mt-4"
              rows={4}
              style={{ border: "2px slate" }}
            />
            <div
              style={{
                margin: "10px 0px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button onClick={handleSubmitComment} type="primary">
                Add Comment
              </Button>
            </div>
            {isAlert ? (
              <AntAlert {...alert} />
            ) : (
              <h1 className="text-2xl font-bold mt-8">
                Comments{" "}
                <Button
                  onClick={handleShowComments}
                  className="ml-3"
                  icon={
                    isCommentShow ? (
                      <Tooltip title="Hide Comments">
                        <CaretUpOutlined />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Show Comments">
                        <CaretDownOutlined />
                      </Tooltip>
                    )
                  }
                  size="small"
                ></Button>
              </h1>
            )}
            {isCommentShow ? <Comments commentProps={commentProps} /> : ""}
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
