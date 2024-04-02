// import React, { useEffect, useState } from "react";
// import { Dropdown } from "flowbite-react";

// function ProviderDetails() {
//   const [data, setData] = useState([]);
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [newServiceName, setNewServiceName] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleForm = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const requestBody = {
//         existing_services: selectedServices.map((service) => service.id),
//       };
//       if (newServiceName.trim() !== "") {
//         requestBody.service_name = newServiceName;
//       }
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
//           // setUserServices(responseData.user_services);
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
//     if (selectedServices.some((s) => s.id === service.id)) {
//       setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
//     } else {
//       setSelectedServices([...selectedServices, service]);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleForm}>
//         <Dropdown label="Services">
//           {data &&
//             data.map((service, index) => (
//               <Dropdown.Item key={index} className="text-black">
//                 <label>
//                   <input
//                     type="checkbox"
//                     value={service}
//                     onChange={() => handleCheckboxChange(service)}
//                     checked={selectedServices.includes(service)}
//                   />
//                   {service}
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
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default ProviderDetails;

import React, { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";

function ProviderDetails() {
  const [data, setData] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id")
      const requestBody = {
        user_id: id, // You need to implement a function to get the user ID
      };
      console.log(id)

      if (newServiceName.trim() !== "") {
        // If new service name is provided, send service name and user id
        requestBody.service_name = newServiceName;
      } else {
        // If existing services are selected, send service ids and user id
        requestBody.services = selectedServices.map((service) => service.id);
      }

      const response = await fetch("/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        setMessage(responseData.message);
      } else {
        const errors = await response.json();
        setError(errors.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
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
          // setUserServices(responseData.user_services);
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
    if (selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div>
      <form onSubmit={handleForm}>
        <Dropdown label="Services">
          {data &&
            data.map((service, index) => (
              <Dropdown.Item key={index} className="text-black">
                <label>
                  <input
                    type="checkbox"
                    value={service}
                    onChange={() => handleCheckboxChange(service)}
                    checked={selectedServices.includes(service)}
                  />
                  {service}
                </label>
              </Dropdown.Item>
            ))}
        </Dropdown>

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
