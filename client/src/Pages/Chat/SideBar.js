import React from "react";
import { FaSearch } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";
import ContactItem from "./ContactItem";

const Sidebar = ({ contacts, setActiveUser, receiver }) => {
  return (
    <div className="w-full  md:w-1/4 bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-white text-xl font-bold">Recent Chats</h1>
        <MdMoreVert className="text-white" />
      </div>
      <div className="flex items-center bg-gray-700 p-2 rounded mb-4">
        <FaSearch className="text-white" />
        <input
          type="text"
          placeholder="Search Contact"
          className="bg-gray-700 text-white ml-2 outline-none w-full"
        />
      </div>
      <div>
        {contacts.map((contact, index) => (
          <ContactItem
            key={index}
            contact={contact}
            setActiveUser={setActiveUser}
            receiver={receiver}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
