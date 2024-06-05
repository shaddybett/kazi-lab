import React, { useEffect, useState } from "react";

function ServiceProviders() {
  const [providers, setProviders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        // Retrieve the access token from localStorage
        const token = localStorage.getItem("token");
        const providerIds = JSON.parse(localStorage.getItem("providerIds")); // Assuming you have an array of provider IDs
        // const queryString = providerIds.map(id => `provider_ids[]=${id}`).join('&');

        // Fetch provider details using the /provider-details endpoint
        const response = await fetch(
          `/provider-details?provider_ids=${providerIds.join(",")}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
            },
          }
        );
        if (response.ok) {
          const providerDetails = await response.json();
          setProviders(providerDetails);
        } else {
          throw new Error("Failed to fetch provider details");
        }
      } catch (error) {
        console.error("Error fetching provider details:", error);
      }
    };

    fetchProviderDetails();
  }, []);

  const handleProviderClick = async (provider) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/user-details?email=${provider.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userDetails = await response.json();
        setSelectedUser(userDetails);
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      <h1>Service Providers</h1>
      <ul>
        {providers.map((provider, index) => (
          <li key={index} onClick={() => handleProviderClick(provider)}>
            {provider.first_name} {provider.last_name}
          </li>
        ))}
      </ul>
      {selectedUser && <UserDetailsPopup user={selectedUser} onClose={closePopup} />}
    </div>
  );
}

export default ServiceProviders;
