import React, { useState } from 'react';
import { Label } from 'flowbite-react';

const CustomDropdown = ({ allServices, selectedServices, handleCheckboxChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="max-w-md">
      <div className="mb-2 block">
        <Label htmlFor="services" value="Select your service" />
      </div>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          Select Services
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 00-.707.293l-7 7a1 1 0 001.414 1.414L10 5.414l6.293 6.293a1 1 0 001.414-1.414l-7-7A1 1 0 0010 3z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <ul
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            tabIndex="-1"
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-item-3"
          >
            {allServices.map((service) => (
              <li
                key={service.id}
                className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
                id="listbox-item-0"
                role="option"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    value={service.id}
                    onChange={() => handleCheckboxChange(service)}
                    checked={selectedServices.some(
                      (s) => s.id === service.id
                    )}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-3 block font-normal truncate">
                    {service.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
