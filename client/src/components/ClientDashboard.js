import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Navbar, Button, Card } from "flowbite-react";

function ClientDashboard() {
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [services,setServices] = useState("")

  const navigate = useNavigate();

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
    const handleServices = async(e)=>{
      
      e.preventDefault()
      try{
        const token = localStorage.getItem("token")
        const response = await fetch('/service',{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
          }
        })
        if (response.ok) {
          const responseData = await response.json()
          setServices(responseData)
        }
        else{
          const errors = await response.json()
          setError(errors)
        }
      }
      catch(error){
        setError('An error occurred. Try again later')
      }
    }
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
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {services && <p>{services.service_name}</p>}
        </h5>
        <Button>
          Service Providers
          <svg
            className="-mr-1 ml-2 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </Card>
      {error && <p>{error}</p>}
    </div>
  );
}

export default ClientDashboard;
