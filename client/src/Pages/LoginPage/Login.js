import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css"; 
import BlockedUser from "./BlockedUser";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe] = useState(false);
  const [openBlockedUserPage, setOpenBlockedUserPage] = useState(false);
  const [blockedUserDetails, setBlockedUserDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("id", data.id);
        if (data.role_id === 2) {
          navigate("/providerPage");
        } else if (data.role_id === 3) {
          navigate("/clientPage");
        } else if (data.role_id === 1) {
          navigate("/adminPage");
        }
      } else {
        const errorMessage = await response.json();
        if (errorMessage.error === 'You have been blocked from accessing this site!') {
          setBlockedUserDetails(errorMessage);
          setOpenBlockedUserPage(true);
        }
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later");
    }
    setLoading(false);
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
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
    <div className="login-container background">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username or Email"
              className="login-input"
            />
          </div>
          <div className="input-group relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="login-input"
            />
            <div
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <div className="button-group">
            <Button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <Spinner aria-label="Large spinner example" size="lg" />
              ) : (
                "Login"
              )}
            </Button>
          </div>
          {error && <p className="error-text">{error}</p>}
          <div className="login-links">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Sign up here!
              </Link>
            </p>
          </div>
        </form>
      </div>
      {openBlockedUserPage && <BlockedUser details={blockedUserDetails} />}
    </div>
  );
}

export default Login;
