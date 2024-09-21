import React, { useState, useEffect, useRef, useCallback } from "react";
import Modal from "react-modal";
import { Avatar } from "flowbite-react";
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
import { faTrash } from "@fortawesome/free-solid-svg-icons";
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
  const [openClientsPage, setOpenClientsPage] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const currentUserId = localStorage.getItem("id");

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

  useEffect(() => {
    fetchData();
    fetchAllServices();
  }, [fetchData, fetchAllServices]);

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

  const closeUpdates = () => {
    setOpenClientsPage(false);
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
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Hello, {data.first_name}!
            </h2>

            {/* Centered Card Container */}
            <div className="flex justify-center">
              <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                {/* Service List Section */}
                <div className="mb-8">
                  <p className="text-xl font-semibold text-gray-900 underline mb-4 text-center">
                    Services You Offer
                  </p>

                  {services.length > 0 ? (
                    <ul className="space-y-4">
                      {services.map((service) => (
                        <li
                          key={service.id}
                          className="bg-gray-200 shadow-md p-4 rounded-lg flex justify-between items-center"
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
                    <p className="text-red-500 text-lg text-center">
                      No services registered
                    </p>
                  )}
                </div>

                {/* Add New Service Section */}
                <div className="mb-4">
                  <input
                    className="rounded-lg border border-blue-300 p-3 w-full mb-4 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Add a new service"
                  />
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors w-full"
                    onClick={handleAddService}
                  >
                    Add
                  </button>
                </div>
              </div>
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
        {activeComponent === "uploads" && (
          <Uploads minimized={isSidebarMinimized} />
        )}
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
