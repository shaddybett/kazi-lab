// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Avatar, Dropdown, Navbar, Button, Card, Select } from "flowbite-react";
// import Swal from "sweetalert2";
// import { getDistance } from "geolib";

// function ClientDashboard() {
//   const [data, setData] = useState({});
//   const [error, setError] = useState("");
//   const [services, setServices] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [counties, setCounties] = useState([]);
//   const [selectedCounty, setSelectedCounty] = useState("");
//   const navigate = useNavigate();
//   const [providers,setProviders] = useState([])
//   const [clientLocation, setClientLocation] = useState({
//     latitude: null,
//     longitude: null,
//   });
//   const [locationEnabled, setLocationEnabled] = useState(false);
//   const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const [serviceResponse, userResponse, countyResponse] = await Promise.all([
//           fetch(`${backendUrl}/service`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//           fetch(`${backendUrl}/dashboard`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//           fetch(`${backendUrl}/county`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }),
//         ]);

//         if (serviceResponse.ok && userResponse.ok && countyResponse.ok) {
//           const serviceData = await serviceResponse.json();
//           const userData = await userResponse.json();
//           const countyData = await countyResponse.json(); // Assuming county data is an array of objects with id and name

//           setServices(serviceData.all_services);
//           setData(userData);
//           setCounties(countyData.all_counties); // Set counties in state
//         } else {
//           const errorMessage = await serviceResponse.json();
//           setError(errorMessage.error || "An error occurred");
//         }
//       } catch (error) {
//         setError("An error occurred. Try again later");
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchServicesByCounty = async () => {
//       if (selectedCounty) {
//         try {
//           const token = localStorage.getItem("token");
//           const response = await fetch(`${backendUrl}/services-by-county/${selectedCounty}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           if (response.ok) {
//             const responseData = await response.json();
//             setServices(responseData.services);
//           } else {
//             const errorMessage = await response.json();
//             setError(errorMessage.error || "An error occurred while fetching services by county");
//           }
//         } catch (error) {
//           setError("An error occurred please try again later");
//         }
//       }
//     };

//     fetchServicesByCounty();
//   }, [selectedCounty]);
//   useEffect(() => {
//     const fetchProviderDetailsCounty = async () => {
//       try {
//         const token = localStorage.getItem("token");
// const countyId = localStorage.getItem("countyId");
//         const countyProviderIds = JSON.parse(localStorage.getItem("countyProviderIds"));

//         const headers = {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         };

// const url = locationEnabled
//   ? `${backendUrl}/provider-delta?countyId=${countyId}&provider_ids=${countyProviderIds.join(",")}&client_lat=${clientLocation.latitude}&client_lon=${clientLocation.longitude}`
//   : `${backendUrl}/provider-delta?countyId=${countyId}&provider_ids=${countyProviderIds.join(",")}`;

//         const response = await fetch(url, { method: "GET", headers });

//         if (!response.ok) {
//           const errorMessage = await response.json();
//           setError(errorMessage.error);
//           throw new Error("Failed to fetch county provider details");
//         }

//         const countyProviderDetails = await response.json();
//         setProviders(Array.isArray(countyProviderDetails) ? countyProviderDetails : []);
//         console.log("County Provider Details:", countyProviderDetails);
//       } catch (error) {
//         console.error("Error fetching county provider details:", error);
//         setProviders([]);
//       }
//     };

//     fetchProviderDetailsCounty();
//   }, [clientLocation, locationEnabled]);

//   useEffect(() => {
//     if (locationEnabled && providers.length > 0) {
//       const sortedProviders = providers
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

//   const handleProviders = async (service) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/provider-ids/${service.id}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         localStorage.setItem("providerIds", JSON.stringify(responseData.provider_ids));
//         const providerIds = responseData.provider_ids.join(",");
//         navigate(`/providers?provider_ids=${providerIds}`);
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error || "An error occurred while fetching provider IDs");
//       }
//     } catch (error) {
//       setError("An error occurred please try again later");
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

