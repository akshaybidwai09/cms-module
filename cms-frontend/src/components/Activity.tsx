import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "./Activity.css";

type UserFeedItem = {
  blogText: string;
  uploadedDate: string;
  file: {
    type: number;
    data: string;
  };
  video: boolean;
  category: string | null;
};

const Activity = () => {
  const [userFeed, setUserFeed] = useState<UserFeedItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All", "General"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserFeed = async () => {
      const userProfile = localStorage.getItem("userProfile");
      if (!userProfile) {
        setError("User profile not found. Please login.");
        return;
      }

      const { email } = JSON.parse(userProfile);

      try {
        const response = await axios.post(
          "http://127.0.0.1:8080/api/userfeed/get-user-feed",
          { email }
        );
        if (response.data.statusCode === 200) {
          setUserFeed(response.data.response);
          const uniqueCategories = new Set<string>(
            response.data.response
              .map((item: UserFeedItem) => item.category || "general")
              .filter((category: string) => category !== "general") // Filter out 'General'
          );
          setCategories(["All", "general", ...Array.from(uniqueCategories)]);
        } else {
          setError(response.data.error || "Failed to fetch user feed.");
        }
      } catch {
        setError("No Feed Against User");
      }
    };

    fetchUserFeed();
  }, []);

  const renderFile = (item: UserFeedItem) => {
    if (item.video && item.file.data) {
      return (
        <video
          src={`data:video/mp4;base64,${item.file.data}`}
          controls
          style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
        />
      );
    } else if (!item.video && item.file.data) {
      return (
        <img
          src={`data:image/jpeg;base64,${item.file.data}`}
          alt="User Post"
          style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
        />
      );
    }
    return null;
  };

  const toggleCategory = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "All" : category);
  };

  const filteredFeed =
    selectedCategory === "All"
      ? userFeed
      : userFeed.filter((item) => item.category === selectedCategory);

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  const formatDate = (dateString: string | number | Date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div className="activity">
      <h1>Your Posts</h1>
      <div className="categories">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => toggleCategory(category)}
            className={`category-button ${
              selectedCategory === category ? "active" : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="activity-feed">
        {filteredFeed.length > 0 ? (
          filteredFeed.map((item, index) => (
            <div key={index} className="activity-item">
              {renderFile(item)}
              <p className="blog-text">{item.blogText}</p>

              <div className="post-footer">
                <div className="post-category">{item.category}</div>
                <div className="post-info">
                  Posted on {formatDate(item.uploadedDate)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-activity">No activity to display.</p>
        )}
      </div>
    </div>
  );
};

export default Activity;
