import React, { useState, useEffect, useRef, useCallback } from "react";
import Modal from "react-modal";
import {
  Avatar,
  Dropdown,
  Navbar,
  Card,
  Button,
  Spinner,
  FileInput,
  Label,
} from "flowbite-react";
import {
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiUser,
  HiArrowSmLeft,
  HiMenu,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import ServiceDropdown from "./ServiceDropdown";
import "./ProviderDashboard.css";
import ServiceProviderChatBox from "../Pages/Chatbox/ServiceProviderChatbox";
import ProviderUpdates from "./ProviderUpdates";
import Profile from "./Profile";
import Uploads from "./Uploads";

Modal.setAppElement("#root");

function ProviderDashboard() {
  const [data, setData] = useState({});
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [error, setError] = useState("");
  const [newService, setNewService] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [openClientsPage, setOpenClientsPage] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [profileOpen, setProfileOpen] = useState(false);

  const currentUserId = localStorage.getItem("id");

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };
  const handleFull = () => {
    setIsFull(true);
  };
  const handleProfile = () => {
    navigate("/profile", { state: { isFull: true, isSidebarMinimized } });
  };
  const handleUpload = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Upload!",
    });
    if (result.isConfirmed) {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      const imageExtensions = ["png", "jpg", "jpeg", "webp"];

      for (const file of files) {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (imageExtensions.includes(fileExtension)) {
          formData.append("photos", file);
        } else {
          formData.append("videos", file);
        }
      }

      try {
        const response = await fetch(`${backendUrl}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (response.ok) {
          const responseData = await response.json();
          Swal.fire("Success", "Upload successful", "success");
          setPhotos(responseData.photos || []);
          setVideos(responseData.videos || []);
          setError("");
          handleEntry();
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    });
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setServices(responseData.services || []);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  }, [backendUrl]);

  const fetchAllServices = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/service`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setAllServices(responseData.all_services || []);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  }, [backendUrl]);

  const handleEntry = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
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
        setPhotos(responseData.photos || []);
        setVideos(responseData.videos || []);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error || "An error occurred");
      }
      if (response.status === 422 || response.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
        return;
      }
    } catch (error) {
      setError("An error occurred. Please try again later");
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchData();
    fetchAllServices();
    handleEntry();
  }, [fetchData, fetchAllServices, handleEntry]);
  const handleDelete = async (fileUrl, fileType) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete!",
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const fileName = fileUrl.split("/").pop();
        const deleteResponse = await fetch(
          `${backendUrl}/delete-upload/${fileType}/${fileName}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (deleteResponse.ok) {
          Swal.fire("Success", "File deleted successfully", "success");
          handleEntry();
        } else {
          const errorMessage = await deleteResponse.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    }
  };

  const handlePhotoDelete = (photoUrl) => handleDelete(photoUrl, "photo");
  const handleVideoDelete = (videoUrl) => handleDelete(videoUrl, "video");

  const handleAddService = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add Service!",
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${backendUrl}/add-service`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            service_name: newService,
            existing_services: selectedServices.map((service) => service.id),
          }),
        });
        if (response.ok) {
          setNewService("");
          setError("");
          Swal.fire("Success", "Service added successfully", "success");
          fetchData();
        } else {
          const errorMessage = await response.json();
          if (
            errorMessage.error ===
            "Service entered already exists,please mark from the list provided"
          ) {
            setError(errorMessage.error);
            setNewService("");
            fetchAllServices();
            const timer = setTimeout(() => {
              setError("");
            }, 5000);
            return () => clearTimeout(timer);
          } else {
            setError(errorMessage.error || "An error occurred");
          }
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete!",
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${backendUrl}/delete-service/${serviceId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          Swal.fire("Success", "Service deleted successfully", "success");
          fetchData();
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    }
  };

  const handleCheckboxChange = (service) => {
    const selectedIndex = selectedServices.findIndex(
      (s) => s.id === service.id
    );
    if (selectedIndex === -1) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const openModal = (media, type) => {
    if (type === "image") {
      setSelectedImage(media);
      setSelectedVideo(null);
    } else if (type === "video") {
      setSelectedImage(null);
      setSelectedVideo(media);
      setIsVideoLoading(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedVideo(null);
    setIsVideoLoading(false);
  };

  const handleChatClick = (data) => {
    setChatUser(data);
  };

  const closeChat = () => {
    setChatUser(null);
  };

  const closeUpdates = () => {
    setOpenClientsPage(false);
  };

  const handleClientsClick = () => {
    setOpenClientsPage(true);
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarMinimized(true); // Minimize sidebar on small screens
      } else {
        setIsSidebarMinimized(false); // Expand sidebar on larger screens
      }
    };

    // Check screen size on initial load
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="general-sidebar flex h-screen text-white  ">
      <div
        className={` ${isSidebarMinimized ? "w-20" : "w-64"} 
        h-full p-2 flex flex-col transition-all duration-300 ease-in-out 
        ${!isSidebarMinimized ? "bg-gray-200" : "bg-gray-800"}`}
        sidebar
      >
        <div className="flex justify-end ">
          <HiMenu
            className={`text-xl cursor-pointer mb-2 ${
              isSidebarMinimized ? "text-white" : "text-gray-900"
            }`}
            // className="text-gray-900 text-xl cursor-pointer mb-2"
            onClick={() => setIsSidebarMinimized(!isSidebarMinimized)} // Toggle sidebar state
          />
        </div>

        <div
          className={`flex flex-col items-center mb-4 transition-all duration-300 ${
            isSidebarMinimized ? "hidden" : "block"
          }`}
        >
          <Avatar
            img={data.image}
            size="xl"
            rounded={true}
            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setActiveComponent("profile")}
          />
          <span className="admin-name text-black ">
            {data.first_name} {data.last_name}
          </span>
          <span className="admin-email">{data.email}</span>
        </div>

        <div
          className={` flex flex-col space-y-2 flex-grow transition-all duration-300 bg-gray-500 rounded-sm ${
            isSidebarMinimized ? "w-20" : "w-64"
          }board `}
        >
          <div
            className={`relative group flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-600 hover:text-white transition-colors ${
              activeComponent === "dashboard"
                ? "bg-gray-600 text-white"
                : "text-white"
            }`}
            onClick={() => setActiveComponent("dashboard")}
          >
            <HiChartPie
              className={`mr-3 ${
                isSidebarMinimized ? "text-2xl ml-3 " : "text-xl"
              }`}
              //  className="mr-3 text-xl"
            />

            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Dashboard</span>}

            {/* Tooltip when sidebar is minimized */}
            {isSidebarMinimized && (
              <span className="absolute left-full ml-4 px-2 py-1 rounded bg-gray-700 text-white text-sm tooltip group-hover:opacity-100">
                Dashboard
              </span>
            )}
          </div>
          <div
            className={`relative group flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-600 hover:text-white transition-colors ${
              activeComponent === "profile"
                ? "bg-gray-600 text-white"
                : "text-white"
            }`}
            onClick={() => setActiveComponent("profile")}
          >
            <HiUser
              className={`mr-3 ${
                isSidebarMinimized ? "text-2xl ml-3" : "text-xl"
              } `}
            />

            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Profile</span>}

            {/* Tooltip when sidebar is minimized */}
            {isSidebarMinimized && (
              <span className="absolute left-full ml-4 px-2 py-1 rounded bg-gray-700 text-white text-sm tooltip group-hover:opacity-100">
                Profile
              </span>
            )}
          </div>

          <div
            className={`relative group flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-600 hover:text-white transition-colors ${
              activeComponent === "chat"
                ? "bg-gray-600 text-white"
                : "text-white"
            }`}
            onClick={() => setActiveComponent("chat")}
          >
            <HiInbox
              className={`mr-3 ${
                isSidebarMinimized ? "text-2xl ml-3 " : "text-xl"
              } `}
            />

            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Inbox</span>}

            {/* Tooltip when sidebar is minimized */}
            {isSidebarMinimized && (
              <span className="absolute left-full ml-4 px-2 py-1 rounded bg-gray-700 text-white text-sm tooltip group-hover:opacity-100">
                Inbox
              </span>
            )}
          </div>
          <div
            className={`relative group flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-600 hover:text-white transition-colors ${
              activeComponent === "uploads"
                ? "bg-gray-600 text-white"
                : "text-white"
            }`}
            onClick={() => setActiveComponent("uploads")}
          >
            <HiShoppingBag
              className={`mr-3 ${
                isSidebarMinimized ? "text-2xl ml-3" : "text-xl"
              }`}
            />

            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Uploads</span>}

            {/* Tooltip when sidebar is minimized */}
            {isSidebarMinimized && (
              <span className="absolute left-full ml-4 px-2 py-1 rounded bg-gray-700 text-white text-sm tooltip group-hover:opacity-100">
                Uploads
              </span>
            )}
          </div>

          <div
            className={`relative group flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-600 hover:text-white transition-colors ${
              activeComponent === "clients"
                ? "bg-gray-600 text-white"
                : "text-white"
            }`}
            onClick={() => setActiveComponent("clients")}
          >
            <HiUser
              className={`mr-3 ${
                isSidebarMinimized ? "text-2xl ml-3" : "text-xl"
              }`}
            />

            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Clients</span>}

            {/* Tooltip when sidebar is minimized */}
            {isSidebarMinimized && (
              <span className="absolute left-full ml-4 px-2 py-1 rounded bg-gray-700 text-white text-sm tooltip group-hover:opacity-100">
                Clients
              </span>
            )}
          </div>

          <div
            className="flex items-center p-2 rounded-sm cursor-pointer hover:bg-red-800 hover:text-white text-white transition-colors bg-red-600"
            onClick={handleLogout}
          >
            <HiArrowSmLeft
              className={`mr-3 ${
                isSidebarMinimized ? "text-3xl ml-2 " : "text-2xl"
              }`}
            />
            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Logout</span>}
          </div>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-auto  rounded-lg shadow-md">
        {activeComponent === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Hello, {data.first_name}!
            </h2>

            {/* Service List Section */}
            <div className="mb-8">
              <p className="text-xl font-semibold text-white underline mb-4">
                Services You Offer
              </p>

              {services.length > 0 ? (
                <ul className="space-y-4">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center"
                    >
                      <span className="font-medium text-lg text-gray-800">
                        {service.name}
                      </span>
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-500 text-lg">No services registered</p>
              )}
            </div>

            {/* Add New Service Section */}
            <div className="">
              <input
                className="rounded-lg border border-blue-300 p-3 w-full mb-4 text-gray-900 flex-grow shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Add a new service"
              />
              <button
                className="upload-btn size-sm "
                onClick={handleAddService}
              >
                Add
              </button>
            </div>
          </div>
        )}

        {activeComponent === "profile" && (
          <Profile minimize={isSidebarMinimized} />
        )}
        {activeComponent === "chat" && (
          <ServiceProviderChatBox
            minimize={isSidebarMinimized}
            providerId={currentUserId}
          />
        )}
        {activeComponent === "uploads" && <Uploads minimized={isSidebarMinimized} />}
        {activeComponent === "clients" && (
          <ProviderUpdates
            senderId={data.id}
            assigned={data.jobs || 0}
            likes={data.likes || 0}
            minimized={isSidebarMinimized}
            className={isSidebarMinimized ? "min-updates" : "updates"}
            onClose={closeUpdates}
          />
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import Modal from "react-modal";
// import {
//   Avatar,
//   Dropdown,
//   Navbar,
//   Card,
//   Button,
//   Spinner,
//   FileInput,
//   Label,
// } from "flowbite-react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
// import ServiceDropdown from "./ServiceDropdown";
// import "./ProviderDashboard.css";
// import ServiceProviderChatBox from "../Pages/Chatbox/ServiceProviderChatbox";
// import ProviderUpdates from "./ProviderUpdates";
// import Profile from "./Profile";

// Modal.setAppElement("#root");

// function ProviderDashboard() {
//   const [data, setData] = useState({});
//   const [services, setServices] = useState([]);
//   const [allServices, setAllServices] = useState([]);
//   const [error, setError] = useState("");
//   const [newService, setNewService] = useState("");
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [files, setFiles] = useState([]);
//   const [photos, setPhotos] = useState([]);
//   const [videos, setVideos] = useState([]);
// const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [isVideoLoading, setIsVideoLoading] = useState(false);
//   const [chatUser, setChatUser] = useState(null);
//   const [openClientsPage, setOpenClientsPage] = useState(false);
//   const [isFull,setIsFull] = useState(false)
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
// const backendUrl = process.env.REACT_APP_BACKEND_URL;
//   const [profileOpen,setProfileOpen] = useState(false);

//   const currentUserId = localStorage.getItem("id");

//   const handleFileChange = (event) => {
//     const selectedFiles = event.target.files;
//     setFiles(selectedFiles);
//   };
//   const handleFull = ()=>{
//     setIsFull(true)
//   }
//   const handleProfile = () => {
//     navigate('/profile', { state: { isFull: true, isSidebarMinimized  } })
//   };
//   const handleUpload = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Upload!",
//     });
//     if (result.isConfirmed) {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       const imageExtensions = ["png", "jpg", "jpeg", "webp"];

//       for (const file of files) {
//         const fileExtension = file.name.split(".").pop().toLowerCase();
//         if (imageExtensions.includes(fileExtension)) {
//           formData.append("photos", file);
//         } else {
//           formData.append("videos", file);
//         }
//       }

//       try {
//         const response = await fetch(`${backendUrl}/upload`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         });
//         if (response.ok) {
//           const responseData = await response.json();
//           Swal.fire("Success", "Upload successful", "success");
//           setPhotos(responseData.photos || []);
//           setVideos(responseData.videos || []);
//           setError("");
//           handleEntry();
//         } else {
//           const errorMessage = await response.json();
//           setError(errorMessage.error || "An error occurred");
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later.");
//       }
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Logout!",
//     });
//     if (result.isConfirmed) {
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   };
//   const fetchData = useCallback(async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/offers`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         setServices(responseData.services || []);
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error);
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later.");
//     }
//   }, [backendUrl]);

