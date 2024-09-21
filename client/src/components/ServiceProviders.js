import React, { useEffect, useState } from "react";
import UserDetailsPopup from "./UserDetailsPopup";

function ServiceProviders({ minimized }) {
  const [providers, setProviders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [clientLocation, setClientLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [locationEnabled, setLocationEnabled] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
    const fetchProviderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const providerIds = JSON.parse(localStorage.getItem("providerIds"));

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const url = locationEnabled
          ? `${backendUrl}/provider-details?provider_ids=${providerIds.join(
              ","
            )}&client_lat=${clientLocation.latitude}&client_lon=${
              clientLocation.longitude
            }`
          : `${backendUrl}/provider-details?provider_ids=${providerIds.join(
              ","
            )}`;

        const response = await fetch(url, { method: "GET", headers });

        if (!response.ok) {
          const errorMessage = await response.json();
          setError(errorMessage.error);
          throw new Error("Failed to fetch provider details");
        }

        const providerDetails = await response.json();
        console.log("Fetched provider details:", providerDetails);

        setProviders(
          Array.isArray(providerDetails.providers)
            ? providerDetails.providers
            : []
        );
      } catch (error) {
        console.error("Error fetching provider details:", error);
        setProviders([]);
      }
    };

    fetchProviderDetails();
  }, [clientLocation, locationEnabled, backendUrl]);

  const handleProviderClick = async (provider) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backendUrl}/user-details?email=${provider.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userDetails = await response.json();
        localStorage.setItem("user", JSON.stringify(userDetails));
        setSelectedUser(userDetails);
        setPhotos(userDetails.photos || []);
        setVideos(userDetails.videos || []);
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h5 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">
            Service Providers
          </h5>
        </div>

        {!locationEnabled && (
          <div
            className="mb-4 p-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
            role="alert"
          >
            To see the closest service providers near you, please enable location
            services and reload the page.
          </div>
        )}

        <div className="flow-root">
          {providers.length === 0 ? (
            <p className="text-gray-500 text-center">No providers available</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {providers.map((provider, index) => (
                <li
                  key={index}
                  className="py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 rounded-lg cursor-pointer"
                  onClick={() => handleProviderClick(provider)}
                >
                  <div className="flex items-start space-x-4">
                    {/* The image stays here */}
                    <div className="shrink-0">
                      <img
                        alt="Avatar"
                        height="40"
                        src={provider.image || "https://via.placeholder.com/40"}
                        width="40"
                        className="rounded-full shadow-sm border border-gray-300"
                      />
                    </div>

                    {/* Name and County in one flex container */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col">
                        {/* Align the name and distance badge horizontally */}
                        <p className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                          <span>
                            {provider.first_name} {provider.last_name}
                          </span>
                          {locationEnabled && provider.distance != null && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold ml-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                              {provider.distance.toFixed(2)} km Away
                            </span>
                          )}
                        </p>
                        {/* County placed directly below the name and distance */}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {provider.county ? provider.county : "Unknown"} county
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedUser && (
          <UserDetailsPopup
            details={handleProviderClick}
            minimized={minimized}
            user={selectedUser}
            onClose={closePopup}
          />
        )}

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
  );
}

export default ServiceProviders;