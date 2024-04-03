import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, Dropdown, Navbar, Button, Card } from "flowbite-react";

function ClientDashboard() {
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [services, setServices] = useState("");

  const navigate = useNavigate();

  const handleProviders = async (service) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/service-provider?serviceId=${service.id}`,
        {
          method: "GET",
          Authorization: `Bearer ${token}`,
        }
      );
      if (response.ok) {
        navigate("/providers");
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred please try again later");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleProfile = () => {
    navigate("/profile");
  };
  useEffect(() => {
    const handleEntry = async () => {
      const token = localStorage.getItem("token");
      try {
        if (!token) {
          throw new Error("Token not found");
        }
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
        setError("An error occurred.Please try again later!");
      }
    };
    const handleServices = async () => {
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
          setServices(responseData.all_services);
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Try again later");
      }
    };
    handleServices();
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
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
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
      <Card className="max-w-sm">
        {services &&
          services.map((service) => (
            <div key={service.id} className="mb-4">
              <Card className="max-w-sm">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {service.name}
                </h5>
                <Button onClick={() => handleProviders(service)}>
                  Service Providers
                </Button>
              </Card>
            </div>
          ))}
      </Card>

      {error && <p>{error}</p>}
    </div>
  );
}

export default ClientDashboard;
