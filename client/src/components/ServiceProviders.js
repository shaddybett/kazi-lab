import React, { useEffect, useState } from "react";

function ServiceProviders() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        // Fetch provider details using provider IDs
        // Use fetch or any other method to send a request to the backend
        // and retrieve the details of each provider
        const response = await fetch("/provider-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providerIds: [
              /* Array of provider IDs */
            ],
          }),
        });
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

  return (
    <div>
      <h1>Providers</h1>
      <ul>
        {providers.map((provider) => (
          <li key={provider.id}>{provider.first_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ServiceProviders;
