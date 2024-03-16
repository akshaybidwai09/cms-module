import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./UserRegistration.css";

type UserRegistrationData = {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  password: string;
};

const UserRegistration: React.FC = () => {
  const [userData, setUserData] = useState<UserRegistrationData>({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split(".")[0] + "Z"; // Formats to ISO without milliseconds
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDob = formatDate(userData.dob);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/auth/register",
        { ...userData, dob: formattedDob },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.statusCode === 200) {
        localStorage.clear();
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
        error.response?.data?.error || "An error occurred during registration."
      );
    }
  };

  return (
    <div className="registration-container">
      {message && <div className="registration-message">{message}</div>}
      <div className="registration-form">
        <h2>Create Your Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
          />
          <input
            type="date"
            name="dob"
            value={userData.dob}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />
          <button className="registration-button" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
