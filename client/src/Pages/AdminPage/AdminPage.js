// import React, { useState } from "react";
// import { Table } from "flowbite-react";

// function AdminPage() {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState([]);
//   const [provider, setProvider] = useState([]);
//   const [client, setClient] = useState([]);
//   const handleUsers = async (e) => {
//     const token = localStorage.getItem("token");
//     e.preventDefault();
//     const response = await fetch("/all_users", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer {token}`,
//       },
//     });
//     if (response.ok) {
//       const responseData = response.json();
//       if (responseData.role_id === 2) {
//         const role = provider;
//       } else if (responseData.role_id === 3) {
//         const role = client;
//       }
//       setUsers(responseData);
//     } else {
//       const errorMessage = response.json();
//       setError(errorMessage.error);
//     }
//   };
//   return (
//     <div>
//       <div className="overflow-x-auto">
//         <Table hoverable>
//           <Table.Head>
//             <Table.HeadCell>name</Table.HeadCell>
//             <Table.HeadCell>email</Table.HeadCell>
//             <Table.HeadCell>phone number</Table.HeadCell>
//             <Table.HeadCell>I.d number</Table.HeadCell>
//             <Table.HeadCell>
//               <span className="sr-only">Edit</span>
//             </Table.HeadCell>
//           </Table.Head>
//           <Table.Body className="divide-y">
//             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
//               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                 {users.first_name} {users.last_name}
//               </Table.Cell>
//               <Table.Cell>{users.email}</Table.Cell>
//               <Table.Cell>{users.phone_number}</Table.Cell>
//               <Table.Cell>{users.id}</Table.Cell>
//               <Table.Cell>{role}</Table.Cell>
//               <Table.Cell>
//                 <a
//                   href="#"
//                   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
//                 >
//                   Edit
//                 </a>
//               </Table.Cell>
//             </Table.Row>
//           </Table.Body>
//         </Table>
//       </div>
//     </div>
//   );
// }

// export default AdminPage;
