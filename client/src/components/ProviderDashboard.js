// import React, { useState, useEffect, useRef } from "react";
// import Modal from "react-modal";
// import {
//   Avatar,
//   Dropdown,
//   Navbar,
//   Card,
//   DropdownItem,
//   Button,
//   Spinner,
//   FileInput,
//   Label,
// } from "flowbite-react";
// import { json, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faTrash,
//   faPlus,
//   faSquarePlus,
// } from "@fortawesome/free-solid-svg-icons";
// import ServiceDropdown from "./ServiceDropdown";
// import "./ProviderDashboard.css";

// function ProviderDashboard() {
//   const [data, setData] = useState({});
//   const [services, setServices] = useState([]);
//   const [allServices, setAllServices] = useState([]);
//   const [error, setError] = useState("");
//   const [newService, setNewService] = useState("");
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [files, setFiles] = useState([]);
//   const [photos, setPhotos] = useState([]);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [isVideoLoading, setIsVideoLoading] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const backendUrl = process.env.REACT_APP_BACKEND_URL;

//   const handleProfile = () => {
//     navigate("/profile");
//   };

//   const handleFileChange = (event) => {
//     const selectedFiles = event.target.files;
//     setFiles(selectedFiles);
//   };

//   const handleUpload = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Upload!",
//     });
//     if (result.isConfirmed) {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       const imageExtensions = ["png", "jpg", "jpeg", "webp"];

//       for (const file of files) {
//         const fileExtension = file.name.split(".").pop().toLowerCase();
//         if (imageExtensions.includes(fileExtension)) {
//           formData.append("photos", file);
//         } else {
//           formData.append("videos", file);
//         }
//       }

//       try {
//         const response = await fetch(`${backendUrl}/upload`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         });
//         if (response.ok) {
//           const responseData = await response.json();
//           Swal.fire("Success", "Upload successful", "success");
//           setPhotos(responseData.photos || []);
//           setVideos(responseData.videos || []);
//           setError("");
//           handleEntry();
//         } else {
//           const errorMessage = await response.json();
//           setError(errorMessage.error || "An error occurred");
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later.");
//       }
//       setLoading(false);
//     }
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

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/offers`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         setServices(responseData.services || []);
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error);
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later.");
//     }
//   };

//   const fetchAllServices = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/service`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         setAllServices(responseData.all_services || []);
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error);
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later.");
//     }
//   };

//   const handleEntry = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(`${backendUrl}/dashboard`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         setData(responseData);
//         setPhotos(responseData.photos || []);
//         setVideos(responseData.videos || []);
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error || "An error occurred");
//       }
//       if (response.status === 422 || response.status === 401) {
//         setError("Your session has expired. Please log in again.");
//         setTimeout(() => {
//           window.location.href = "/login";
//         }, 5000);
//         return;
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchAllServices();
//     handleEntry();
//   }, [backendUrl]);

