// import React, { useEffect, useState } from "react";
// import { Dropdown } from "flowbite-react";

// function ProviderDetails() {
//   const [data, setData] = useState([]);
//   const [error, setError] = useState("");
//   const [service_name, setServiceName] = useState("");
//   const [message, setMessage] = useState("");

//   const handleForm = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("/service", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           service_name
//         }),
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
//           console.log(responseData.services);
//           setData(responseData.services);
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

//   return (
//     <div>
//       <form onSubmit={handleForm}>
//         <input
//           type="text"
//           value={service_name}
//           placeholder="Additional services"
//           onChange={(e) => setServiceName(e.target.value)}
//         />
//         <Dropdown label="Services" inline>
//           {data
//             .filter((service) => service !== "")
//             .map((service, index) => (
//               <Dropdown.Item key={index} className="text-black">
//                <p type='checkbox'></p> {service}
//               </Dropdown.Item>
//             ))}
//         </Dropdown>
//         <button type="submit">Add Service</button>
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
      const response = await fetch("/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          existing_services: selectedServices,
          new_service_name: newServiceName,
        }),
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
            "Authorization": `Bearer ${token}`
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData.services);
          console.log(responseData.services)
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
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
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