//   const fetchAllServices = useCallback(async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/service`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         setAllServices(responseData.all_services || []);
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error);
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later.");
//     }
//   }, [backendUrl]);

//   const handleEntry = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(`${backendUrl}/dashboard`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         setData(responseData);
//         setPhotos(responseData.photos || []);
//         setVideos(responseData.videos || []);
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error || "An error occurred");
//       }
//       if (response.status === 422 || response.status === 401) {
//         setError("Your session has expired. Please log in again.");
//         setTimeout(() => {
//           window.location.href = "/login";
//         }, 5000);
//         return;
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later");
//     }
//   }, [backendUrl]);

//   useEffect(() => {
//     fetchData();
//     fetchAllServices();
//     handleEntry();
//   }, [fetchData, fetchAllServices, handleEntry]);
// const handleDelete = async (fileUrl, fileType) => {
//   const result = await Swal.fire({
//     title: "Are you sure?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Yes, Delete!",
//   });
//   if (result.isConfirmed) {
//     try {
//       const token = localStorage.getItem("token");
//       const fileName = fileUrl.split("/").pop();
//       const deleteResponse = await fetch(
//         `${backendUrl}/delete-upload/${fileType}/${fileName}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (deleteResponse.ok) {
//         Swal.fire("Success", "File deleted successfully", "success");
//         handleEntry();
//       } else {
//         const errorMessage = await deleteResponse.json();
//         setError(errorMessage.error || "An error occurred");
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later");
//     }
//   }
// };