//   const handleProfile = () => {
//     navigate("/profile");
//   };

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         setError('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   const filteredServices = services.filter((service) =>
//     service.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="p-4">
//       <Navbar fluid rounded className="bg-black">
//         <div className="flex md:order-2">
//           <Dropdown
//             arrowIcon={false}
//             inline
//             label={<Avatar alt="User settings" img={data.image} rounded />}
//           >
//             <Dropdown.Header>
//               <span className="block text-sm">
//                 {data.first_name} {data.last_name}
//               </span>
//               <span className="block truncate text-sm font-medium">
//                 {data.email}
//               </span>
//             </Dropdown.Header>
//             <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//           </Dropdown>
//           <Navbar.Toggle />
//         </div>
//         <Navbar.Collapse>
//           <Navbar.Link href="/link1" active></Navbar.Link>
//           <Navbar.Link href="/link2"></Navbar.Link>
//           <Navbar.Link href="/link3"></Navbar.Link>
//           <Navbar.Link href="/link4"></Navbar.Link>
//           <Navbar.Link href="/link5"></Navbar.Link>
//         </Navbar.Collapse>
//       </Navbar>

//       <div className="mt-4">
//         <input
//           type="text"
//           placeholder="Search services..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="p-2 border rounded w-full mb-4 max-w-80 ml-5"
//         />
//       </div>

//       <div className="flex items-center mb-4 max-w-80 ml-5">
//         <Select
//           id="counties"
//           value={selectedCounty}
//           onChange={(e) => setSelectedCounty(e.target.value)}
//           className="p-2 border rounded w-48"
//         >
//           <option value="">Select county...</option>
//           {counties.map((county) => (
//             <option key={county.id} value={county.name}>
//               {county.name}
//             </option>
//           ))}
//         </Select>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//         {filteredServices.map((service) => (
//           <div key={service.id} className="mb-4">
//             <Card className="max-w-sm mt-3 ml-5">
//               <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
//                 {service.name}
//               </h5>
//               <Button onClick={() => handleProviders(service)}>
//                 Service Providers
//               </Button>
//             </Card>
//           </div>
//         ))}
//       </div>

//       {error && <p className="text-red-500 mt-4">{error}</p>}
//     </div>
//   );
// }

// export default ClientDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Navbar, Button, Card, Select } from "flowbite-react";
import Swal from "sweetalert2";
import { getDistance } from "geolib";

function ClientDashboard() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [countyId, setCountyId] = useState("");
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [clientLocation, setClientLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [locationEnabled, setLocationEnabled] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  // const countyId = localStorage.getItem("countyId");

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
          const countyData = await countyResponse.json(); // Assuming county data is an array of objects with id and name

          setServices(serviceData.all_services);
          setData(userData);
          setCounties(countyData.all_counties); // Set counties in state
        } else {
          const errorMessage = await serviceResponse.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Try again later");
      }
    };

    fetchData();
  }, []);

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
            setCountyId(responseData.county_id);
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
  }, [selectedCounty]);

  const countyIdd = localStorage.getItem("countyId");
  console.log("sffgdgshsjskkacounty:", countyId);
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
  }, [clientLocation, locationEnabled]);

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
        localStorage.setItem(
          "providerIds",
          JSON.stringify(responseData.provider_ids)
        );
        const providerIds = responseData.provider_ids.join(",");
        const sorted = selectedCounty !== "";
        if (sorted) {
          navigate(`/primes?provider_ids=${providerIds}`);
        } else {
          navigate(`/providers?provider_ids=${providerIds}`);
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

  return (
    <div className="p-4">
      <Navbar fluid rounded className="bg-black">
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img={data.image} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {data.first_name} {data.last_name}
              </span>
              <span className="block truncate text-sm font-medium">
                {data.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="/link1" active></Navbar.Link>
          <Navbar.Link href="/link2"></Navbar.Link>
          <Navbar.Link href="/link3"></Navbar.Link>
          <Navbar.Link href="/link4"></Navbar.Link>
          <Navbar.Link href="/link5"></Navbar.Link>
        </Navbar.Collapse>
      </Navbar>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full mb-4 max-w-80 ml-5"
        />
      </div>

      <div className="flex items-center mb-4 max-w-80 ml-5">
        <Select
          id="counties"
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
          className="p-2 border rounded w-48"
        >
          <option value="">Select county...</option>
          {counties.map((county) => (
            <option key={county.id} value={county.name}>
              {county.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {filteredServices.map((service) => (
          <div key={service.id} className="mb-4">
            <Card className="max-w-sm mt-3 ml-5">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {service.name}
              </h5>
              <Button onClick={() => handleProviders(service)}>
                Service Providers
              </Button>
            </Card>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default ClientDashboard;
