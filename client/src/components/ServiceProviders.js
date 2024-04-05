import React, { useEffect, useState } from "react";

function ServiceProviders() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        // Fetch provider details using the /provider-details endpoint
        const response = await fetch("/provider-details", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const providerDetails = await response.json();
          setProviders(providerDetails.first_names);
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
        {providers.map((provider, index) => (
          <li key={index}>{provider}</li>
        ))}
      </ul>
    </div>
  );
}

export default ServiceProviders;
