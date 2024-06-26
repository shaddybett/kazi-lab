import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label, Checkbox } from "flowbite-react";
import { Button } from "flowbite-react";
import { v4 as uuidv4 } from "uuid";
// import Logo from '../Landing Page/assets/images/logo.png';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const uuid = uuidv4();

  localStorage.setItem("signupUUID", uuid);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
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
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
      const iiid = localStorage.getItem("signupUUID");
    console.log(first_name, last_name, email, password, iiid);

    try {
      const response = await fetch("/signup", {
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
          uuid: localStorage.getItem("signupUUID"),
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
    <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-blue-900 via-gray-900 to-blue-800 bottom-0 leading-5 h-full w-full overflow-hidden">
      <div className="relative min-h-screen flex justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
            {/* <img src={Logo} alt="" className="w-32 mb-6" /> */}
            <h1 className="my-3 font-semibold text-4xl">Welcome</h1>
            <p className="pr-3 text-sm opacity-75">
              Welcome! You can book a worker of your choice here. You will get the best services.
            </p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10 ">
          <div className="p-10 pb-0 bg-glass mx-auto rounded-3xl w-full max-w-md mb-10">
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-gray-800">Sign Up</h3>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="clientCheckbox"
                  value="Client"
                  onChange={handleRoleChange}
                  checked={selectedRole === "Client"}
                />
                <Label htmlFor="client">Client</Label>
                <Checkbox
                  id="providerCheckbox"
                  value="Service Provider"
                  onChange={handleRoleChange}
                  checked={selectedRole === "Service Provider"}
                />
                <Label htmlFor="provider">Service Provider</Label>
              </div>
              <input
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="text"
                placeholder="Enter your first name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="text"
                placeholder="Enter your last name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                Show password
              </label>
              <Button
                type="submit"
                className="w-full flex justify-center bg-blue-900 hover:bg-blue-1000 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
              >
                Submit
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
            <p className="text-gray-900 mt-4">
              You have an account?{" "}
              <Link to="/login" className="text-sm text-blue-700 hover:text-blue-300">
                Login
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-2 my-5">
              <span className="h-px w-16 bg-gray-100"></span>
              <p className="text-sm text-gray-900 font-normal">Or continue with</p>
              <span className="h-px w-16 bg-gray-100"></span>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                className="w-full flex justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
              >
                <div className="flex items-center justify-center">
                  <svg className="h-6 w-6 text-gray-800" viewBox="0 0 512 512">
                    <path
                      fill="currentColor"
                      d="M462.72 262.55c.33 2.88.53 5.79.53 8.73 0 85.94-55.46 147.36-131.3 147.36-68.58 0-101.53-45.49-118.79-69.36h-4.31c-17.25 23.9-50.28 69.36-118.85 69.36-75.84 0-131.29-61.42-131.29-147.36 0-84.44 56.2-147.36 132.11-147.36 19.7 0 37.86 3.54 54.3 10.07 4.59 1.76 9.63-.93 11.12-5.24C76.82 83.05 96.8 48 131.07 32c19.48-9.14 42.23-13.8 68.11-13.8 23.48 0 45.88 5.64 66.86 17.22 5.01 2.72 10.66.35 13.17-4.3 6.36-11.89 14.65-22.71 24.46-32.29 15.91-15.1 35.09-27.15 56.36-35.85 20.96-8.6 43.42-12.81 66.78-12.81 60.41 0 107.29 23.56 140.32 67.65 10.23 13.54 18.25 29.01 23.68 46.11 5.77 18.09 8.72 37.71 8.72 58.64 0 22.16-3.38 44.12-10.05 65.33-2.36 7.5.7 15.69 7.88 19.72 18.58 10.44 36.01 22.57 52.21 36.13 8.79 7.39 17.53 15.12 26.05 22.96z"
                    />
                  </svg>
                </div>
                <span className="ml-4">Continue with Google</span>
              </button>
            </div>
            <p className="text-sm text-center text-gray-900 mt-4">
              By signing in you agree to our{" "}
              <a href="#" className="text-blue-700 hover:text-blue-900">
                terms and conditions
              </a>
            </p>
          </div>
        </div>
      </div>
      <svg
        className="absolute bottom-0 left-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#fff"
          fillOpacity="1"
          d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
      <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js"></script>
    </div>
  );
}

export default Signup;
