import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Button,
  TextInput,
  Label,
  Checkbox,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Profile() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    national_id: "",
    phone_number: "",
    new_password: "",
    old_password: "",
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const handleEntry = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await fetch(`${backendUrl}/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
          setForm({
            first_name: responseData.first_name || "",
            middle_name: responseData.middle_name || "",
            last_name: responseData.last_name || "",
            national_id: responseData.national_id || "",
            phone_number: responseData.phone_number || "",
            old_password: "",
            new_password: "",
          });
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
    };
    handleEntry();
  }, [refresh, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    if (name === "new_password" || name === "old_password") {
      setPasswordError(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await fetch(`${backendUrl}/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setMessage(responseData.message);
          navigate("/");
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const updatedFields = {};
      Object.keys(form).forEach((key) => {
        if (form[key]) {
          updatedFields[key] = form[key];
        }
      });
      const formData = new FormData();
      formData.append("image", image);
      const imageResponse = await fetch(`${backendUrl}/update-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const response = await fetch(`${backendUrl}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok ) {
        const responseData = await response.json();
        setMessage(responseData.message);
        setRefresh(!refresh);
        setShowUpdateForm(false);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 py-10">
      <div className="flex justify-center items-center">
        <div className="flex justify-between w-full max-w-6xl">
          <div className="max-w-sm shadow-lg p-6 bg-white rounded-lg">
            <div className="flex items-center gap-5">
              <Avatar img={data.image} size="xl" rounded={true} />
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Name:
                  <p className="text-lg text-gray-600">
                    {data.first_name} {data.middle_name} {data.last_name}
                  </p>
                </h3>
                <h3 className="text-xl font-bold text-gray-800">
                  Email:
                  <p className="text-lg text-gray-600">{data.email}</p>
                </h3>
                {data.phone_number && (
                  <h3 className="text-xl font-bold text-gray-800">
                    Phone:
                    <p className="text-lg text-gray-600">{data.phone_number}</p>
                  </h3>
                )}
                {data.national_id && (
                  <h3 className="text-xl font-bold text-gray-800">
                    National ID:
                    <p className="text-lg text-gray-600">{data.national_id}</p>
                  </h3>
                )}
              </div>
            </div>
            <Button
              className="mt-5 w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowUpdateForm(!showUpdateForm)}
            >
              Update Profile
            </Button>
            <Button
              className="mt-5 w-full bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </div>

          {showUpdateForm && (
            <div className="max-w-md ml-10 shadow-lg p-6 bg-white rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="first_name" value="First Name" />
                  <TextInput
                    id="first_name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="middle_name" value="Middle Name" />
                  <TextInput
                    id="middle_name"
                    name="middle_name"
                    value={form.middle_name}
                    onChange={handleChange}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" value="Last Name" />
                  <TextInput
                    id="last_name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="national_id" value="National ID" />
                  <TextInput
                    id="national_id"
                    name="national_id"
                    value={form.national_id}
                    onChange={handleChange}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number" value="Phone Number" />
                  <TextInput
                    id="phone_number"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    className="mt-1 w-full"
                  />
                </div>
                <h2>Want to change your password?</h2>
                <div>
                  <Label htmlFor="old_password" value="Old Password" />
                  <TextInput
                    id="old_password"
                    name="old_password"
                    type={showPassword ? "text" : "password"}
                    value={form.old_password}
                    onChange={handleChange}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="new_password" value="New Password" />
                  <TextInput
                    id="new_password"
                    name="new_password"
                    type={showPassword ? "text" : "password"}
                    value={form.new_password}
                    onChange={handleChange}
                    className="mt-1 w-full"
                  />
                  <div className="mt-2 flex items-center">
                    <Checkbox
                      id="show_password"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <Label htmlFor="show_password" className="ml-2">
                      Show Password
                    </Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="file-upload" value="Upload Image" />
                  <input
                    id="file-upload"
                    type="file"
                    className="mt-1 w-full"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <Button
                  className="mt-5 w-full bg-green-600 text-white hover:bg-green-700"
                  type="submit"
                >
                  Save Changes
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
      {error && <p className="mt-5 text-center text-red-500">{error}</p>}
      {message && <p className="mt-5 text-center text-green-500">{message}</p>}
    </div>
  );
}

export default Profile;
