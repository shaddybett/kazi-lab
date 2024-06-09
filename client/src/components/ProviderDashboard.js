import React, { useState, useEffect } from "react";
import { Avatar, Dropdown, Navbar, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ServiceDropdown from "./ServiceDropdown";

function ProviderDashboard() {
  const [data, setData] = useState({});
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [error, setError] = useState("");
  const [newService, setNewService] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile");
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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setServices(responseData.services || []);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

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

  useEffect(() => {
    const handleEntry = async () => {
      const token = localStorage.getItem("token");
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
        if (response.status === 422 || response.status === 401) {
          setError("Your session has expired. Please log in again.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 5000);
          return;
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    };

    fetchData();
    fetchAllServices();
    handleEntry();
  }, []);

  const handleAddService = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add Service!",
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("/add-service", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            service_name: newService,
            existing_services: selectedServices.map((service) => service.id),
          }),
        });
        if (response.ok) {
          setNewService("");
          setError("");
          Swal.fire("Success", "Service added successfully", "success");
          fetchData();
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete!",
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/delete-service/${serviceId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          Swal.fire("Success", "Service deleted successfully", "success");
          fetchData();
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
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
          <Navbar.Link href="#" active></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <div>
        <Card className="max-w-sm">
          <h2>Hello, {data.first_name} welcome! </h2>
          <h1 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Services you offer
          </h1>
          <div>
            {error && (
              <p className="text-red-500">
                {error}
              </p>
            )}
          </div>
          <Dropdown label="Services">
            <ServiceDropdown
              services={allServices}
              selectedServices={selectedServices}
              handleCheckboxChange={handleCheckboxChange}
            />
          </Dropdown>
          {services.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 ">
              {services.map((service) => (
                <li key={service.id}>
                  {service.name}{" "}
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    delete
                  </button>{" "}
                </li>
              ))}
            </ul>
          ) : (
            <p>No services found</p>
          )}
          <div>
            <input
              className="rounded border border-blue-300"
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Add new service"
            />
            <button className="ml-4" onClick={handleAddService}>
              Add
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ProviderDashboard;

