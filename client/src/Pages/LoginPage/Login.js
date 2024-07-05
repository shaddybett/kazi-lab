// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "flowbite-react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const navigate = useNavigate();
//   const backendUrl = process.env.REACT_APP_BACKEND_URL;

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${backendUrl}/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem("token", data.access_token);
//         localStorage.setItem("id", data.id);
//         if (data.role_id === 2) {
//           navigate("/providerPage");
//         } else {
//           navigate("/clientPage");
//         }
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error);
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later");
//     }
//     if (rememberMe) {
//       localStorage.setItem("rememberMe", "true");
//       localStorage.setItem("email", email);
//       localStorage.setItem("password", password);
//     } else {
//       localStorage.removeItem("rememberMe");
//       localStorage.removeItem("email");
//       localStorage.removeItem("password");
//     }
//   };

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         setError("");
//       }, 5000);
//       return () => clearTimeout(timer); // Cleanup the timer on component unmount or error change
//     }
//   }, [error]);

//   return (
//     <div>
//       <div>
//         <div>
//           <div>{/* <img src={Logo} alt="Logo"/> */}</div>
//         </div>
//         <div>
//           <div>
//             <div>
//               <h3>Sign In</h3>
//             </div>
//             <form onSubmit={handleLogin}>
//               <div>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Email"
//                 />
//               </div>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Password"
//                 />
//                 <div
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </div>
//               </div>
//               <div>
//                 <Button type="submit">Sign in</Button>
//               </div>
//               {error && <p className="text-red-500">{error}</p>}
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={() => setRememberMe(!rememberMe)}
//                   className="mr-2"
//                 />
//                 Remember me
//               </label>
//             </form>
//             <p className="text-gray-900">
//               Don't have an account?{" "}
//               <Link
//                 to="/signup"
//                 className="text-sm text-blue-300 hover:text-blue-700"
//               >
//                 Sign Up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css"; // Import your CSS file

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
        setError("");
      }, 5000);
      return () => clearTimeout(timer); // Cleanup the timer on component unmount or error change
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
            <Button type="submit" className="login-button">
              Login
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
    </div>
  );
}

export default Login;
