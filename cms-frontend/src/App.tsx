import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import UserRegistration from "./components/UserRegistration";
import MainPage from "./components/MainPage";
import "./App.css";

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Router>
      <div className="App">
        <header className="header">EchoSphere</header>
        <Switch>
          {/* Define the route for the main page (post-login) */}
          <Route path="/main">
            <MainPage />
          </Route>
          {/* Default route */}
          <Route path="/">
            {showLogin ? (
              <>
                <Login />
                <button className="inactive-button" onClick={toggleForm}>
                  Register
                </button>
              </>
            ) : (
              <>
                <UserRegistration />
                <button className="inactive-button" onClick={toggleForm}>
                  Login
                </button>
              </>
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
