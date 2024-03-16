import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Login.css";

type UserLoginData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<UserLoginData>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/auth/login",
        loginData
      );
      if (response.data.statusCode === 200) {
        // Store user profile in local storage
        localStorage.setItem(
          "userProfile",
          JSON.stringify(response.data.response)
        );
        history.push("/main");
      } else {
        setMessage(response.data.error);
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.error || "An error occurred during login."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login to Your Account</h2>
        {message && <div className="login-message">{message}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
