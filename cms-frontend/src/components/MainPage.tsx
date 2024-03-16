// src/components/MainPage.tsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useHistory,
  Redirect,
} from "react-router-dom";
import Profile from "./Profile";
import Activity from "./Activity";
import NewPost from "./NewPost";
import Feed from "./feed"; // Import Feed
import "./MainPage.css";

const MainPage = () => {
  // const history = useHistory();

  // useEffect(() => {
  //   history.push("/activity");
  // }, [history]);

  return (
    <Router>
      <div className="main-page">
        <nav className="sidebar">
          <ul>
            <li>
              <Link to="/activity">My Posts</Link>
            </li>
            <li>
              <Link to="/feed">All Posts</Link>
            </li>
            <li>
              <Link to="/new-post">Create Post</Link>
            </li>
            <li>
              <Link to="/profile">My Profile</Link>
            </li>
          </ul>
        </nav>

        <div className="content-area">
          <Switch>
            <Route exact path="/main">
              <Activity />
            </Route>
            <Route path="/activity">
              <Activity />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/new-post">
              <NewPost />
            </Route>
            <Route path="/feed">
              <Feed />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default MainPage;
