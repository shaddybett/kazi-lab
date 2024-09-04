// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Table, Dropdown, TableCell, Navbar, Avatar } from "flowbite-react";
// import "./AdminPage.css";
// import AdminUsersPopup from "./AdminUsersPopup";
// import ChatBox from "../Chatbox/ChatBox";
// import ServiceProviderChatBox from "../Chatbox/ServiceProviderChatbox";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import BlockedUsers from "./BlockedUsers";

// function AdminPage() {
//   const [providers, setProviders] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [chatUser, setChatUser] = useState(null);
//   const backendUrl = process.env.REACT_APP_BACKEND_URL;
//   const [message, setMessage] = useState([]);
//   const [chaty, setChaty] = useState(null);
//   const [blocked, setBlocked] = useState([]);
//   const popupRef = useRef(null);

//   const currentUserId = localStorage.getItem("id");
//   const navigate = useNavigate();

//   const handleUsers = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(`${backendUrl}/all_users`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const responseData = await response.json();
//         const fetchedProviders = responseData.filter(
//           (user) => user.role_id === 2
//         );
//         const fetchedClients = responseData.filter(
//           (user) => user.role_id === 3
//         );
//         setProviders(fetchedProviders);
//         setClients(fetchedClients);
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error);
//       }
//     } catch (err) {
//       setError("An unexpected error occurred");
//     }
//   }, [backendUrl]);

//   const handleBlockedUsers = async () => {
//     try {
//       const response = await fetch(`${backendUrl}/fetch_blocked`, {
//         method: "GET",
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         setBlocked(responseData.users);
//       } else {
//         const errorResponse = await response.json();
//         setError(errorResponse.error);
//         handleBlockedClose();
//       }
//     } catch (error) {
//       setError("An error occurred,please try again later");
//     }
//   };

//   const handleBlockedProviderClick = async (bUser) => {
//     if (bUser) {
//       Swal.fire({
//         title: "Blocked User",
//         text: `Reason: ${bUser.reason}`,
//         icon: "info",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Unblock User",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           handleUnblock(bUser);
//         }
//       });
//     }
//   };

//   const handleProviderClick = async (user) => {
//     if (user.is_blocked) {
//       Swal.fire({
//         title: "Blocked User",
//         text: `Reason: ${user.block_reason}`,
//         icon: "info",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Unblock User",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           handleUnblock(user);
//         }
//       });
//     } else {
//       try {
//         const response = await fetch(
//           `${backendUrl}/user-details?email=${user.email}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.ok) {
//           const userDetails = await response.json();
//           setSelectedUser(userDetails);
//         } else {
//           throw new Error("Failed to load user details");
//         }
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       }
//     }
//   };

//   const handleBlockedClose = () => {
//     setBlocked([]);
//   };

//   const handleChatClick = (user) => {
//     setChatUser(user);
//   };

//   const closePopup = () => {
//     setSelectedUser(null);
//   };

//   const closeChat = () => {
//     setChatUser(null);
//   };

//   useEffect(() => {
//     handleUsers();
//   }, [backendUrl, handleUsers]);

//   const handleChat = () => {
//     setChaty(currentUserId);
//   };

//   const closeChatty = () => {
//     setChaty(null);
//   };
//   const handleLogout = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Logout!",
//     });
//     if (result.isConfirmed) {
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setChaty(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [popupRef]);

//   const handleBlock = async (user) => {
//     const { value: blockDetails } = await Swal.fire({
//       title: "Are you sure you want to block this user?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Block User!",
//       input: "text",
//       inputLabel: "Reason for blocking",
//       inputPlaceholder: "Enter the reason for blocking this user...",
//     });

//     if (blockDetails) {
//       const data = {
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//         user_id: user.id,
//         reason: blockDetails,
//       };

