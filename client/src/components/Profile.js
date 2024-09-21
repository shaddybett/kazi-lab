import React, { useEffect, useState, useCallback } from "react";
import {
  Avatar,
  Button,
  TextInput,
  Label,
  Checkbox,
  Modal,
  Select,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Components.css";

function Profile({ minimize }) {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [counties, setCounties] = useState([]); // Counties list
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    national_id: "",
    phone_number: "",
    new_password: "",
    old_password: "",
    county: "", // County now managed here
  });
  const [showPassword, setShowPassword] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch user data
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
            county: responseData.county || "", // Populate county from user data
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

  // Handle form input changes
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

  // Delete account
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

  // Fetch all counties
  const fetchAllCounties = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/county`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setCounties(responseData.all_counties || []);
      } else {
        setError("Error fetching all counties");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchAllCounties();
  }, [fetchAllCounties]);

  // Handle form submission (profile update)
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
          updatedFields[key] = form[key]; // Collect form data
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

      // Handle potential errors
      if (!response.ok) {
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
      setError("An error occurred. Please try again later.");
    }
  };

  // Close modal
  const onClose = () => {
    setIsModalOpen(false);
  };

  // Auto-clear error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      <div className={`${minimize ? " " : " profile "}`}>
        <div className="max-w-sm lg:max-w-md xl:max-w-lg mx-auto lg:mx-0 lg:ml-20 shadow-lg p-6 bg-white rounded-lg transition-all duration-300 hover:shadow-2xl ">
          {/* Center the image with avatar */}
          <div className="flex flex-col items-center space-y-4  ">
            <Avatar img={data.image} size="xl" rounded={true} />

            {/* Name Section */}
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-800">
                {data.first_name} {data.last_name}
              </p>
              <p className="text-md text-gray-600">{data.email}</p>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col space-y-3 mt-6">
            <Button
              className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-400 transition duration-300 ease-in-out"
              onClick={() => setIsModalOpen(true)} // Show modal when clicked
            >
              Update Profile
            </Button>
            <Button
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </div>
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

              {form.county && (
                <div>
                  <h2 className="text-lg font-medium text-gray-700 mt-5">
                    Change County
                  </h2>
                  <Label
                    htmlFor="counties"
                    className="text-white"
                    value={form.county}
                  />
                  <Select
                    id="counties"
                    required
                    value={form.county} // Directly tied to form.county
                    onChange={(e) =>
                      setForm({ ...form, county: e.target.value })
                    } // Updates form.county
                    className="input-field"
                  >
                    <option value={form.county}>{form.county} County</option>
                    {counties.map((county) => (
                      <option key={county.id} value={county.name}>
                        {county.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
              {/* Password Change Section */}
              <h2 className="text-lg font-medium text-gray-700 mt-5">
                Change Password
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
                  <Label htmlFor="show_password" className="ml-2 text-gray-600">
                    Show Password
                  </Label>
                </div>
                {passwordError && <p>{passwordError}</p>}
              </div>

              <div>
                {data.image ? (
                  <h2 className="text-lg font-medium text-gray-700 mt-5">
                    Change Profile image
                  </h2>
                ) : (
                  <h2 className="text-lg font-medium text-gray-700 mt-5">
                    Add profile image
                  </h2>
                )}

                <input
                  id="file-upload"
                  type="file"
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-md "
                  onChange={(e) => setImage(e.target.files[0])}
                />
                {image && (
                  <p className="text-sm text-gray-500 mt-2">{image.name}</p>
                )}
              </div>

              {/* Save Button */}
              <Button
                className="mt-5 w-full bg-blue-900 text-white hover:bg-blue-700 transition-all duration-300 py-2 rounded-lg"
                type="submit"
              >
                Save Changes
              </Button>
            </form>
          </Modal.Body>

          <Modal.Footer className="bg-gray-100 py-3">
            <Button
              className="bg-gray-600 hover:bg-gray-700 text-white  rounded-lg transition-all duration-300"
              onClick={onClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {error && <p className="mt-5 text-center text-red-500">{error}</p>}
      {message && <p className="mt-5 text-center text-green-500">{message}</p>}
    </div>
  );
}

export default Profile;
