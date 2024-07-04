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
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


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
    <div>
      <div>
        <div >
        </div>
        <div>
          <div >
            <div >
              <h3 className="font-semibold text-2xl text-gray-800">Sign Up</h3>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div >
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
               
                type="text"
                placeholder="Enter your first name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                
                type="text"
                placeholder="Enter your last name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                
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
