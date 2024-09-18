import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Navbar, Button, Card, Select } from "flowbite-react";
import Swal from "sweetalert2";
import { getDistance } from "geolib";
import ServiceProviderChatBox from "../Pages/Chatbox/ServiceProviderChatbox";
import Providers from "./Providers";
import ServiceProviders from "./ServiceProviders";
import "./Client.css";
import {
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiUser,
  HiArrowSmLeft,
  HiMenu,
} from "react-icons/hi";
import Profile from "./Profile";

function ClientDashboard() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [openDashboard, setOpenDashboard] = useState(true);
  const [clientLocation, setClientLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [locationEnabled, setLocationEnabled] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const currentUserId = localStorage.getItem("id");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setClientLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationEnabled(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationEnabled(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationEnabled(false);
    }
  }, []);

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

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [serviceResponse, userResponse, countyResponse] =
          await Promise.all([
            fetch(`${backendUrl}/service`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${backendUrl}/dashboard`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${backendUrl}/county`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }),
          ]);

        if (serviceResponse.ok && userResponse.ok && countyResponse.ok) {
          const serviceData = await serviceResponse.json();
          const userData = await userResponse.json();
          const countyData = await countyResponse.json();

          setServices(serviceData.all_services);
          setData(userData);
          setCounties(countyData.all_counties);
        } else {
          const errorMessage = await serviceResponse.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Try again later");
      }
      setLoading(false);
    };

    fetchData();
  }, [backendUrl, setLoading]);

  useEffect(() => {
    const fetchServicesByCounty = async () => {
      if (selectedCounty) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${backendUrl}/services-by-county/${selectedCounty}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const responseData = await response.json();
            setServices(responseData.services);
            localStorage.setItem("countyId", responseData.county_id);
          } else {
            const errorMessage = await response.json();
            setError(
              errorMessage.error ||
                "An error occurred while fetching services by county"
            );
          }
        } catch (error) {
          setError("An error occurred please try again later");
        }
      }
    };

    fetchServicesByCounty();
  }, [selectedCounty, backendUrl]);

  const countyIdd = localStorage.getItem("countyId");
  useEffect(() => {
    const fetchProviderDetailsCounty = async () => {
      try {
        const token = localStorage.getItem("token");
        const countyProviderIds = JSON.parse(
          localStorage.getItem("countyProviderIds")
        );
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const url = locationEnabled
          ? `${backendUrl}/provider-delta?countyId=${countyIdd}&provider_ids=${countyProviderIds.join(
              ","
            )}&client_lat=${clientLocation.latitude}&client_lon=${
              clientLocation.longitude
            }`
          : `${backendUrl}/provider-delta?countyId=${countyIdd}&provider_ids=${countyProviderIds.join(
              ","
            )}`;
        const response = await fetch(url, { method: "GET", headers });

        if (!response.ok) {
          const errorMessage = await response.json();
          setError(errorMessage.error);
          throw new Error("Failed to fetch county provider details");
        }

        const countyProviderDetails = await response.json();
        setProviders(
          Array.isArray(countyProviderDetails) ? countyProviderDetails : []
        );
        console.log("County Provider Details:", countyProviderDetails);
      } catch (error) {
        console.error("Error fetching county provider details:", error);
        setProviders([]);
      }
    };

    fetchProviderDetailsCounty();
  }, [clientLocation, locationEnabled, backendUrl, countyIdd]);

  useEffect(() => {
    if (locationEnabled && providers.length > 0) {
      const sortedProviders = providers
        .filter((provider) => provider.latitude && provider.longitude)
        .sort((a, b) => {
          const distanceA = getDistance(clientLocation, {
            latitude: a.latitude,
            longitude: a.longitude,
          });
          const distanceB = getDistance(clientLocation, {
            latitude: b.latitude,
            longitude: b.longitude,
          });
          return distanceA - distanceB;
        })
        .map((provider) => ({
          ...provider,
          distance: (
            getDistance(clientLocation, {
              latitude: provider.latitude,
              longitude: provider.longitude,
            }) / 1000
          ).toFixed(2),
        }));
      setProviders(sortedProviders);
    }
  }, [clientLocation, providers, locationEnabled]);

  const handleProviders = async (service) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/provider-ids/${service.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        const providerIdsArray = responseData.provider_ids;

        // Save both formats to localStorage
        localStorage.setItem("providerIds", JSON.stringify(providerIdsArray)); // As JSON array
        const providerIdsString = providerIdsArray.join(",");
        localStorage.setItem("providerIdsString", providerIdsString);
        const sorted = selectedCounty !== "";
        if (sorted) {
          setActiveComponent("providers");
          // navigate(`/primes?provider_ids=${providerIds}`);
        } else {
          setActiveComponent("serviceProviders");
          // navigate(`/providers?provider_ids=${providerIds}`);
        }
      } else {
        const errorMessage = await response.json();
        setError(
          errorMessage.error || "An error occurred while fetching provider IDs"
        );
      }
    } catch (error) {
      setError("An error occurred please try again later");
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

  const handleProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChat = () => {
    setChatUser(currentUserId);
  };

  const onClose = () => {
    setChatUser(null);
  };
  const provIds = localStorage.getItem("providerIdsString");
  return (
    // <div className="clients" >
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

        {!isSidebarMinimized && (
          <div>
            <h2 className="text-2xl text-black font-bold mb-4">
              Filters & Actions
            </h2>
            <input
              type="text"
              placeholder="Search service ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-100"
            />

            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-100"
            >
              <option value="">Select county...</option>
              {counties.map((county) => (
                <option key={county.id} value={county.name}>
                  {county.name}
                </option>
              ))}
            </select>
          </div>
        )}
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

      <div className="flex-grow p-2 overflow-auto ">
        {activeComponent === "dashboard" && (
          <Navbar
            fluid
            rounded
            className="bg-gradient-to-r from-blue-500 to-indigo-600 w-full sticky top-0 text-white flex items-center px-4"
          >
            <h1 className="text-lg font-semibold">Kazi-Qonnect</h1>
            <div className="ml-auto flex items-center">
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="User settings"
                    img={data.image}
                    rounded
                    className="w-10 h-10"
                  />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm font-bold">
                    {data.first_name} {data.last_name}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {data.email}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
                <Dropdown.Item onClick={handleChat}>Chat</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown>
            </div>
          </Navbar>
        )}

        {activeComponent === "dashboard" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                {/* Service Icon */}
                {/* <img
                  src={service.image || "https://via.placeholder.com/100"}
                  alt={service.name}
                  className="w-full h-32 object-cover rounded-t-md"
                /> */}
                <div className={isSidebarMinimized ? "mt-2" : ""}>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900">
                    {service.name}
                  </h5>
                  {/* <p className="text-sm text-gray-600 mt-2">
                    {service.description || "No description provided"  }
                  </p> */}
                  <button
                    onClick={() => handleProviders(service)}
                    className="mt-2 w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
                  >
                    Providers
                  </button>
                </div>
              </div>
            ))}
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
        {activeComponent === "providers" && (
          <Providers provider_ids={provIds} />
        )}
        {activeComponent === "serviceProviders" && (
          <ServiceProviders minimized={isSidebarMinimized} provider_ids={provIds} />
        )}
      </div>
    </div>
    // </div>
  );
}

export default ClientDashboard;