// const handlePhotoDelete = (photoUrl) => handleDelete(photoUrl, "photo");
// const handleVideoDelete = (videoUrl) => handleDelete(videoUrl, "video");

//   const handleAddService = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Add Service!",
//     });
//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch(`${backendUrl}/add-service`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             service_name: newService,
//             existing_services: selectedServices.map((service) => service.id),
//           }),
//         });
//         if (response.ok) {
//           setNewService("");
//           setError("");
//           Swal.fire("Success", "Service added successfully", "success");
//           fetchData();
//         } else {
//           const errorMessage = await response.json();
//           if (
//             errorMessage.error ===
//             "Service entered already exists,please mark from the list provided"
//           ) {
//             setError(errorMessage.error);
//             setNewService("");
//             fetchAllServices();
//             const timer = setTimeout(() => {
//               setError("");
//             }, 5000);
//             return () => clearTimeout(timer);
//           } else {
//             setError(errorMessage.error || "An error occurred");
//           }
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later");
//       }
//     }
//   };

//   const handleDeleteService = async (serviceId) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Delete!",
//     });
//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch(
//           `${backendUrl}/delete-service/${serviceId}`,
//           {
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.ok) {
//           Swal.fire("Success", "Service deleted successfully", "success");
//           fetchData();
//         } else {
//           const errorMessage = await response.json();
//           setError(errorMessage.error || "An error occurred");
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later");
//       }
//     }
//   };

//   const handleCheckboxChange = (service) => {
//     const selectedIndex = selectedServices.findIndex(
//       (s) => s.id === service.id
//     );
//     if (selectedIndex === -1) {
//       setSelectedServices([...selectedServices, service]);
//     } else {
//       setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
//     }
//   };

//   useEffect(() => {
//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownOpen]);

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setDropdownOpen(false);
//     }
//   };

//   const openModal = (media, type) => {
//     if (type === "image") {
//       setSelectedImage(media);
//       setSelectedVideo(null);
//     } else if (type === "video") {
//       setSelectedImage(null);
//       setSelectedVideo(media);
//       setIsVideoLoading(true);
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedImage(null);
//     setSelectedVideo(null);
//     setIsVideoLoading(false);
//   };

//   const handleChatClick = (data) => {
//     setChatUser(data);
//   };

//   const closeChat = () => {
//     setChatUser(null);
//   };

//   const closeUpdates = ()=>{
//     setOpenClientsPage(false)
//   }

//   const handleClientsClick = () => {
//     setOpenClientsPage(true);
//   };
//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         setError("");
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setIsSidebarMinimized(true); // Minimize sidebar on small screens
//       } else {
//         setIsSidebarMinimized(false); // Expand sidebar on larger screens
//       }
//     };

//     // Check screen size on initial load
//     handleResize();

//     // Add event listener for window resize
//     window.addEventListener("resize", handleResize);

//     // Cleanup event listener on component unmount
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center overflow-x-hidden">
//       {/* Navbar */}
//       <Navbar
//         fluid
//         rounded
//         className="bg-gradient-to-r from-blue-500 to-indigo-600 w-full sticky top-0 text-white flex items-center px-4"
//       >
//         {/* Left side with heading */}
//         <h1 className="text-lg font-semibold">Kazi-Qonnect</h1>

//         {/* Right side with profile avatar and dropdown */}
//         <div className="ml-auto flex items-center ">
//           <Dropdown
//             arrowIcon={false}
//             inline
//             label={
//               <Avatar
//                 alt="Profile picture"
//                 img={data.image}
//                 rounded
//                 className="w-10 h-10 "
//               />
//             }
//           >
//             <Dropdown.Header>

//               <span className="block text-sm flex justify-center font-bold">
//                 {data.first_name} {data.last_name}
//               </span>
//               <span className="block text-sm text-gray-500">{data.email}</span>
//             </Dropdown.Header>
//             <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item onClick={handleClientsClick}>Clients</Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item onClick={() => handleChatClick(data)}>
//               Chat
//             </Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//           </Dropdown>
//         </div>
//       </Navbar>
//       {/* Main Content */}
//       <div className="flex flex-col items-center w-full px-4 py-6 md:px-2 lg:px-0 overflow-hidden main-page">
//         <Card className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 main-card ">
//           <h2 className="text-xl font-bold text-gray-900 text-white ">
//             Hello, {data.first_name}!
//           </h2>
//           <div>
//             <p className="text-white  text-lg underline ">Services you offer</p>
//             {/* Services Section */}
//             {services.length > 0 ? (
//               <ul className="divide-y divide-gray-200">
//                 {services.map((service) => (
//                   <li
//                     key={service.id}
//                     className="flex justify-between items-center py-2"
//                   >
//                     <span>{service.name}</span>
//                     <button
//                       className="text-red-500    "
//                       onClick={() => handleDeleteService(service.id)}
//                     >
//                       <FontAwesomeIcon icon={faTrash} />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-red-500">No services added</p>
//             )}
//           </div>

//           {/* Add Service */}
//           <div className="mt-4 flex w-full">
//             <input
//               className="rounded border border-blue-300 p-2 flex-grow"
//               type="text"
//               value={newService}
//               onChange={(e) => setNewService(e.target.value)}
//               placeholder="Add new service"
//             />
//             <button
//               className=" ml-4 text-4xl text-white rounded  transition"
//               onClick={handleAddService}
//             >
//               <FontAwesomeIcon icon={faSquarePlus} />
//             </button>
//           </div>

//           {/* Error Handling */}
//           {error && (
//             <p className="text-red-500 mt-2">
//               {error ===
//                 "Service entered already exists, please mark from the list provided" && (
//                 <div>
//                   <ServiceDropdown
//                     services={allServices}
//                     selectedServices={selectedServices}
//                     handleCheckboxChange={handleCheckboxChange}
//                   />
//                 </div>
//               )}
//             </p>
//           )}
//           {chatUser && (
//             <ServiceProviderChatBox
//               providerId={currentUserId}
//               receiverId={chatUser.id}
//               onClose={closeChat}
//               minimize={isSidebarMinimized}
//               className={isSidebarMinimized ? "" : "chatbox-popup"}
//               full={handleFull}
//             />
//           )}

//           {/* File Upload Section */}
// <div className="mt-6 w-full ">
//   <p className="text-white mb-2">
//     Upload photos or videos of your work
//   </p>
//   <FileInput
//     id="file-upload-helper-text"
//     type="file"
//     multiple
//     onChange={handleFileChange}
//     className="mb-4 w-full"
//   />
//   <button
//     className={`w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
//       loading ? "opacity-50 cursor-not-allowed" : ""
//     }`}
//     onClick={handleUpload}
//     disabled={loading}
//   >
//     {loading ? (
//       <Spinner aria-label="Loading" size="sm" className="mr-2" />
//     ) : (
//       "Upload"
//     )}
//   </button>
//   <p className="text-xs text-white mt-2">Max 4 photos and 2 videos</p>
// </div>
// {error && <p style={{ color: "red" }}>{error}</p>}

// {/* Display Uploaded Images/Videos */}
// <div className="image-grid mt-6">
//   {photos.length > 0 && (
//     <div>
//       <h3 className="text-lg font-semibold">Uploaded Photos:</h3>
//       <div className=" grid grid-cols-2 gap-2 mt-2">
//         {photos.map((photo, index) => (
//           <div key={index} className="relative grid-item ">
//             <img
//               src={photo}
//               alt={`Uploaded ${index + 1}`}
//               onClick={() => openModal(photo, "image")}
//             />
//             <button
//               className="absolute top-2 right-2 text-red-500"
//               onClick={() => handlePhotoDelete(photo)}
//             >
//               <FontAwesomeIcon icon={faTrash} />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   )}
//   {videos.length > 0 && (
//     <div className="mt-6 ">
//       <h3 className="text-lg font-semibold mb-2 ">
//         Uploaded Videos:
//       </h3>
//       <div className="grid grid-cols-1 gap-2">
//         {videos.map((video, index) => (
//           <div key={index} className="relative">
//             <video
//               controls
//               className="w-full h-auto rounded shadow-md"
//               preload="metadata"
//             >
//               <source src={video} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             <button
//               className="absolute top-2 right-2 text-red-500"
//               onClick={() => handleVideoDelete(video)}
//             >
//               <FontAwesomeIcon icon={faTrash} />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   )}
// </div>
//         </Card>
//       </div>

//       {/* Modal for Image/Video */}
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         className="modal"
//         overlayClassName="overlay"
//       >
//         {selectedImage && (
//           <img src={selectedImage} alt="Enlarged" className="modal-image" />
//         )}
//         {selectedVideo && (
//           <div className="modal-video-container">
//             {isVideoLoading && <Spinner aria-label="Loading" size="lg" />}
//             <video controls className="modal-video" preload="metadata">
//               <source src={selectedVideo} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </div>
//         )}
//       </Modal>

//       {/* Chat Box */}

//       {/* Provider Updates */}
//       {openClientsPage && (
//         <ProviderUpdates
// senderId={data.id}
// assigned={data.jobs || 0}
// likes={data.likes || 0}
// minimized={isSidebarMinimized}
// className={isSidebarMinimized ? "min-updates" : "updates"}
// onClose={closeUpdates}
//         />
//       )}
//     </div>
//   );
// }

// export default ProviderDashboard;
