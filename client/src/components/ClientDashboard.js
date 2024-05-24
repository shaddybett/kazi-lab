import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Navbar, Button, Card } from "flowbite-react";
import Swal from 'sweetalert2'

function ClientDashboard() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [providerIds, setProviderIds] = useState([]);
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
          setServices(responseData.all_services);
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Try again later");
      }
    };

    const handleUser = async () => {
      try {
        const token = localStorage.getItem("token");
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

    fetchData();
    handleUser();
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
        const userResponse = await fetch(`/provider-details?provider_ids=${providerIds}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();

          const providerNames = userData.first_names;
          setProviders(providerNames);
          navigate("/providers");
        } else {
          const errorMessage = await userResponse.json();
          setError(errorMessage.error);
        }
      } else {
        const errorMessage = await response.json();
        setError(
          errorMessage.error || "An error occurred while fetching provider IDs"
        );
      }
    } catch (error) {
      setError("An error occurred please try again later");
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
  })
  if (result.isConfirmed){
    localStorage.removeItem("token");
    navigate("/login");
  }
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div>
      <Navbar fluid rounded className="bg-black">
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={data.image}
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
          <Navbar.Link href="/link1" active>

          </Navbar.Link>
          <Navbar.Link href="/link2"></Navbar.Link>
          <Navbar.Link href="/link3"></Navbar.Link>
          <Navbar.Link href="/link4"></Navbar.Link>
          <Navbar.Link href="/link5"></Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <Card className="max-w-sm">
        {services.map((service) => (
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
