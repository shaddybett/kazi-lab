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
//       {message && typeof message === 'object' ? <p>{message.error}</p> : <p>{message}</p>}

//     </div>
//   );
// }

// export default ProviderDetails;





import React, { useEffect, useState } from "react";
import { Dropdown, FileInput, Label } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function ProviderDetails() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState(null); // Use null to represent no image selected
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [allServices, setAllServices] = useState([]);
  const navigate = useNavigate();

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
          setAllServices(responseData.all_services);
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

  const handleServiceFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const formData = new FormData();
      formData.append("first_name", "YourFirstName"); // Placeholder, replace with actual data
      formData.append("last_name", "YourLastName"); // Placeholder, replace with actual data
      formData.append("email", "example@example.com"); // Placeholder, replace with actual data
      formData.append("password", "yourpassword123"); // Placeholder, replace with actual data
      formData.append("selectedRole", 2); // Placeholder, replace with actual data
      formData.append("service_name", newServiceName.trim() !== "" ? newServiceName : "");
      formData.append("middleName", middleName.trim());
      formData.append("id", nationalId.trim());
      formData.append("number", phoneNumber.trim());
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        setMessage(responseData.message);
        // Navigate to "/providerPage" upon successful signup
        navigate("/providerPage");
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

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
          {allServices.map((service) => (
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
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
          placeholder="Enter new service name"
        />
        <input
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          placeholder="Enter middle name"
        />
        <input
          type="text"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          placeholder="Enter national ID"
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
        />
        <div className="mb-2 block">
          <Label htmlFor="file-upload" value="Upload Image" />
        </div>
        <FileInput
          id="file-upload"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p>{error}</p>}
      {message && typeof message === "object" ? (
        <p>{message.error}</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

export default ProviderDetails;
