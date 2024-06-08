import React, { useState } from "react";

const ServiceDropdown = ({ services, selectedServices, handleCheckboxChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="service-dropdown">
      <input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="service-list">
        {filteredServices.map(service => (
          <label key={service.id}>
            <input
              type="checkbox"
              value={service.id}
              onChange={() => handleCheckboxChange(service)}
              checked={selectedServices.some(s => s.id === service.id)}
            />
            {service.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ServiceDropdown;
