import React, { useState } from "react";
import { Input, Button, List, Avatar, Typography, Popconfirm } from "antd";
import { SendOutlined, DeleteOutlined } from "@ant-design/icons";
const { Text } = Typography;
const { TextArea } = Input;
import "./CommentSection.scss";
import { CommentType } from "../../../types/Comment";
import { formatDate } from "../../../helpers/date";

interface CommentSectionProps {
  onDeleteComment: (id: number) => void;
  onAddComment: (comment: Partial<CommentType>) => void;
  comments: Partial<CommentType>[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment, onDeleteComment }) => {
  // State for storing comments
  const [newComment, setNewComment] = useState<string>("");
  const currentUserId = 1;
  // Function to handle adding a comment
  const addComment = () => {
    if (newComment.trim() === "") return;
    onAddComment({ text: newComment });
    setNewComment("");
  };

  const deleteComment = (id: number) => {
    onDeleteComment(id);
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
        renderItem={(comment) => (
          <List.Item
            actions={
              comment.createdby?.id === currentUserId
                ? [
                    <Popconfirm
                      title='Are you sure you want to delete this comment?'
                      onConfirm={() => comment?.id && deleteComment(comment.id)}
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