//   const handleDelete = async (fileUrl, fileType) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Delete!",
//     });
//     if (result.isConfirmed) {
//       try {
//         const token = localStorage.getItem("token");
//         const fileName = fileUrl.split("/").pop(); 
//         const deleteResponse = await fetch(
//           `${backendUrl}/delete-upload/${fileType}/${fileName}`,
//           {
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (deleteResponse.ok) {
//           Swal.fire("Success", "File deleted successfully", "success");
//           handleEntry();
//         } else {
//           const errorMessage = await deleteResponse.json();
//           setError(errorMessage.error || "An error occurred");
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later");
//       }
//     }
//   };

//   const handlePhotoDelete = (photoUrl) => handleDelete(photoUrl, "photo");
//   const handleVideoDelete = (videoUrl) => handleDelete(videoUrl, "video");
//   const handleAddService = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Add Service!",
//     });
//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch(`${backendUrl}/add-service`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             service_name: newService,
//             existing_services: selectedServices.map((service) => service.id),
//           }),
//         });
//         if (response.ok) {
//           setNewService("");
//           setError("");
//           Swal.fire("Success", "Service added successfully", "success");
//           fetchData();
//         } else {
//           const errorMessage = await response.json();
//           if (
//             errorMessage.error ===
//             "Service entered already exists,please mark from the list provided"
//           ) {
//             setError(errorMessage.error);
//             setNewService("");
//             fetchAllServices();
//             const timer = setTimeout(() => {
//               setError("");
//             }, 5000);
//             return () => clearTimeout(timer);
//           } else {
//             setError(errorMessage.error || "An error occurred");
//           }
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later");
//       }
//     }
//   };

//   const handleDeleteService = async (serviceId) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Delete!",
//     });
//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch(
//           `${backendUrl}/delete-service/${serviceId}`,
//           {
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.ok) {
//           Swal.fire("Success", "Service deleted successfully", "success");
//           fetchData();
//         } else {
//           const errorMessage = await response.json();
//           setError(errorMessage.error || "An error occurred");
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later");
//       }
//     }
//   };

//   const handleCheckboxChange = (service) => {
//     const selectedIndex = selectedServices.findIndex(
//       (s) => s.id === service.id
//     );
//     if (selectedIndex === -1) {
//       setSelectedServices([...selectedServices, service]);
//     } else {
//       setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
//     }
//   };

//   useEffect(() => {
//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownOpen]);

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setDropdownOpen(false);
//     }
//   };

//   const openModal = (media, type) => {
//     if (type === 'image') {
//       setSelectedImage(media);
//       setSelectedVideo(null);
//     } else if (type === 'video') {
//       setSelectedImage(null);
//       setSelectedVideo(media);
//       setIsVideoLoading(true);
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedImage(null);
//     setSelectedVideo(null);
//     setIsVideoLoading(false);
//   };

//   return (
//     <div>
//       <Navbar fluid rounded className="bg-black">
//         <div className="flex md:order-2">
//           <Dropdown
//             arrowIcon={false}
//             inline
//             label={<Avatar alt="pic" img={data.image} rounded />}
//           >
//             <Dropdown.Header>
//               <span className="block text-sm">
//                 {data.first_name} {data.last_name}
//               </span>
//               <span className="block truncate text-sm font-medium">
//                 {data.email}
//               </span>
//             </Dropdown.Header>
//             <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
//             <Dropdown.Divider />
//             <DropdownItem>
//               Jobs Done{" "}
//               <strong className="text-green-700 ml-4">{data.jobs || 0}</strong>
//             </DropdownItem>
//             <Dropdown.Divider />
//             <DropdownItem>
//               Likes{" "}
//               <strong className="text-green-700 ml-4">{data.likes || 0}</strong>
//             </DropdownItem>
//             <Dropdown.Divider />
//             <Dropdown.Item>Chat</Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//           </Dropdown>
//           <Navbar.Toggle />
//         </div>
//         <Navbar.Collapse>
//           <Navbar.Link href="#" active></Navbar.Link>
//           <Navbar.Link href="#"></Navbar.Link>
//           <Navbar.Link href="#"></Navbar.Link>
//           <Navbar.Link href="#"></Navbar.Link>
//           <Navbar.Link href="#"></Navbar.Link>
//         </Navbar.Collapse>
//       </Navbar>
//       <div className="card">
//         <Card className="max-w-xl ">
//           <h2>Hello, {data.first_name} welcome! </h2>
//           <h1 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
//             Services you offer
//           </h1>
//           <div ref={dropdownRef}>
//             {error &&
//               error ===
//                 "Service entered already exists,please mark from the list provided" && (
//                 <div>
//                   <ServiceDropdown
//                     services={allServices}
//                     selectedServices={selectedServices}
//                     handleCheckboxChange={handleCheckboxChange}
//                   />
//                 </div>
//               )}
//           </div>
//           {services.length > 0 ? (
//             <ul className="divide-y divide-gray-200 dark:divide-gray-700 ">
//               {services.map((service) => (
//                 <li
//                   key={service.id}
//                   className="flex justify-between items-center"
//                 >
//                   <span>{service.name}</span>
//                   <button
//                     className="text-red-500"
//                     onClick={() => handleDeleteService(service.id)}
//                   >
//                     <FontAwesomeIcon icon={faTrash} />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-red-500" >No services found</p>
//           )}
//           <div className="serve">
//             <input
//               className="rounded border border-blue-300 p-2"
//               type="text"
//               value={newService}
//               onChange={(e) => setNewService(e.target.value)}
//               placeholder="Add new service"
//             />
//             <button
//               gradientDuoTone="purpleToBlue"
//               className="w-20 ml-10"
//               onClick={handleAddService}
//             >
//               <FontAwesomeIcon className="plus" icon={faSquarePlus} />
//             </button>
//           </div>
//           <p className="text-black">Upload photos or videos of your work</p>
//           <div>
//             <div>
//               <Label htmlFor="file-upload-helper-text" />
//             </div>
//             <FileInput
//               id="file-upload-helper-text"
//               type="file"
//               multiple
//               onChange={handleFileChange}
//               helperText="max 4 photos and 2 videos"
//             />
//             <Button
//               gradientDuoTone="purpleToBlue"
//               className="max-w-20 ml-40 "
//               onClick={handleUpload}
//               disabled={loading}
//             >
//               {loading ? (
//                 <Spinner aria-label="Loading" size="sm" className="mr-2" />
//               ) : (
//                 "Upload"
//               )}
//             </Button>
//           </div>

//           {error && <p className="text-red-500 mt-2">{error}</p>}
//           <div className="image-grid">
//             {photos.length > 0 && (
//               <div>
//                 <h3>Uploaded Photos:</h3>
//                 <div className="grid-container">
//                   {photos.map((photo, index) => (
//                     <div key={index} className="grid-item-container">
//                       <img
//                         key={index}
//                         src={photo}
//                         alt={`Uploaded ${index + 1}`}
//                         className="grid-item"
//                         onClick={() => openModal(photo, 'image')}
//                       />
//                       <button
//                         className="text-red-500 delete-button"
//                         onClick={() => handlePhotoDelete(photo, "photo")}
//                       >
//                         <FontAwesomeIcon icon={faTrash} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {videos.length > 0 && (
//               <div>
//                 <h3>Uploaded Videos:</h3>
//                 <div className="grid-containers">
//                   {videos.map((video, index) => (
//                     <div key={index} className="grid-item-container">
//                       <video
//                         key={index}
//                         controls
//                         className="grid-items"
//                         preload="metadata"
//                         onClick={() => openModal(video, 'video')}
//                       >
//                         <source src={video} type="video/mp4" />
//                         Your browser does not support the video tag.
//                       </video>
//                       <button
//                         className="text-red-500 delete-button"
//                         onClick={() => handleVideoDelete(video, "video")}
//                       >
//                         <FontAwesomeIcon icon={faTrash} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </Card>
//       </div>
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         className="modal"
//         overlayClassName="overlay"
//       >
//         {selectedImage && (
//           <img src={selectedImage} alt="Enlarged" className="modal-image" />
//         )}
//         {selectedVideo && (
//           <>
//             {isVideoLoading && <Spinner aria-label="Loading" size="lg" />}
//             <video
//               controls
//               className="modal-video"
//               onLoadedData={() => setIsVideoLoading(false)}
//               preload="metadata"
//             >
//               <source src={selectedVideo} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default ProviderDashboard;



import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import {
  Avatar,
  Dropdown,
  Navbar,
  Card,
  DropdownItem,
  Button,
  Spinner,
  FileInput,
  Label,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import ServiceDropdown from "./ServiceDropdown";
import "./ProviderDashboard.css";

function ProviderDashboard() {
  const [data, setData] = useState({});
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [error, setError] = useState("");
  const [newService, setNewService] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [chatUser, setChatUser] = useState(null); // For chat
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Upload!",
    });
    if (result.isConfirmed) {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      const imageExtensions = ["png", "jpg", "jpeg", "webp"];

      for (const file of files) {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (imageExtensions.includes(fileExtension)) {
          formData.append("photos", file);
        } else {
          formData.append("videos", file);
        }
      }

      try {
        const response = await fetch(`${backendUrl}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (response.ok) {
          const responseData = await response.json();
          Swal.fire("Success", "Upload successful", "success");
          setPhotos(responseData.photos || []);
          setVideos(responseData.videos || []);
          setError("");
          handleEntry();
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
      setLoading(false);
    }
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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setServices(responseData.services || []);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const fetchAllServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/service`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setAllServices(responseData.all_services || []);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleEntry = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${backendUrl}/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setPhotos(responseData.photos || []);
        setVideos(responseData.videos || []);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error || "An error occurred");
      }
      if (response.status === 422 || response.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
        return;
      }
    } catch (error) {
      setError("An error occurred. Please try again later");
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllServices();
    handleEntry();
  }, [backendUrl]);

  const handleDelete = async (fileUrl, fileType) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete!",
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const fileName = fileUrl.split("/").pop(); 
        const deleteResponse = await fetch(
          `${backendUrl}/delete-upload/${fileType}/${fileName}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (deleteResponse.ok) {
          Swal.fire("Success", "File deleted successfully", "success");
          handleEntry();
        } else {
          const errorMessage = await deleteResponse.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    }
  };

  const handlePhotoDelete = (photoUrl) => handleDelete(photoUrl, "photo");
  const handleVideoDelete = (videoUrl) => handleDelete(videoUrl, "video");
  const handleAddService = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add Service!",
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${backendUrl}/add-service`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            service_name: newService,
            existing_services: selectedServices.map((service) => service.id),
          }),
        });
        if (response.ok) {
          setNewService("");
          setError("");
          Swal.fire("Success", "Service added successfully", "success");
          fetchData();
        } else {
          const errorMessage = await response.json();
          if (
            errorMessage.error ===
            "Service entered already exists,please mark from the list provided"
          ) {
            setError(errorMessage.error);
            setNewService("");
            fetchAllServices();
            const timer = setTimeout(() => {
              setError("");
            }, 5000);
            return () => clearTimeout(timer);
          } else {
            setError(errorMessage.error || "An error occurred");
          }
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete!",
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${backendUrl}/delete-service/${serviceId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          Swal.fire("Success", "Service deleted successfully", "success");
          fetchData();
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    }
  };

  const handleCheckboxChange = (service) => {
    const selectedIndex = selectedServices.findIndex(
      (s) => s.id === service.id
    );
    if (selectedIndex === -1) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const openModal = (media, type) => {
    if (type === 'image') {
      setSelectedImage(media);
      setSelectedVideo(null);
    } else if (type === 'video') {
      setSelectedImage(null);
      setSelectedVideo(media);
      setIsVideoLoading(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedVideo(null);
    setIsVideoLoading(false);
  };

  const handleChatClick = (user) => {
    navigate(`/chat/${data.id}`);
  };

  return (
    <div>
      <Navbar fluid rounded className="bg-black">
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="pic" img={data.image} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {data.first_name} {data.last_name}
              </span>
              <span className="block truncate text-sm font-medium">
                {data.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <DropdownItem>
              Jobs Done{" "}
              <strong className="text-green-700 ml-4">{data.jobs || 0}</strong>
            </DropdownItem>
            <Dropdown.Divider />
            <DropdownItem>
              Likes{" "}
              <strong className="text-green-700 ml-4">{data.likes || 0}</strong>
            </DropdownItem>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleChatClick} >Chat</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="#" active></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <div className="card">
        <Card className="max-w-xl ">
          <h2>Hello, {data.first_name} welcome! </h2>
          <h1 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Services you offer
          </h1>
          <div ref={dropdownRef}>
            {error &&
              error ===
                "Service entered already exists,please mark from the list provided" && (
                <div>
                  <ServiceDropdown
                    services={allServices}
                    selectedServices={selectedServices}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                </div>
              )}
          </div>
          {services.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 ">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="flex justify-between items-center"
                >
                  <span>{service.name}</span>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-400" >No services added</p>
          )}
          <div className="serve">
            <input
              className="rounded border border-blue-300 p-2"
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Add new service"
            />
            <button
              gradientDuoTone="purpleToBlue"
              className="w-20 ml-10"
              onClick={handleAddService}
            >
              <FontAwesomeIcon className="plus" icon={faSquarePlus} />
            </button>
          </div>
          <p className="text-black">Upload photos or videos of your work</p>
          <div>
            <div>
              <Label htmlFor="file-upload-helper-text" />
            </div>
            <FileInput
              id="file-upload-helper-text"
              type="file"
              multiple
              onChange={handleFileChange}
              helperText="max 4 photos and 2 videos"
            />
            <Button
              gradientDuoTone="purpleToBlue"
              className="max-w-20 ml-40 "
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <Spinner aria-label="Loading" size="sm" className="mr-2" />
              ) : (
                "Upload"
              )}
            </Button>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="image-grid">
            {photos.length > 0 && (
              <div>
                <h3>Uploaded Photos:</h3>
                <div className="grid-container">
                  {photos.map((photo, index) => (
                    <div key={index} className="grid-item-container">
                      <img
                        key={index}
                        src={photo}
                        alt={`Uploaded ${index + 1}`}
                        className="grid-item"
                        onClick={() => openModal(photo, 'image')}
                      />
                      <button
                        className="text-red-500 delete-button"
                        onClick={() => handlePhotoDelete(photo, "photo")}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {videos.length > 0 && (
              <div>
                <h3>Uploaded Videos:</h3>
                <div className="grid-containers">
                  {videos.map((video, index) => (
                    <div key={index} className="grid-item-container">
                      <video
                        key={index}
                        controls
                        className="grid-items"
                        preload="metadata"
                        onClick={() => openModal(video, 'video')}
                      >
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <button
                        className="text-red-500 delete-button"
                        onClick={() => handleVideoDelete(video, "video")}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="overlay"
      >
        {selectedImage && (
          <img src={selectedImage} alt="Enlarged" className="modal-image" />
        )}
        {selectedVideo && (
          <>
            {isVideoLoading && <Spinner aria-label="Loading" size="lg" />}
            <video
              controls
              className="modal-video"
              onLoadedData={() => setIsVideoLoading(false)}
              preload="metadata"
            >
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </>
        )}
      </Modal>
    </div>
  );
}

export default ProviderDashboard;
