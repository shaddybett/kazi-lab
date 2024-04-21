// import React, { useEffect, useState } from "react";
// import { Dropdown, FileInput, Label } from "flowbite-react";
// import { useNavigate } from "react-router-dom";

// function ProviderDetails() {
//   const [data, setData] = useState([]);
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [newServiceName, setNewServiceName] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleServiceFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const id = localStorage.getItem("id");
//       const requestBody = {
//         user_id: id,
//         existing_services: selectedServices.map((service) => service.id),
//         service_name: newServiceName.trim() !== "" ? newServiceName : null,
//       };
//       const response = await fetch("/service", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestBody),
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         setMessage(responseData.message);
//       } else {
//         const errors = await response.json();
//         setError(errors.error);
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later.");
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

//   return (
//     <div>
//       <form onSubmit={handleServiceFormSubmit}>
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
//           value={newServiceName}
//           onChange={(e) => setNewServiceName(e.target.value)}
//           placeholder="Enter new service name"
//         />
//         <button type="submit">Add Services</button>
//       </form>

//       {error && <p>{error}</p>}
//       {message && typeof message === "object" ? (
//         <p>{message.error}</p>
//       ) : (
//         <p>{message}</p>
//       )}
//     </div>
//   );
// }

// export default ProviderDetails;

import React, { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function ProviderDetails() {
  const [data, setData] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [error, setError] = useState("");
  const [middle, setMiddle] = useState("");
  const [number, setNumber] = useState("");
  const [n_id, setN_id] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleServiceFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      // Send request to add services
      const serviceRequestBody = {
        user_id: id,
        existing_services: selectedServices.map((service) => service.id),
        service_name: newServiceName.trim() !== "" ? newServiceName : null,
      };
      const serviceResponse = await fetch("/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceRequestBody),
      });

      // Send request to add user details
      const userDetailsRequestBody = {
        middle_name: middle.trim() !== "" ? middle : null,
        national_id: n_id.trim() !== "" ? n_id : null,
        phone_number: number.trim() !== "" ? number : null,
      };
      const userDetailsResponse = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userDetailsRequestBody),
      });

      // Check if both requests were successful
      if (serviceResponse.ok && userDetailsResponse.ok) {
        const serviceData = await serviceResponse.json();
        const userDetailsData = await userDetailsResponse.json();
        setMessage("Services and user details added successfully");
        navigate("/providerPage");
      } else {
        // Handle errors if any request fails
        const serviceErrors = await serviceResponse.json();
        const userDetailsErrors = await userDetailsResponse.json();
        setError(serviceErrors.error || userDetailsErrors.error);
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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
          setData(responseData.all_services);
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error);
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (service) => {
    const selectedIndex = selectedServices.findIndex(
      (s) => s.id === service.id
    );
    if (selectedIndex === -1) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    }
  };

  return (
    <div>
      <form onSubmit={handleServiceFormSubmit}>
        <Dropdown label="Services">
          {data &&
            data.map((service) => (
              <Dropdown.Item key={service.id} className="text-black">
                <label>
                  <input
                    type="checkbox"
                    value={service.id}
                    onChange={() => handleCheckboxChange(service)}
                    checked={selectedServices.some((s) => s.id === service.id)}
                  />
                  {service.name}
                </label>
              </Dropdown.Item>
            ))}
        </Dropdown>
        <input
          type="text"
          placeholder="mama Junior"
          value={middle}
          onChange={(e) => setMiddle(e.target.value)}
        />
        <input
          type="text"
          placeholder="0722000000"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="12345678"
          value={n_id}
          onChange={(e) => setN_id(e.target.value)}
        />
        <input
          type="text"
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
          placeholder="Enter new service name"
        />
        <button type="submit">Add Services</button>
      </form>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProviderDetails;
