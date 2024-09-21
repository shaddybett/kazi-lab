import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import Swal from "sweetalert2";
import { getDistance } from "geolib";
import ServiceProviderChatBox from "../Pages/Chatbox/ServiceProviderChatbox";
import Providers from "./Providers";
import ServiceProviders from "./ServiceProviders";
import "./Client.css";
import {
  HiChartPie,
  HiInbox,
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
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [activeComponent, setActiveComponent] = useState("dashboard");
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

  const provIds = localStorage.getItem("providerIdsString");
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
            />

            {!isSidebarMinimized && <span>Dashboard</span>}

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

            {!isSidebarMinimized && <span>Profile</span>}

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

            {!isSidebarMinimized && <span>Inbox</span>}

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
                <Dropdown.Item onClick={() => setActiveComponent("profile")}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setActiveComponent("chat")}>
                  Chat
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown>
            </div>
          </Navbar>
        )}

        {activeComponent === "dashboard" && (
          <div>
            {/* Filters & Search Section */}
            <div className="mb-6">
              {/* Heading */}
              <h2 className="text-2xl font-bold text-white mb-4 mt-4    ">
                Filters & Actions
              </h2>

              {/* Error Message */}
              {error && (
                <div className="mb-4">
                  <p style={{ color: "red" }}>{error}</p>
                </div>
              )}

              {/* Flexbox for Search and Filter */}
              <div className="flex flex-col lg:flex-row gap-4 mb-14 items-center justify-center">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-1/2 p-3  rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-300 ease-in-out text-gray-700"
                />

                {/* County Filter */}
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full lg:w-1/2 p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-shadow duration-300 ease-in-out text-gray-700"
                >
                  <option value="">Select a county...</option>
                  {counties.map((county) => (
                    <option key={county.id} value={county.name}>
                      {county.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Services Display Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
                >
                  <div>
                    <h5 className="text-lg font-bold text-gray-900 mb-2">
                      {service.name}
                    </h5>
                    <p className="text-gray-600 text-sm mb-4">
                      {service.description || "No description available."}
                    </p>
                    <button
                      onClick={() => handleProviders(service)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      View Providers
                    </button>
                  </div>
                </div>
              ))}
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
        {activeComponent === "providers" && (
          <Providers minimized={isSidebarMinimized} provider_ids={provIds} />
        )}
        {activeComponent === "serviceProviders" && (
          <ServiceProviders
            minimized={isSidebarMinimized}
            provider_ids={provIds}
          />
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;