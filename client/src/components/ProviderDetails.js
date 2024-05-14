
import React, { useEffect, useState } from "react";
import { Dropdown, Label } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function ProviderDetails() {
  const [data, setData] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [error, setError] = useState("");
  const [middle_name, setMiddle] = useState("");
  const [phone_number, setNumber] = useState("");
  const [national_id, setN_id] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleServiceFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const uuid = localStorage.getItem("signupUUID");
      console.log(uuid);

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
      const formData = new FormData();
      formData.append("image", image);
      formData.append("middle_name", middle_name);
      formData.append("national_id", national_id);
      formData.append("phone_number", phone_number);
      formData.append("uids", uuid);
      const userDetailsResponse = await fetch('/signup2',{
        method:"POST",
        headers:{
          "Content-Type": "multipart/form-data"
        },
        body: formData,
      })
      console.log(middle_name, national_id, phone_number, uuid, image);

      // Check if both requests were successful
      if (serviceResponse.ok && !userDetailsResponse.ok) {
        setError(userDetailsErrors.error)
      }
      if (userDetailsResponse.ok && !serviceResponse.ok) {
        setError(serviceErrors.error)
      }
      if (serviceResponse.ok && userDetailsResponse.ok) {
        const serviceData = await serviceResponse.json();
        const userDetailsData = await userDetailsResponse.json();
        setMessage("Services and user details added successfully");
        navigate("/providerPage");
      }
   
       else {
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
          value={middle_name}
          onChange={(e) => setMiddle(e.target.value)}
        />
        <input
          type="text"
          placeholder="0722000000"
          value={phone_number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="12345678"
          value={national_id}
          onChange={(e) => setN_id(e.target.value)}
        />
        <input
          type="text"
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
          placeholder="Enter new service name"
        />

        <div className="mb-2 block">
          <Label
            htmlFor="file-upload"
            value={image ? image.name : ""}
          />
        </div>
        <input id="file-upload" type="file" onChange={(e)=> setImage(e.target.files[0]) } />

        <button type="submit">Submit</button>
      </form>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProviderDetails;
