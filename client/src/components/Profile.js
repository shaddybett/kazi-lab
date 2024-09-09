import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Button,
  TextInput,
  Label,
  Checkbox,
  Modal,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './Components.css'

function Profile() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    national_id: "",
    phone_number: "",
    new_password: "",
    old_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
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

      // Image upload
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }

      // Upload the image if it exists
      let imageResponse;
      if (image) {
        imageResponse = await fetch(`${backendUrl}/update-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      // Perform the profile update
      const response = await fetch(`${backendUrl}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      // Check for errors in both the profile update and image upload
      if (!response.ok) {
        // If the response is not ok, extract the error message
        const errorResponse = await response.json();
        setError(errorResponse.error || "An error occurred");
        return;
      }

      if (image && !imageResponse.ok) {
        const imageError = await imageResponse.json();
        setError(imageError.error || "Image upload failed");
        return;
      }

      // Success
      const responseData = await response.json();
      setMessage(responseData.message);
      setRefresh(!refresh);
      setIsModalOpen(false); // Close modal on success
    } catch (error) {
      // General error fallback
      setError("An error occurred. Please try again later.");
    }
  };
  const onClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if ((error, message)) {
      const timer = setTimeout(() => {
        setError("");
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="prof from-gray-100 to-gray-300 py-10">
      {/* <div className="flex justify-center items-center"> */}
        <div className="prof-1">
          <div className=" max-w-sm ml-80 shadow-lg p-6 bg-white rounded-lg">
            {/* Center the image with avatar */}
            <div className="flex flex-col items-center">
              <Avatar img={data.image} size="xl" rounded={true} />

              {/* Name Section */}
              <div className="text-center ">
                <p className=" prof-title text-lg text-gray-800">
                  {data.first_name} {data.last_name}
                </p>
                <p className="text-lg text-gray-600">{data.email}</p>
              </div>
              {/* Phone Number Section */}
              {data.phone_number && (
                <div className="text-center mt-2">
                  <h3 className="text-xl font-bold text-gray-800">Phone:</h3>
                  <p className="text-lg text-gray-600">{data.phone_number}</p>
                </div>
              )}

              {/* National ID Section */}
              {data.national_id && (
                <div className="text-center mt-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    National ID:
                  </h3>
                  <p className="text-lg text-gray-600">{data.national_id}</p>
                </div>
              )}
            </div>

            {/* Buttons Section */}
            <Button
              className="mt-5 w-full bg-blue-900 text-white hover:bg-blue-400 transition duration-300 ease-in-out"
              onClick={() => setIsModalOpen(true)} // Show modal when clicked
            >
              Update Profile
            </Button>

            <Button
              className="mt-5 w-full bg-red-600 text-white hover:bg-red-700 transition duration-300 ease-in-out"
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </div>

          {/* Modal for updating the profile */}
          <Modal
            show={isModalOpen}
            size="lg"
            popup={true}
            onClose={() => setIsModalOpen(false)}
            className="rounded-lg shadow-lg"
          >
            {/* Modal Header with Title */}
            <Modal.Header>
              <h2 className="text-2xl font-semibold text-gray-800">
                Edit User Details
              </h2>
            </Modal.Header>

            <Modal.Body>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name Field */}
                <div>
                  <Label htmlFor="first_name" value="First Name" />
                  <TextInput
                    id="first_name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    className="mt-1 w-full"
                    required
                  />
                </div>

                {/* Last Name Field */}
                <div>
                  <Label htmlFor="last_name" value="Last Name" />
                  <TextInput
                    id="last_name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className="mt-1 w-full"
                    required
                  />
                </div>

                {/* Conditionally render National ID and Phone Number */}
                {form.national_id && (
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
                )}
                {form.phone_number && (
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
                )}

                {/* Password Change Section */}
                <h2 className="text-xl font-medium text-gray-700">
                  Want to change your password?
                </h2>

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
                    <Label
                      htmlFor="show_password"
                      className="ml-2 text-gray-600"
                    >
                      Show Password
                    </Label>
                  </div>
                </div>

                {/* File Upload Field */}
                <div>
                  <Label htmlFor="file-upload" value="Change image" />
                  <input
                    id="file-upload"
                    type="file"
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-md p-2"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  {image && (
                    <p className="text-sm text-gray-500 mt-2">{image.name}</p>
                  )}
                </div>

                {/* Save Button */}
                <Button
                  className="mt-5 w-full bg-blue-900 text-white hover:bg-blue-700 transition-all duration-300"
                  type="submit"
                >
                  Save Changes
                </Button>
              </form>
            </Modal.Body>

            <Modal.Footer className="bg-gray-300" >
              <Button
                color="black"
                className="bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300"
                onClick={onClose}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      {/* </div> */}
      {error && <p className="mt-5 text-center text-red-500">{error}</p>}
      {message && <p className="mt-5 text-center text-green-500">{message}</p>}
    </div>
  );
}

export default Profile;
