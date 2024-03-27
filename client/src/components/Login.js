import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        if (data.role_id === 2) {
            console.log(data.role_id);
            navigate("/clientPage");
          } else {
            console.log("Redirecting to providerPage");
            navigate("/providerPage");
          }
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred.Please try again later");
    }

  };


  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="*********"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
        {error && <p>{error}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>{" "}
      </p>
    </div>
  );
}

export default Login;
