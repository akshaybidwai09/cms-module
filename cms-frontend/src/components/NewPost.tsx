import React, { useState } from "react";
import "./NewPost.css";
import axios from "axios";

const NewPost = () => {
  const [postContent, setPostContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve email from local storage
    const storedUserInfo = localStorage.getItem("userProfile");
    let userEmail = storedUserInfo ? JSON.parse(storedUserInfo).email : "";

    if (!userEmail) {
      setMessage("User email not found. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("email", userEmail);
    formData.append("blogText", postContent);
    if (file) {
      formData.append("file", file);
    }
    formData.append("category", category);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/userfeed/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.statusCode === 200) {
        setMessage("Content Successfully Posted!");
      } else {
        setMessage("Something went wrong while uploading content!");
      }
    } catch (error) {
      setMessage("An error occurred while posting the content.");
    }
  };

  return (
    <div className="new-post-container">
      {message && <div className="new-post-form-message">{message}</div>}
      <form onSubmit={handleSubmit} className="new-post-form">
        <div className="new-post-fields-container">
          <textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={handleTextChange}
            required
          ></textarea>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          <select value={category} onChange={handleCategoryChange}>
            <option value="sports">Sports</option>
            <option value="social">Social</option>
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="entertainment">Entertainment</option>
          </select>
        </div>
        <button type="submit">Submit Post</button>
      </form>
    </div>
  );
};

export default NewPost;
