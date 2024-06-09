
import React, { useState } from "react";

const ServiceDropdown = ({
  services,
  selectedServices,
  handleCheckboxChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative bg-gray-200 rounded">
      <input
        type="text"
        placeholder="Search services..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-2 p-1 border border-gray-400 rounded ml-6 mt-2"
      />
      <div className="max-h-40 overflow-y-auto ">
        {filteredServices.map((service) => (
          <label key={service.id} className="block mb-2 ml-1">
            <input
              type="checkbox"
              value={service.id}
              onChange={() => handleCheckboxChange(service)}
              checked={selectedServices.some((s) => s.id === service.id)}
              className="mr-2"
            />
            {service.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ServiceDropdown;
