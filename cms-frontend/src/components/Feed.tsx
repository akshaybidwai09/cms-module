import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Activity.css";

type Feedback = {
  user: string;
  comment: string;
  commentDate: string;
};

type Post = {
  id: string;
  userName: string;
  email: string;
  blogText: string;
  uploadedDate: string;
  file: {
    type: number;
    data: string;
  };
  category: string;
  feedbacks: Feedback[] | null;
  video: boolean;
};

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [filterType, setFilterType] = useState("all");
  const [filterText, setFilterText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch(
      "http://127.0.0.1:8080/api/userfeed/get-users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: filterType, filterText }),
      }
    );
    const data = await response.json();
    if (data.statusCode === 200) {
      setPosts(data.response);
    }
  };

  const addComment = async (postEmail: string, postId: string, commentText: string) => {
    let commentingUserEmail = "";
    let commentingUserName = "Anonymous"; // Default placeholder name
  
    const storedUserInfo = localStorage.getItem("userProfile");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      commentingUserEmail = userInfo.email || "";
      const firstName = userInfo.firstName || "Anonymous";
      const lastName = userInfo.lastName || "";
  
      // Use the names if they are not empty, else use the placeholder
      commentingUserName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (commentingUserName.trim() === "") {
        commentingUserName = "Anonymous";
      }
    } 
  
    if (!commentText || commentText.trim() === "") {
      console.error("Comment text is empty.");
      return;
    }

    const response = await fetch(
      'http://127.0.0.1:8080/api/userfeed/add-comment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: postEmail, // Email of the post owner
          postId: postId,
          comment: {
            [commentingUserEmail]: commentText, // Comment made by the logged-in user
          },
        }),
      }
    );
    
    const data = await response.json();
    if (data.statusCode === 200) {
      setNewComment("");
      await fetchPosts();
     
    }
  };

  const renderMedia = (post: Post) => {
    if (post.video && post.file && post.file.data) {
      return (
        <video
          src={`data:video/mp4;base64,${post.file.data}`}
          controls
          style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
        />
      );
    } else if (!post.video && post.file && post.file.data) {
      return (
        <img
          src={`data:image/jpeg;base64,${post.file.data}`}
          alt="User Post"
          style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
        />
      );
    }
    return null;
  };

  const renderFeedbacks = (feedbacks: Feedback[] | null) => {
    if (!feedbacks || feedbacks.length === 0) {
      return <div className="feedback-section">No comments yet.</div>;
    }
  
    return (
      <div className="feedback-section">
        {feedbacks.map((feedback, index) => (
          <div key={index} className="feedback">
            <strong>{feedback.user ? `${feedback.user.firstName} ${feedback.user.lastName}` : "Anonymous"}:</strong> 
            {feedback.comment}
            <div className="feedback-date">{formatDate(feedback.commentDate)}</div>
          </div>
        ))}
      </div>
    );
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setFilterText(date);
    } else {
      setFilterText("");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateString);
    const utcDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
    return utcDate.toLocaleDateString(undefined, options);
  };

  return (
    <div className="activity">
      <h1>All Posts</h1>
      <div className="search-bar">
        <select onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="date">Date</option>
          <option value="name">Name</option>
          <option value="category">Category</option>
        </select>
        {filterType === "date" ? (
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select a Date"
          />
        ) : (
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setFilterText(e.target.value)}
          />
        )}
        <button onClick={fetchPosts}>Search</button>
      </div>

      <div className="activity-feed">
        {posts.map((post, index) => (
          <div key={index} className="activity-item">
            {renderMedia(post)}
            <p className="blog-text">{post.blogText}</p>
            <div className="post-footer">
              <div className="post-category">{post.category}</div>
              <div className="post-info">
                Posted by {post.userName} on {formatDate(post.uploadedDate)}
              </div>
            </div>
             {renderFeedbacks(post.feedbacks)}
            <div className='add-comment-form'>
              <input
                type='text'
                placeholder='Add a comment...'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={() => addComment(post.email, post.id, newComment)}>Comment</button>
            </div>
    </div>
  ))}
      </div>
    </div>
  );
};

export default Feed;
