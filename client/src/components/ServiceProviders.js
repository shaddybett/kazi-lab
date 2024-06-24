// import React, { useEffect, useState } from "react";
// import { Card, Avatar } from "flowbite-react";
// import UserDetailsPopup from "./UserDetailsPopup";
// import { getDistance } from "geolib";

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
//     // Request client's location using Geolocation API
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
//         const provider_ids = JSON.parse(localStorage.getItem("providerIds"));
//         const countyId = localStorage.getItem("countyId");
//         const countyProviderIds = JSON.parse(
//           localStorage.getItem("countyProviderIds")
//         );

//         const headers = {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         };

//         const buildUrl = (base, ids) => {
//           let url = `${base}?provider_ids=${ids.join(",")}`;
//           if (locationEnabled) {
//             url += `&client_lat=${clientLocation.latitude}&client_lon=${clientLocation.longitude}`;
//           }
//           return url;
//         };

//         const fetchGeneralProviders = provider_ids
//           ? fetch(buildUrl("/provider-details", provider_ids), {
//               method: "GET",
//               headers,
//             })
//           : null;

//         const fetchCountyProviders = provider_ids
//           ? fetch(
//               buildUrl(
//                 `/provider-delta?countyId=${countyId}`&
//                 provider_ids
//               ),
//               { method: "GET", headers }
//             )
//           : null;

//         const [generalResponse, countyResponse] = await Promise.all([
//           fetchGeneralProviders,
//           fetchCountyProviders,
//         ]);

//         const generalProviderDetails = generalResponse
//           ? await generalResponse.json()
//           : [];
//         const countyProviderDetails = countyResponse
//           ? await countyResponse.json()
//           : [];

//         const allProviders = [
//           ...generalProviderDetails,
//           ...countyProviderDetails,
//         ];
//         setProviders(allProviders);
//         console.log("Provider Details:", allProviders);
//       } catch (error) {
//         console.error("Error fetching provider details:", error);
//       }
//     };

//     fetchProviderDetails();
//   }, [clientLocation, locationEnabled]);

//   useEffect(() => {
//     if (locationEnabled && providers.length > 0) {
//       const sortedProviders = [...providers]
//         .filter((provider) => provider.latitude && provider.longitude)
//         .sort((a, b) => {
//           const distanceA = getDistance(clientLocation, {
//             latitude: a.latitude,
//             longitude: a.longitude,
//           });
//           const distanceB = getDistance(clientLocation, {
//             latitude: b.latitude,
//             longitude: b.longitude,
//           });
//           return distanceA - distanceB;
//         })
//         .map((provider) => ({
//           ...provider,
//           distance: (
//             getDistance(clientLocation, {
//               latitude: provider.latitude,
//               longitude: provider.longitude,
//             }) / 1000
//           ).toFixed(2),
//         }));
//       setProviders(sortedProviders);
//     }
//   }, [clientLocation, providers, locationEnabled]);

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
//             {providers.map((provider, index) => (
//               <li
//                 key={index}
//                 className="py-3 sm:py-4 cursor-pointer"
//                 onClick={() => handleProviderClick(provider)}
//               >
//                 <div className="flex items-center space-x-4">
//                   <div className="shrink-0">
//                     <img
//                       alt={Avatar}
//                       height="32"
//                       src={provider.image}
//                       width="32"
//                       className="rounded-full"
//                     />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
//                       {provider.first_name} {provider.last_name}{" "}
//                       {locationEnabled && provider.distance
//                         ? `${provider.distance} km`
//                         : ""}
//                     </p>
//                     <p className="truncate text-sm text-gray-500 dark:text-gray-400">
//                       {provider.county} county
//                     </p>
//                   </div>
//                 </div>
//               </li>
//             ))}
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

// useEffect(() => {
//   const fetchProviderDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const providerIds = JSON.parse(localStorage.getItem("providerIds"));
//       const countyId = localStorage.getItem("countyId");
//       const countyProviderIds = JSON.parse(localStorage.getItem("countyProviderIds"));

