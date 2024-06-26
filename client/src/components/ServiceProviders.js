// import React, { useEffect, useState } from "react";
// import { Card } from "flowbite-react";
// import UserDetailsPopup from "./UserDetailsPopup";

// function ServiceProviders() {
//   const [providers, setProviders] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [error, setError] = useState("");
//   const [clientLocation, setClientLocation] = useState({
//     latitude: null,
//     longitude: null,
//   });
//   const [locationEnabled, setLocationEnabled] = useState(false);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setClientLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//           setLocationEnabled(true);
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           setLocationEnabled(false);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//       setLocationEnabled(false);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchProviderDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const providerIds = JSON.parse(localStorage.getItem("providerIds"));

//         const headers = {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         };

//         const url = locationEnabled
//           ? `/provider-details?provider_ids=${providerIds.join(",")}&client_lat=${clientLocation.latitude}&client_lon=${clientLocation.longitude}`
//           : `/provider-details?provider_ids=${providerIds.join(",")}`;

//         const response = await fetch(url, { method: "GET", headers });

//         if (!response.ok) {
//           const errorMessage = await response.json();
//           setError(errorMessage.error);
//           throw new Error("Failed to fetch provider details");
//         }

//         const providerDetails = await response.json();
//         setProviders(Array.isArray(providerDetails) ? providerDetails : []);
//         console.log("Provider Details:", providerDetails);
//       } catch (error) {
//         console.error("Error fetching provider details:", error);
//         setProviders([]);
//       }
//     };

//     fetchProviderDetails();
//   }, [clientLocation, locationEnabled]);

//   const handleProviderClick = async (provider) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`/user-details?email=${provider.email}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const userDetails = await response.json();
//         setSelectedUser(userDetails);
//       } else {
//         throw new Error("Failed to fetch user details");
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };

//   const closePopup = () => {
//     setSelectedUser(null);
//   };

//   return (
//     <div>
//       <Card className="max-w-sm">
//         <div className="mb-4 flex items-center justify-between">
//           <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
//             Service Providers
//           </h5>
//         </div>
//         <div className="flow-root">
//           {!locationEnabled && (
//             <div
//               className="mb-4 p-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
//               role="alert"
//             >
//               To see the closest service providers near you, please enable
//               location services then refresh the page.
//             </div>
//           )}
//           <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//             {providers.length === 0 ? (
//               <p>No providers available</p>
//             ) : (
//               providers.map((provider, index) => (
//                 <li
//                   key={index}
//                   className="py-3 sm:py-4 cursor-pointer"
//                   onClick={() => handleProviderClick(provider)}
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="shrink-0">
//                       <img
//                         alt="Avatar"
//                         height="32"
//                         src={provider.image}
//                         width="32"
//                         className="rounded-full"
//                       />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
//                         {provider.first_name} {provider.last_name}{" "}
//                         {locationEnabled && provider.distance !== null
//                           ? `${provider.distance} km`
//                           : ""}
//                       </p>
//                       <p className="truncate text-sm text-gray-500 dark:text-gray-400">
//                         {provider.county ? provider.county : "Unknown"} county
//                       </p>
//                     </div>
//                   </div>
//                 </li>
//               ))
//             )}
//           </ul>
//         </div>
//       </Card>
//       {selectedUser && (
//         <UserDetailsPopup user={selectedUser} onClose={closePopup} />
//       )}
//       {error && <p className="text-red-500 mt-4">{error}</p>}
//     </div>
//   );
// }

// export default ServiceProviders;





import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import UserDetailsPopup from "./UserDetailsPopup";

function ServiceProviders() {
  const [providers, setProviders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [clientLocation, setClientLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [locationEnabled, setLocationEnabled] = useState(false);

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
          ? `/provider-details?provider_ids=${providerIds.join(",")}&client_lat=${clientLocation.latitude}&client_lon=${clientLocation.longitude}`
          : `/provider-details?provider_ids=${providerIds.join(",")}`;

        const response = await fetch(url, { method: "GET", headers });

        if (!response.ok) {
          const errorMessage = await response.json();
          setError(errorMessage.error);
          throw new Error("Failed to fetch provider details");
        }

        const providerDetails = await response.json();
        setProviders(Array.isArray(providerDetails) ? providerDetails : []);
        console.log("Provider Details:", providerDetails); // Log provider details
      } catch (error) {
        console.error("Error fetching provider details:", error);
        setProviders([]);
      }
    };

    fetchProviderDetails();
  }, [clientLocation, locationEnabled]);

  const handleProviderClick = async (provider) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/user-details?email=${provider.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userDetails = await response.json();
        setSelectedUser(userDetails);
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
    <div>
      <Card className="max-w-sm">
        <div className="mb-4 flex items-center justify-between">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Service Providers
          </h5>
        </div>
        <div className="flow-root">
          {!locationEnabled && (
            <div
              className="mb-4 p-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
              role="alert"
            >
              To see the closest service providers near you, please enable
              location services then refresh the page.
            </div>
          )}
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {providers.length === 0 ? (
              <p>No providers available</p>
            ) : (
              providers.map((provider, index) => (
                <li
                  key={index}
                  className="py-3 sm:py-4 cursor-pointer"
                  onClick={() => handleProviderClick(provider)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <img
                        alt="Avatar"
                        height="32"
                        src={provider.image}
                        width="32"
                        className="rounded-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {provider.first_name} {provider.last_name}{" "}
                        {locationEnabled && provider.distance !== null
                          ? `${provider.distance.toFixed(2)} km`
                          : ""}
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {provider.county ? provider.county : "Unknown"} county
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </Card>
      {selectedUser && (
        <UserDetailsPopup user={selectedUser} onClose={closePopup} />
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default ServiceProviders;