//       try {
//         const response = await fetch(`${backendUrl}/block_user`, {
//           method: "POST",
//           body: JSON.stringify(data),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.ok) {
//           Swal.fire("Success", "User has been blocked", "success");
//           handleUsers();
//           const responseData = await response.json();
//           setMessage(responseData.message);
//         } else {
//           const errorMessage = await response.json();
//           setError(errorMessage.error);
//         }
//       } catch (error) {
//         console.error("Error blocking user:", error);
//         setError("An unexpected error occurred");
//       }
//     }
//   };
//   const handleUnblock = async (user) => {
//     try {
//       const response = await fetch(`${backendUrl}/unblock_user`, {
//         method: "POST",
//         body: JSON.stringify({ user_id: user.id }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         Swal.fire("Success", "User has been unblocked", "success");
//         handleUsers();
//         handleBlockedUsers();
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error);
//       }
//     } catch (error) {
//       console.error("Error unblocking user:", error);
//       setError("An unexpected error occurred");
//     }
//   };
//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         setError("");
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   return (
//     <div>
//       <Navbar fluid rounded className="bg-blue-300 navbar">
//         <div className="avatar-container">
//           <Dropdown
//             arrowIcon={false}
//             inline
//             label={<Avatar alt="User settings" rounded />}
//           >
//             <Dropdown.Item>Profile</Dropdown.Item>
//             <Dropdown.Item onClick={handleChat}>Chat</Dropdown.Item>
//             <Dropdown.Item onClick={handleBlockedUsers}>Blocked</Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//           </Dropdown>
//         </div>
//       </Navbar>
//       <h3 className="title">All users</h3>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {message && <p>{message}</p>}
//       <div className="table">
//         <div className="table-1">
//           <h3 className="table-1-title">Service Providers</h3>
//           <Table hoverable>
//             <Table.Head>
//               <Table.HeadCell>Name</Table.HeadCell>
//               <Table.HeadCell>Email</Table.HeadCell>
//               <Table.HeadCell>
//                 <span className="sr-only">Edit</span>
//               </Table.HeadCell>
//             </Table.Head>
//             <Table.Body className="divide-y">
//               {providers.map((user, index) => (
//                 <Table.Row
//                   key={index}
//                   className={`bg-white dark:border-gray-700 dark:bg-gray-800 table-row ${
//                     user.is_blocked ? "bg-red-200" : ""
//                   }`}
//                 >
//                   <Table.Cell
//                     className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
//                     onClick={() => handleProviderClick(user)}
//                   >
//                     {user.first_name} {user.last_name}
//                   </Table.Cell>
//                   <Table.Cell onClick={() => handleProviderClick(user)}>
//                     {user.email}
//                   </Table.Cell>
//                   <TableCell>
//                     <Dropdown arrowIcon={false} inline label="Edit">
//                       <Dropdown.Item onClick={() => handleChatClick(user)}>
//                         Chat
//                       </Dropdown.Item>
//                       <Dropdown.Divider />
//                       {user.is_blocked ? (
//                         <Dropdown.Item
//                           className="text-green-500"
//                           onClick={() => handleUnblock(user)} // Unblock function here
//                         >
//                           Unblock
//                         </Dropdown.Item>
//                       ) : (
//                         <Dropdown.Item
//                           className="text-red-500"
//                           onClick={() => handleBlock(user)} // Block function here
//                         >
//                           Block
//                         </Dropdown.Item>
//                       )}
//                     </Dropdown>
//                   </TableCell>
//                 </Table.Row>
//               ))}
//             </Table.Body>
//           </Table>
//         </div>
//         <div className="table-2">
//           <h2 className="table-2-title">Clients</h2>
//           <Table hoverable>
//             <Table.Head>
//               <Table.HeadCell>Name</Table.HeadCell>
//               <Table.HeadCell>Email</Table.HeadCell>
//             </Table.Head>
//             <Table.Body className="divide-y">
//               {clients.map((user, index) => (
//                 <Table.Row
//                   key={index}
//                   className={`bg-white dark:border-gray-700 dark:bg-gray-800 table-row ${
//                     user.is_blocked ? "bg-red-200" : ""
//                   }`}
//                 >
//                   <Table.Cell
//                     className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
//                     onClick={() => handleProviderClick(user)}
//                   >
//                     {user.first_name} {user.last_name}
//                   </Table.Cell>
//                   <Table.Cell onClick={() => handleProviderClick(user)}>
//                     {user.email}
//                   </Table.Cell>
//                   <TableCell>
//                     <Dropdown arrowIcon={false} inline label="Edit">
//                       <Dropdown.Item onClick={() => handleChatClick(user)}>
//                         Chat
//                       </Dropdown.Item>
//                       <Dropdown.Divider />
//                       {user.is_blocked ? (
//                         <Dropdown.Item
//                           className="text-green-500"
//                           onClick={() => handleUnblock(user)} // Unblock function here
//                         >
//                           Unblock
//                         </Dropdown.Item>
//                       ) : (
//                         <Dropdown.Item
//                           className="text-red-500"
//                           onClick={() => handleBlock(user)} // Block function here
//                         >
//                           Block
//                         </Dropdown.Item>
//                       )}
//                     </Dropdown>
//                   </TableCell>
//                 </Table.Row>
//               ))}
//             </Table.Body>
//           </Table>
//         </div>
//       </div>
//       {selectedUser && (
//         <AdminUsersPopup user={selectedUser} onClose={closePopup} />
//       )}
//       {chatUser && (
//         <ChatBox
//           senderId={currentUserId}
//           receiver={chatUser}
//           onClose={closeChat}
//         />
//       )}
//       {chaty && (
//         <div ref={popupRef}>
//           <ServiceProviderChatBox
//             providerId={currentUserId}
//             onClose={closeChatty}
//           />
//         </div>
//       )}
//       {blocked.length > 0 && (
//         <BlockedUsers
//           blocked={blocked}
//           onClose={handleBlockedClose}
//           click={handleBlockedProviderClick}
//         />
//       )}
//     </div>
//   );
// }

// export default AdminPage;



// src/Pages/AdminPage/AdminPage.js






// src/Pages/AdminPage/AdminPage.js

import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Table, Dropdown, TableCell, Navbar, Avatar } from "flowbite-react";
import "./AdminPage.css";
import AdminUsersPopup from "./AdminUsersPopup";
import ChatBox from "../Chatbox/ChatBox";
import ServiceProviderChatBox from "../Chatbox/ServiceProviderChatbox";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import BlockedUsers from "./BlockedUsers";
import AuthContext from "../../Authorization/AuthContext";

