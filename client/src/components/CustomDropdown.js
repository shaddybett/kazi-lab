import React from "react";
import { Dropdown } from "flowbite-react";

const CustomDropdown = ({
  allServices,
  selectedServices,
  handleCheckboxChange,
}) => {
  return (
    <div className="relative">
      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
        <Dropdown>
          {allServices.map((service) => (
            <div key={service.id} className="p-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedServices.some((s) => s.id === service.id)}
                  onChange={() => handleCheckboxChange(service)}
                />
                <span className="ml-2">{service.name}</span>
              </label>
            </div>
          ))}
        </Dropdown>
      </div>
    </div>
  );
};

export default CustomDropdown;
