import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
// import Logo from '../Landing Page/assets/images/logo.png';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
    <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-blue-900 via-gray-900 to-blue-800 bottom-0 leading-5 h-full w-full overflow-hidden">
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
            {/* <img src={Logo} alt="Logo"/> */}
            <h1 className="my-3 font-semibold text-4xl">Welcome back</h1>
            <p className="pr-3 text-sm opacity-75">Always continue to book workers from here. We give the best services.</p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-glass mx-auto rounded-3xl w-100">
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-gray-800">Sign In</h3>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="text-sm  py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2 "
                />
                <label className="text-sm text-gray-200">Show Password</label>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm ml-auto">
                  <a href="#" className="text-white hover:text-purple-600">Forgot your password?</a>
                </div>
              </div>
              <div>
                <Button type="submit" className="w-full flex justify-center bg-blue-900 hover:bg-blue-1000 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500">
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
            <div className="flex items-center justify-center mt-4">
              <button className="w-full flex justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500">
                <div className="flex items-center justify-center">
                  <svg className="h-6 w-6 text-gray-800" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8c0-18.3-1.6-36-4.5-53.5H249.5v101h134.3c-5.8 31.2-23 57.5-49 75.2v62.6h78.8c46.2-42.7 72.5-105.7 72.5-185.3z"/>
                    <path fill="currentColor" d="M249.5 507.9c67.2 0 123.3-22.3 164.5-60.4l-78.8-62.6c-22 14.8-50.5 23.6-85.7 23.6-65.8 0-121.4-44.4-141.4-104.1H18.1v65.6C59.4 447.2 144.4 507.9 249.5 507.9z"/>
                    <path fill="currentColor" d="M108.1 308.9c-10.2-30.5-10.2-64.2 0-94.7V148.6H18.1c-39.8 77.6-39.8 162.8 0 240.4l90-80.1z"/>
                    <path fill="currentColor" d="M249.5 97.6c34.3 0 65.2 11.8 89.5 34.6l67.1-67.1C372.8 32.2 316.7 10.1 249.5 10.1 144.4 10.1 59.4 70.8 18.1 157.5l90 80.1c20-59.7 75.6-104.1 141.4-104.1z"/>
                  </svg>
                  <span className="ml-2">Google</span>
                </div>
              </button>
            </div>
            <div className="flex justify-center mt-6">
              <button className="w-full flex justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500">
                <div className="flex items-center justify-center">
                  <svg className="h-6 w-6 text-gray-800" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M512 97.25a206.78 206.78 0 0 1-59.43 16.28A103.68 103.68 0 0 0 498 57.1a206.36 206.36 0 0 1-65.62 25A103.26 103.26 0 0 0 351.09 0C293.29 0 247 46.3 247 103.22a103.8 103.8 0 0 0 2.56 23.59A294.03 294.03 0 0 1 34.12 18.49a103.04 103.04 0 0 0 31.85 137.78A102.29 102.29 0 0 1 20 144.62v1.28A103.32 103.32 0 0 0 100.21 245a103.21 103.21 0 0 1-46.62 1.77 103.27 103.27 0 0 0 96.37 71.59A206.87 206.87 0 0 1 0 411.18a291.85 291.85 0 0 0 157.96 46.3c189.4 0 293.19-157 293.19-293.19 0-4.46-.1-8.91-.3-13.34a209.39 209.39 0 0 0 51.15-53.7z"/>
                  </svg>
                  <span className="ml-2">Twitter</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