function AdminPage() {
  const [providers, setProviders] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [message, setMessage] = useState([]);
  const [chaty, setChaty] = useState(null);
  const popupRef = useRef(null);

  const currentUserId = localStorage.getItem("id");
  const navigate = useNavigate();
  const { blocked, setBlocked, handleBlockedClose, onBlockedUserClick } = useContext(AuthContext);

  const handleUsers = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${backendUrl}/all_users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const fetchedProviders = responseData.filter(
          (user) => user.role_id === 2
        );
        const fetchedClients = responseData.filter(
          (user) => user.role_id === 3
        );
        setProviders(fetchedProviders);
        setClients(fetchedClients);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  }, [backendUrl]);

  const handleBlockedUsers = async () => {
    try {
      const response = await fetch(`${backendUrl}/fetch_blocked`, {
        method: "GET",
      });
      if (response.ok) {
        const responseData = await response.json();
        setBlocked(responseData.users);
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.error);
        handleBlockedClose();
      }
    } catch (error) {
      setError("An error occurred, please try again later");
    }
  };

  const handleBlockedProviderClick = async (bUser) => {
    if (bUser) {
      Swal.fire({
        title: "Blocked User",
        text: `Reason: ${bUser.reason}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Unblock User",
      }).then((result) => {
        if (result.isConfirmed) {
          handleUnblock(bUser);
        }
      });
    }
  };

  const handleProviderClick = async (user) => {
    if (user.is_blocked) {
      Swal.fire({
        title: "Blocked User",
        text: `Reason: ${user.block_reason}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Unblock User",
      }).then((result) => {
        if (result.isConfirmed) {
          handleUnblock(user);
        }
      });
    } else {
      try {
        const response = await fetch(
          `${backendUrl}/user-details?email=${user.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const userDetails = await response.json();
          setSelectedUser(userDetails);
        } else {
          throw new Error("Failed to load user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  const handleChatClick = (user) => {
    setChatUser(user);
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  const closeChat = () => {
    setChatUser(null);
  };

  useEffect(() => {
    handleUsers();
    handleBlockedUsers();
  }, [backendUrl, handleUsers]);

  const handleChat = () => {
    setChaty(currentUserId);
  };

  const closeChatty = () => {
    setChaty(null);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    });
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setChaty(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleBlock = async (user) => {
    const { value: blockDetails } = await Swal.fire({
      title: "Are you sure you want to block this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Block User!",
      input: "text",
      inputLabel: "Reason for blocking",
      inputPlaceholder: "Enter the reason for blocking this user...",
    });

    if (blockDetails) {
      const data = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_id: user.id,
        reason: blockDetails,
      };

      try {
        const response = await fetch(`${backendUrl}/block_user`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Swal.fire("Success", "User has been blocked", "success");
          handleUsers();
          const responseData = await response.json();
          setMessage(responseData.message);
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error);
        }
      } catch (error) {
        console.error("Error blocking user:", error);
        setError("An unexpected error occurred");
      }
    }
  };

  const handleUnblock = async (user) => {
    try {
      const response = await fetch(`${backendUrl}/unblock_user`, {
        method: "POST",
        body: JSON.stringify({ user_id: user.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        Swal.fire("Success", "User has been unblocked", "success");
        handleUsers();
        handleBlockedUsers();
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      setError("An unexpected error occurred");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      <Navbar fluid rounded className="bg-blue-300 navbar">
        <div className="avatar-container">
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" rounded />}
          >
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item onClick={handleChat}>Chat</Dropdown.Item>
            <Dropdown.Item onClick={handleBlockedUsers}>Blocked</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>
      <h3 className="title">All users</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
      <div className="table">
        <div className="table-1">
          <h3 className="table-1-title">Service Providers</h3>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {providers.map((user, index) => (
                <Table.Row
                  key={index}
                  className={`bg-white dark:border-gray-700 dark:bg-gray-800 table-row ${
                    user.is_blocked ? "bg-red-200" : ""
                  }`}
                >
                  <Table.Cell
                    className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                    onClick={() => handleProviderClick(user)}
                  >
                    {user.first_name} {user.last_name}
                  </Table.Cell>
                  <Table.Cell onClick={() => handleProviderClick(user)}>
                    {user.email}
                  </Table.Cell>
                  <TableCell>
                    <Dropdown arrowIcon={false} inline label="Edit">
                      <Dropdown.Item onClick={() => handleChatClick(user)}>
                        Chat
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      {user.is_blocked ? (
                        <Dropdown.Item
                          className="text-green-500"
                          onClick={() => handleUnblock(user)} // Unblock function here
                        >
                          Unblock
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item
                          className="text-red-500"
                          onClick={() => handleBlock(user)} // Block function here
                        >
                          Block
                        </Dropdown.Item>
                      )}
                    </Dropdown>
                  </TableCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="table-2">
          <h2 className="table-2-title">Clients</h2>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {clients.map((user, index) => (
                <Table.Row
                  key={index}
                  className={`bg-white dark:border-gray-700 dark:bg-gray-800 table-row ${
                    user.is_blocked ? "bg-red-200" : ""
                  }`}
                >
                  <Table.Cell
                    className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                    onClick={() => handleProviderClick(user)}
                  >
                    {user.first_name} {user.last_name}
                  </Table.Cell>
                  <Table.Cell onClick={() => handleProviderClick(user)}>
                    {user.email}
                  </Table.Cell>
                  <TableCell>
                    <Dropdown arrowIcon={false} inline label="Edit">
                      <Dropdown.Item onClick={() => handleChatClick(user)}>
                        Chat
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      {user.is_blocked ? (
                        <Dropdown.Item
                          className="text-green-500"
                          onClick={() => handleUnblock(user)} // Unblock function here
                        >
                          Unblock
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item
                          className="text-red-500"
                          onClick={() => handleBlock(user)} // Block function here
                        >
                          Block
                        </Dropdown.Item>
                      )}
                    </Dropdown>
                  </TableCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      {selectedUser && (
        <AdminUsersPopup user={selectedUser} onClose={closePopup} />
      )}
      {chatUser && (
        <ChatBox
          senderId={currentUserId}
          receiver={chatUser}
          onClose={closeChat}
        />
      )}
      {chaty && (
        <div ref={popupRef}>
          <ServiceProviderChatBox
            providerId={currentUserId}
            onClose={closeChatty}
          />
        </div>
      )}
      {blocked.length > 0 && (
        <BlockedUsers
          blocked={blocked}
          onClose={handleBlockedClose}
          click={handleBlockedProviderClick}
        />
      )}
    </div>
  );
}

export default AdminPage;
