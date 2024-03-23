"use client";
import { Avatar, Button, List, Popover, Skeleton } from "antd";
import { CommentsProps } from "@/utils/types/state";
import Link from "next/link";
import { DeleteOutlined } from "@ant-design/icons";
import { ObjectId } from "mongodb";
import { s3bucket } from "@/constants/service";

const Comments = ({ commentProps }: { commentProps: CommentsProps }) => {
  const {
    comments,
    commentLoading,
    remainComments,
    userId,
    loadMoreComments,
    handleDeleteComment,
  } = commentProps;
  const loadMore =
    remainComments && remainComments > 0 ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={loadMoreComments}>load more comments</Button>
      </div>
    ) : null;

  const content = (id: ObjectId) => {
    const content = "Are you sure you want to delete the comment?";
    return (
      <div>
        <p>{content}</p>
        <div
          style={{ margin: "10px 0px", display: "flex", justifyContent: "end" }}
        >
          <Button
            onClick={() => {
              handleDeleteComment && handleDeleteComment(id);
            }}
            type="primary"
          >
            Delete Comment
          </Button>
        </div>
      </div>
    );
  };
  return (
    <>
      <List
        className="demo-loadmore-list"
        loading={commentLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={comments}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Popover
                key={index}
                content={() => content(item?._id)}
                trigger="click"
              >
                {item?.author?._id === userId ? (
                  <Button
                    style={{ border: "0" }}
                    icon={<DeleteOutlined />}
                    size="small"
                  ></Button>
                ) : null}
              </Popover>,
            ]}
            key={index}
          >
            <Skeleton avatar title={false} loading={commentLoading} active>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      item?.author?.image
                        ? item?.author?.image
                        : s3bucket.NO_USER_IMG
                    }
                  />
                }
                title={
                  <Link href={`/profile/${item?.author?._id}`}>
                    {item?.author?.name}
                  </Link>
                }
                description={item?.content}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  );
};

export default Comments;
