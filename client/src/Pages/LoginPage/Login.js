import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch( `${backendUrl}/login` , {
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
        } else {
          navigate("/clientPage");
        }
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later");
    }
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
        setError('');
      }, 5000);
      return () => clearTimeout(timer); // Cleanup the timer on component unmount or error change
    }
  }, [error]);

  return (
    <div >
      <div >
        <div >
          <div >
            {/* <img src={Logo} alt="Logo"/> */}
          </div>
        </div>
        <div >
          <div>
            <div >
              <h3 >Sign In</h3>
            </div>
            <form onSubmit={handleLogin} >
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  
                />
              </div>
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label className="text-sm text-gray-200">Show Password</label>
              </div>
              <div >
              </div>
              <div>
                <Button type="submit" >
                  Sign in
                </Button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2"
                />
                Remember me
              </label>
            </form>
            <p className="text-gray-900">Don't have an account? <Link to="/signup" className="text-sm text-blue-300 hover:text-blue-700">Sign Up</Link></p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

