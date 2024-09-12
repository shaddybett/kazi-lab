import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ServiceProvider from "../../assets/gear.png";
import InNeedOfService from "../../assets/customer.png";
import "./Signup.css";
import { Spinner } from 'flowbite-react';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const uuid = uuidv4();
    localStorage.setItem("signupUUID", uuid);
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const mapRoleToId = (role) => {
    switch (role) {
      case "Client":
        return 3;
      case "Service Provider":
        return 2;
      default:
        return null;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const uuid = localStorage.getItem("signupUUID");

    try {
      const response = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          selectedRole: mapRoleToId(selectedRole),
          uuid,
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("id", responseData.id);
        if (responseData.role_id === 2) {
          navigate("/provider-details");
        } else {
          navigate("/login");
        }
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred, please try again later!");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      <div className=" w-full  sign-up-page">
        <div className="sign-up-page-title">
          <h1>Sign Up</h1>
          <p>Please select your role to proceed.</p>
        </div>
        <div className="select-role">
          <div
            className={`role-option ${
              selectedRole === "Service Provider" ? "selected" : ""
            }`}
            onClick={() => handleRoleChange("Service Provider")}
          >
            <img src={ServiceProvider} alt="Service Provider" />
            <p>I Can Work</p>
            <p className="disappear">Showcase your service and get clients.</p>
          </div>
          <div
            className={`role-option ${
              selectedRole === "Client" ? "selected" : ""
            }`}
            onClick={() => handleRoleChange("Client")}
          >
            <img src={InNeedOfService} alt="In Need Of Service" />
            <p>I Need Service</p>
            <p className="disappear">Find trusted providers nearby.</p>
          </div>
        </div>
        <div className="sign-up-form">
          <form onSubmit={handleSignup}>
            <label htmlFor="first-name">First Name</label>
            <input
              id="first-name"
              type="text"
              placeholder="First name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="last-name">Last Name</label>
            <input
              id="last-name"
              type="text"
              placeholder="Last name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Enter Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="show-password">
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
              />
              <label>Show password</label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? (
                <Spinner aria-label="Loading" size="sm" className="mr-2" />
              ) : (
                "Signup"
              )}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
          <p>
            Go Back to <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
