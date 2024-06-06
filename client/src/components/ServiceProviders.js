// // import React, { useEffect, useState } from "react";
// // import UserDetailsPopup from "./UserDetailsPopup";

// // function ServiceProviders() {
// //   const [providers, setProviders] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null);

// //   useEffect(() => {
// //     const fetchProviderDetails = async () => {
// //       try {
// //         // Retrieve the access token from localStorage
// //         const token = localStorage.getItem("token");
// //         const providerIds = JSON.parse(localStorage.getItem("providerIds")); // Assuming you have an array of provider IDs
// //         // const queryString = providerIds.map(id => `provider_ids[]=${id}`).join('&');

// //         // Fetch provider details using the /provider-details endpoint
// //         const response = await fetch(
// //           `/provider-details?provider_ids=${providerIds.join(",")}`,
// //           {
// //             method: "GET",
// //             headers: {
// //               "Content-Type": "application/json",
// //               Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
// //             },
// //           }
// //         );
// //         if (response.ok) {
// //           const providerDetails = await response.json();
// //           setProviders(providerDetails);
// //         } else {
// //           throw new Error("Failed to fetch provider details");
// //         }
// //       } catch (error) {
// //         console.error("Error fetching provider details:", error);
// //       }
// //     };

// //     fetchProviderDetails();
// //   }, []);

// //   const handleProviderClick = async (provider) => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       const response = await fetch(`/user-details?email=${provider.email}`, {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (response.ok) {
// //         const userDetails = await response.json();
// //         setSelectedUser(userDetails);
// //       } else {
// //         throw new Error("Failed to fetch user details");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching user details:", error);
// //     }
// //   };

// //   const closePopup = () => {
// //     setSelectedUser(null);
// //   };

// //   return (
// //     <div>
// //       <h1>Service Providers</h1>
// //       <ul>
// //         {providers.map((provider, index) => (
// //           <li key={index} onClick={() => handleProviderClick(provider)}>
// //             {provider.first_name} {provider.last_name}
// //           </li>
// //         ))}
// //       </ul>
// //       {selectedUser && <UserDetailsPopup user={selectedUser} onClose={closePopup} />}
// //     </div>
// //   );
// // }

// // export default ServiceProviders;


// import { Card } from "flowbite-react";

// export function Component() {
//   return (
//     <Card className="max-w-sm">
//       <div className="mb-4 flex items-center justify-between">
//         <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Latest Customers</h5>
//         <a href="#" className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500">
//           View all
//         </a>
//       </div>
//       <div className="flow-root">
//         <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//           <li className="py-3 sm:py-4">
//             <div className="flex items-center space-x-4">
//               <div className="shrink-0">
//                 <Image
//                   alt="Bonnie image"
//                   height="32"
//                   src={provider.image}
//                   width="32"
//                   className="rounded-full"
//                 />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{provider.first_name} {provider.last_name} </p>
//                 <p className="truncate text-sm text-gray-500 dark:text-gray-400">{provider.email}</p>
//               </div>
//               <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
//                 $3467
//               </div>
//             </div>
//           </li>
//         </ul>
//       </div>
//     </Card>
//   );
// }



import React, { useEffect, useState } from "react";
import { Card, Avatar } from "flowbite-react"; // Importing the Card component from Flowbite
import UserDetailsPopup from "./UserDetailsPopup"; // Assuming the popup component is in the same directory

function ServiceProviders() {
  const [providers, setProviders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const providerIds = JSON.parse(localStorage.getItem("providerIds"));

        const response = await fetch(
          `/provider-details?provider_ids=${providerIds.join(",")}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const providerDetails = await response.json();
          setProviders(providerDetails);
        } else {
          throw new Error("Failed to fetch provider details");
        }
      } catch (error) {
        console.error("Error fetching provider details:", error);
      }
    };

    fetchProviderDetails();
  }, []);

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
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Service Providers</h5>
        </div>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {providers.map((provider, index) => (
              <li key={index} className="py-3 sm:py-4" onClick={() => handleProviderClick(provider)}>
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
                      {provider.first_name} {provider.last_name}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{provider.email}</p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    $3467
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      {selectedUser && <UserDetailsPopup user={selectedUser} onClose={closePopup} />}
    </div>
  );
}

export default ServiceProviders;
