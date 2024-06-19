
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Avatar, Dropdown, Navbar, Button, Card } from "flowbite-react";
// import Swal from "sweetalert2";

// function ClientDashboard() {
//   const [data, setData] = useState({});
//   const [error, setError] = useState("");
//   const [services, setServices] = useState([]);
//   const [searchQuery,setSearchQuery] = useState("")
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const [serviceResponse, userResponse] = await Promise.all([
//           fetch("/service", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//           fetch("/dashboard", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//         ]);

//         if (serviceResponse.ok && userResponse.ok) {
//           const serviceData = await serviceResponse.json();
//           const userData = await userResponse.json();
//           setServices(serviceData.all_services);
//           setData(userData);
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

//   const handleProviders = async (service) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`/provider-ids/${service.id}`, {
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

function ClientDashboard() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [serviceResponse, userResponse, countyResponse] = await Promise.all([
          fetch("/service", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("/dashboard", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("/county", {
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

  const handleProviders = async (service) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/provider-ids/${service.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("providerIds", JSON.stringify(responseData.provider_ids));
        const providerIds = responseData.provider_ids.join(",");
        navigate(`/providers?provider_ids=${providerIds}`);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error || "An error occurred while fetching provider IDs");
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
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountyChange = async (e) => {
    const selectedCounty = e.target.value;
    setSelectedCounty(selectedCounty);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/services-by-county/${selectedCounty}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setServices(responseData.services);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error || "An error occurred while fetching services by county");
      }
    } catch (error) {
      setError("An error occurred please try again later");
    }
  };

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
          onChange={handleCountyChange}
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