//       const fetchGeneralProviders = fetch(
//         `/provider-details?provider_ids=${providerIds.join(",")}${
//           locationEnabled
//             ? `&client_lat=${clientLocation.latitude}&client_lon=${clientLocation.longitude}`
//             : ""
//         }`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const fetchCountyProviders = fetch(
//         `/provider-details?countyId=${countyId}&provider_ids=${countyProviderIds.join(",")}${
//           locationEnabled
//             ? `&client_lat=${clientLocation.latitude}&client_lon=${clientLocation.longitude}`
//             : ""
//         }`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const [generalResponse, countyResponse] = await Promise.all([
//         fetchGeneralProviders,
//         fetchCountyProviders,
//       ]);

//       if (!generalResponse.ok) {
//         const errorMessage = await countyResponse.json();
//         setError(errorMessage.error);
//         // throw new Error("Failed to fetch general provider details");
//       }
//       if (!countyResponse.ok) {
//         const errorMessage = await countyResponse.json();
//         setError(errorMessage.error);
//         throw new Error("Failed to fetch county provider details");
//       }

//       const generalProviderDetails = await generalResponse.json();
//       const countyProviderDetails = await countyResponse.json();

//       const allProviders = [...generalProviderDetails, ...countyProviderDetails];
//       setProviders(allProviders);
//       console.log("Provider Details:", allProviders);
//     } catch (error) {
//       console.error("Error fetching provider details:", error);
//     }
//   };

//   fetchProviderDetails();
// }, [clientLocation, locationEnabled]);
import React, { useEffect, useState } from "react";
import { Card, Avatar } from "flowbite-react";
import UserDetailsPopup from "./UserDetailsPopup";
import { getDistance } from "geolib";

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
    // Request client's location using Geolocation API
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
        const provider_ids = JSON.parse(localStorage.getItem("providerIds"));
        const countyId = localStorage.getItem("countyId");
        const countyProviderIds = JSON.parse(
          localStorage.getItem("countyProviderIds")
        );

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const buildUrl = (base, ids) => {
          let url = `${base}?provider_ids=${ids.join(",")}`;
          if (locationEnabled) {
            url += `&client_lat=${clientLocation.latitude}&client_lon=${clientLocation.longitude}`;
          }
          console.log("Fetch URL:", url); // Log the URL being fetched
          return url;
        };

        const fetchGeneralProviders = provider_ids
          ? fetch(buildUrl("/provider-details", provider_ids), {
              method: "GET",
              headers,
            })
          : null;

        const fetchCountyProviders = provider_ids
          ? fetch(
              buildUrl(
                `/provider-delta?countyId=${countyId}&provider_ids=${provider_ids}`
              ),
              { method: "GET", headers }
            )
          : null;

        const [generalResponse, countyResponse] = await Promise.all([
          fetchGeneralProviders,
          fetchCountyProviders,
        ]);

        const generalProviderDetails = generalResponse
          ? await generalResponse.json()
          : [];
        const countyProviderDetails = countyResponse
          ? await countyResponse.json()
          : [];

        const allProviders = [
          ...generalProviderDetails,
          ...countyProviderDetails,
        ];
        console.log("Provider Details:", allProviders); // Log the fetched provider details
        setProviders(allProviders);
      } catch (error) {
        console.error("Error fetching provider details:", error);
        setError("Error fetching provider details");
      }
    };

    fetchProviderDetails();
  }, [clientLocation, locationEnabled]);

  useEffect(() => {
    if (locationEnabled && providers.length > 0) {
      const sortedProviders = [...providers]
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
      console.log("Sorted Providers:", sortedProviders); // Log the sorted provider details
      setProviders(sortedProviders);
    }
  }, [clientLocation, providers, locationEnabled]);

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
            {providers.map((provider, index) => (
              <li
                key={index}
                className="py-3 sm:py-4 cursor-pointer"
                onClick={() => handleProviderClick(provider)}
              >
                <div className="flex items-center space-x-4">
                  <div className="shrink-0">
                    <img
                      alt={Avatar}
                      height="32"
                      src={provider.image}
                      width="32"
                      className="rounded-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {provider.first_name} {provider.last_name}{" "}
                      {locationEnabled && provider.distance
                        ? `${provider.distance} km`
                        : ""}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {provider.county} county
                    </p>
                  </div>
                </div>
              </li>
            ))}
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
