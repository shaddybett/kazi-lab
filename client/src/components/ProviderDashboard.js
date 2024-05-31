import React from "react";
import { useState, useEffect } from "react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

function ProviderDashboard() {
  const [data, setData] = useState("");
  const [service, setService] = useState("")
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile");
  };
  const handleLogout = async() => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!"
  })
  if (result.isConfirmed){
    localStorage.removeItem("token");
    navigate("/login");
  }
  };
  useEffect(() => {
    const handleEntry = async () => {
      const token = localStorage.getItem("token");
      console.log(token)
      try {
        const response = await fetch("/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    };
    const fetchData = async () => {
      try {
        const serviceDataString = localStorage.getItem("serviceData");
        const serviceData = JSON.parse(serviceDataString)
        const service_ids = serviceData.service_ids;
        console.log(service_ids)
        const response = await fetch("/offers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({service_ids})
        });
        if (response.ok) {
          const responseData = await response.json();
          setService(responseData.service_name);
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error);
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
    };
    fetchData();
    handleEntry();
  }, []);
  return (
    <div>
      <Navbar fluid rounded className="bg-black ">
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img= {data.image}
                rounded
              />
            }
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
          <Navbar.Link href="#" active></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <div>
        <h2>Hello, {data.first_name} welcome </h2>
        <h1>Services you offer</h1>
        {service.length > 0 && (
        <ul>
          {service.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      )}
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}

export default ProviderDashboard;
