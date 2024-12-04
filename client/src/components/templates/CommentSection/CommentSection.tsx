import React, { useContext, useState } from "react";
import { Input, Button, List, Avatar, Typography, Popconfirm } from "antd";
import { SendOutlined, DeleteOutlined } from "@ant-design/icons";
const { Text } = Typography;
const { TextArea } = Input;
import "./CommentSection.scss";
import { CommentType } from "../../../types/Comment";
import { formatDate } from "../../../helpers/date";
import { CurrentUserContext } from "../../../context/CurrentUserContext";

interface CommentSectionProps {
  onDeleteComment: (id: number) => void;
  onAddComment: (comment: Partial<CommentType>) => void;
  comments: Partial<CommentType>[];
  isLoading?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, isLoading, onAddComment, onDeleteComment }) => {
  // State for storing comments
  const [newComment, setNewComment] = useState<string>("");
  const context = useContext(CurrentUserContext);
  const currentUserId = context?.currentUserContext?.id;
  // Function to handle adding a comment
  const addComment = () => {
    if (newComment.trim() === "") return;
    onAddComment({ text: newComment });
    setNewComment("");
  };

  return (
    <div>
      {/* Comment Input */}
      <TextArea
        className='comment-input'
        autoSize={{ minRows: 2, maxRows: 8 }}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder='Add a comment...'
      />
      <div className='comment-btn'>
        <Button
          icon={<SendOutlined />}
          shape='round'
          type='primary'
          onClick={addComment}
          color='primary'
          variant='outlined'
        >
          Post Comment
        </Button>
      </div>

      {/* Comment List */}
      <List
        itemLayout='horizontal'
        dataSource={comments}
        loading={isLoading}
        renderItem={(comment) => (
          <List.Item
            actions={
              comment.createdby?.id === currentUserId
                ? [
                    <Popconfirm
                      title='Are you sure you want to delete this comment?'
                      onConfirm={() => comment?.id && onDeleteComment(comment.id)}
                      okText='Yes'
                      cancelText='No'
                    >
                      <Button icon={<DeleteOutlined />} danger type='text' />
                    </Popconfirm>,
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar size={38} style={{ backgroundColor: "#f3eae2", color: "#755c42" }}>
                  <Text strong style={{ display: "flex", justifyContent: "center" }}>
                    {comment?.createdby?.firstName?.substring(0, 2).toUpperCase()}
                  </Text>
                </Avatar>
              }
              title={
                <>
                  <Text>{comment?.createdby?.firstName}</Text>
                  <Text type='secondary' className='comment-time'>
                    {formatDate(comment?.createdAt)}
                  </Text>
                </>
              }
              description={<div className='comment-text'>{comment?.text}</div>}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default CommentSection;
