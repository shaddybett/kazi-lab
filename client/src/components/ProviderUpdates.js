import React, { useEffect, useState, useCallback, useRef } from "react";
import NewChatBox from "../Pages/Chat/NewChatBox";
import { FaCommentDots, FaHeart, FaBriefcase } from 'react-icons/fa'; // Import more icons for jobs and likes
import './ProviderDashboard.css';

function ProviderUpdates({ senderId, assigned, likes, className, onClose, minimized }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [providerIds, setProviderIds] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarMinimized(true);
      } else {
        setIsSidebarMinimized(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClickOutside = (event) => {
    if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
      if (typeof onClose === "function") {
        onClose();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAssignedIds = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/assigned_resource/${senderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProviderIds(data.provider_ids);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching assigned IDs:", error);
    }
  }, [senderId, backendUrl]);

  const fetchCustomerDetails = useCallback(async () => {
    if (providerIds.length === 0) {
      return;
    }
    const stringProviderIds = providerIds.map((id) => id.toString());

    try {
      const response = await fetch(`${backendUrl}/recent_clients?ids=${stringProviderIds.join(",")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCustomerDetails(data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  }, [providerIds, backendUrl]);

  const handleChatClick = (customer) => {
    setCurrentCustomer(customer);
    setOpenChat(true);
  };

  const handleClose = () => {
    setOpenChat(false);
  };

  useEffect(() => {
    fetchAssignedIds();
  }, [fetchAssignedIds]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [providerIds, fetchCustomerDetails]);

  return (
    <div ref={chatBoxRef} className={`provider-updates-popup `}>
      <div className={minimized ? "mini-updates" : ""}>
        <div className="rounded-lg shadow-lg p-2 bg-gradient-to-r from-blue-500 to-indigo-600">
          <h4 className="text-xl font-bold text-white mb-4 text-center">Recent Clients</h4>
          {customerDetails.length === 0 && (
            <p className="text-gray-200 text-center">No customers available.</p>
          )}
          {customerDetails.map((customer, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-3 p-2 bg-white text-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
            >
              <p className="font-medium text-blue-900 ">
                {customer.first_name} {customer.last_name}
              </p>
              <FaCommentDots
                className="text-blue-500 cursor-pointer hover:text-blue-700 transition-transform transform hover:scale-110"
                size={20}
                onClick={() => handleChatClick(customer)}
              />
            </div>
          ))}
          <h2 className=" text-white flex justify-center " >Likes received and jobs assigned</h2>
          <div className=" text-center">
            <div className="stats-box flex items-center justify-center space-x-4">
              <div className="likes-box flex items-center">
                <FaHeart className="text-red-500 mr-2 animate-pulse" size={24} />
                <strong className="text-white text-2xl font-semibold">{likes}</strong>
              </div>
              <div className="assigned-box flex items-center">
                <FaBriefcase className="text-yellow-400 mr-2" size={24} />
                <strong className="text-white text-2xl font-semibold">{assigned}</strong>
              </div>
            </div>
          </div>
        </div>
        {openChat && <NewChatBox senderId={senderId} receiver={currentCustomer} onClose={handleClose} />}
      </div>
    </div>
  );
}

export default ProviderUpdates;
