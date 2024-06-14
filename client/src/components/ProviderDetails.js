// import React, { useEffect, useState } from "react";
// import { Dropdown, Label } from "flowbite-react";
// import { useNavigate } from "react-router-dom";

// function ProviderDetails() {
//   const [data, setData] = useState([]);
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [newServiceName, setNewServiceName] = useState("");
//   const [error, setError] = useState("");
//   const [middle_name, setMiddle] = useState("");
//   const [phone_number, setNumber] = useState("");
//   const [national_id, setN_id] = useState("");
//   const [message, setMessage] = useState("");
//   const [image, setImage] = useState(null);
//   const navigate = useNavigate();
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [manualLocation, setManualLocation] = useState(false);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);
//       },
//       (error) => {
//         console.error(error);
//         setManualLocation(true);
//       }
//     );
//   }, []);
//   const handleServiceFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const id = localStorage.getItem("id");
//       const uuid = localStorage.getItem("signupUUID");
//       console.log(uuid);

//       // Send request to add services
//       const serviceRequestBody = {
//         user_id: id,
//         existing_services: selectedServices.map((service) => service.id),
//         service_name: newServiceName.trim() !== "" ? newServiceName : null,
//       };
//       const serviceResponse = await fetch("/service", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(serviceRequestBody),
//       });
//       const formData = new FormData();
//       formData.append("image", image);
//       formData.append("middle_name", middle_name);
//       formData.append("national_id", national_id);
//       formData.append("phone_number", phone_number);
//       formData.append("uids", uuid);
//       formData.append("latitude", latitude);
//       formData.append("longitude", longitude);
//       const userDetailsResponse = await fetch("/signup2", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });
//       console.log(middle_name, national_id, phone_number, uuid, image);
//       if (serviceResponse.ok && userDetailsResponse.ok) {
//         const serviceData = await serviceResponse.json();
//         const userDetailsData = await userDetailsResponse.json();
//         localStorage.setItem("serviceData", JSON.stringify(serviceData));
//         console.log(serviceData);
//         localStorage.setItem(
//           "userDetailsData",
//           JSON.stringify(userDetailsData)
//         );
//         setMessage("Services and user details added successfully");
//         navigate("/providerPage");
//       } else {
//         // Handle errors if any request fails
//         const serviceErrors = await serviceResponse.json();
//         const userDetailsErrors = await userDetailsResponse.json();
//         setError(serviceErrors.error || userDetailsErrors.error);
//       }
//     } catch (error) {
//       setError(error.message || "An error occurred. Please try again later.");
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("/service", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const responseData = await response.json();
//           setData(responseData.all_services);
//         } else {
//           const errorMessage = await response.json();
//           setError(errorMessage.error);
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later.");
//       }
//     };
//     fetchData();
//   }, []);
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
//     if (error) {
//       const timer = setTimeout(() => {
//         setError("");
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);
//   return (
//     <div>
//       <h1>Fill the forms below to complete your signup</h1>
//       <form onSubmit={handleServiceFormSubmit} enctype="multipart/form-data">
//         <Dropdown label="Services">
//           {data &&
//             data.map((service) => (
//               <Dropdown.Item key={service.id} className="text-black">
//                 <label>
//                   <input
//                     type="checkbox"
//                     value={service.id}
//                     onChange={() => handleCheckboxChange(service)}
//                     checked={selectedServices.some((s) => s.id === service.id)}
//                   />
//                   {service.name}
//                 </label>
//               </Dropdown.Item>
//             ))}
//         </Dropdown>

//         <input
//           type="text"
//           placeholder="mama Junior"
//           value={middle_name}
//           onChange={(e) => setMiddle(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="0722000000"
//           value={phone_number}
//           onChange={(e) => setNumber(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="12345678"
//           value={national_id}
//           onChange={(e) => setN_id(e.target.value)}
//         />
//         <input
//           type="text"
//           value={newServiceName}
//           onChange={(e) => setNewServiceName(e.target.value)}
//           placeholder="Enter new service name"
//         />
//         <div>
//           <label>
//             <input
//               type="checkbox"
//               checked={manualLocation}
//               onChange={() => setManualLocation(!manualLocation)}
//             />
//             Manually enter location
//           </label>
//           {manualLocation && (
//             <>
//               <input
//                 type="text"
//                 placeholder="Latitude"
//                 value={latitude || ""}
//                 onChange={(e) => setLatitude(e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="Longitude"
//                 value={longitude || ""}
//                 onChange={(e) => setLongitude(e.target.value)}
//               />
//             </>
//           )}
//         </div>
//         <div className="mb-2 block">
//           <Label htmlFor="file-upload" value={image ? image.name : ""} />
//         </div>
//         <input
//           id="file-upload"
//           type="file"
//           onChange={(e) => setImage(e.target.files[0])}
//         />

//         <button type="submit">Submit</button>
//       </form>

//       {error && <p className="text-red-500">{error}</p>}
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default ProviderDetails;



import React, { useEffect, useState, useRef } from "react";
import { Dropdown, Label } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ServiceDropdown from "./ServiceDropdown";

function ProviderDetails() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [middle_name, setMiddle] = useState("");
  const [phone_number, setNumber] = useState("");
  const [national_id, setN_id] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [manualLocation, setManualLocation] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        setManualLocation(true);
      }
    );
  }, []);

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/service", {
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
    };
    fetchAllServices();
  }, []);

  const handleServiceFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const uuid = localStorage.getItem("signupUUID");
      console.log(uuid);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("middle_name", middle_name);
      formData.append("national_id", national_id);
      formData.append("phone_number", phone_number);
      formData.append("uids", uuid);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("services", JSON.stringify(selectedServices.map(service => service.id)));

      const userDetailsResponse = await fetch("/signup2", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (userDetailsResponse.ok) {
        const userDetailsData = await userDetailsResponse.json();
        localStorage.setItem("userDetailsData", JSON.stringify(userDetailsData));
        setMessage("User details added successfully");
        navigate("/providerPage");
      } else {
        const userDetailsErrors = await userDetailsResponse.json();
        setError(userDetailsErrors.error);
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again later.");
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

  const handleCheckboxChange = (service) => {
    const selectedIndex = selectedServices.findIndex((s) => s.id === service.id);
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

  return (
    <div>
      <h1>Fill the forms below to complete your signup</h1>
      <form onSubmit={handleServiceFormSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Middle Name"
          value={middle_name}
          onChange={(e) => setMiddle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone_number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="National ID"
          value={national_id}
          onChange={(e) => setN_id(e.target.value)}
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={manualLocation}
              onChange={() => setManualLocation(!manualLocation)}
            />
            Manually enter location
          </label>
          {manualLocation && (
            <>
              <input
                type="text"
                placeholder="Latitude"
                value={latitude || ""}
                onChange={(e) => setLatitude(e.target.value)}
              />
              <input
                type="text"
                placeholder="Longitude"
                value={longitude || ""}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </>
          )}
        </div>
        <div className="mb-2 block">
          <Label htmlFor="file-upload" value={image ? image.name : ""} />
        </div>
        <input
          id="file-upload"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div ref={dropdownRef}>
          <ServiceDropdown
            services={allServices}
            selectedServices={selectedServices}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProviderDetails;
