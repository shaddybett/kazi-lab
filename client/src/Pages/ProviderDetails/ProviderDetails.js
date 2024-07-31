// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "./ProviderDetails.css"; // Import the CSS file

// function ProviderDetails() {
//   const [error, setError] = useState("");
//   const [middle_name, setMiddle] = useState("");
//   const [phone_number, setNumber] = useState("");
//   const [national_id, setN_id] = useState("");
//   const [message, setMessage] = useState("");
//   const [image, setImage] = useState(null);
//   const navigate = useNavigate();
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [manualLocation, setManualLocation] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const [counties, setCounties] = useState([]); // Initialize as empty array
//   const [county, setCounty] = useState(""); // New state for county
//   const backendUrl = process.env.REACT_APP_BACKEND_URL;

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);
//       },
//       (error) => {
//         console.error(error);
//         setManualLocation(true);
//       }
//     );
//   }, []);

//   const fetchAllCounties = async () => {
//     try {
//       const response = await fetch(`${backendUrl}/county`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         console.log("Counties data:", responseData); // Debugging line
//         setCounties(responseData.all_counties || []);
//       } else {
//         setError("Error fetching all counties");
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later.");
//     }
//   };

//   useEffect(() => {
//     // Fetch counties when the component mounts
//     fetchAllCounties();
//   }, []);

//   useEffect(() => {
//     // Add event listener for clicks outside the dropdown when the dropdown is open
//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     // Cleanup function to remove event listener
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownOpen]);

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setDropdownOpen(false);
//     }
//   };

//   const handleServiceFormSubmit = async (e) => {
//     setLoading(true);
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const uuid = localStorage.getItem("signupUUID");

//       // Create FormData for image
//       const formImage = new FormData();
//       formImage.append("image", image);

//       const userImageResponse = await fetch(`${backendUrl}/upload`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formImage,
//       });

//       if (userImageResponse.ok) {
//         const imageData = await userImageResponse.json();
//         setMessage(imageData.message);
//       } else {
//         const imageError = await userImageResponse.json();
//         setError(imageError.error);
//       }

//       // Create FormData for user details
//       const formData = new FormData();
//       formData.append("middle_name", middle_name);
//       formData.append("national_id", national_id);
//       formData.append("phone_number", phone_number);
//       formData.append("uids", uuid);
//       formData.append("latitude", latitude);
//       formData.append("longitude", longitude);
//       formData.append("county", county);

//       const userDetailsResponse = await fetch(`${backendUrl}/signup2`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (userDetailsResponse.ok) {
//         const userDetailsData = await userDetailsResponse.json();
//         localStorage.setItem(
//           "userDetailsData",
//           JSON.stringify(userDetailsData)
//         );
//       } else {
//         const userDetailsErrors = await userDetailsResponse.json();
//         setError(userDetailsErrors.error);
//       }

//       if (userDetailsResponse.ok && userImageResponse.ok) {
//         setMessage("User details registered successfully");
//         navigate("/providerPage");
//       }
//     } catch (error) {
//       setError(error.message || "An error occurred. Please try again later.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="provider-details-container">
//       <h1>Service Provider</h1>
//       <p>
//         Please complete your registration by filling in the form below in order
//         to start.
//       </p>
//       <form
//         onSubmit={handleServiceFormSubmit}
//         className="provider-details-form"
//       >
//         <div className="form-row">
//           <input
//             type="text"
//             placeholder="ID Number"
//             value={national_id}
//             onChange={(e) => setN_id(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Phone number"
//             value={phone_number}
//             onChange={(e) => setNumber(e.target.value)}
//           />
//         </div>
//         <div className="form-row">
//           <input
//             type="text"
//             placeholder="Middle name"
//             value={middle_name}
//             onChange={(e) => setMiddle(e.target.value)}
//           />
//           <select
//             id="counties"
//             required
//             value={county}
//             onChange={(e) => setCounty(e.target.value)}
//             className="text-black"
//           >
//             <option value="" disabled>
//               Location
//             </option>
//             {counties.map((county) => (
//               <option key={county.id} value={county.name}>
//                 {county.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="upload-section">
//           <label htmlFor="file-upload" className="upload-label">
//             {image ? image.name : "Upload File"}
//           </label>
//           <input
//             id="file-upload"
//             type="file"
//             onChange={(e) => setImage(e.target.files[0])}
//           />
//         </div>
//         <button type="submit" disabled={loading} className="get-started-button">
//           {loading ? "Loading..." : "Get Started"}
//         </button>
//       </form>
//       {error && <p className="error-text">{error}</p>}
//       {message && <p className="success-text">{message}</p>}
//     </div>
//   );
// }

// export default ProviderDetails;
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProviderDetails.css"; // Import the CSS file

function ProviderDetails() {
  const [error, setError] = useState("");
  const [middle_name, setMiddle] = useState("");
  const [phone_number, setNumber] = useState("");
  const [national_id, setN_id] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [manualLocation, setManualLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [counties, setCounties] = useState([]); // Initialize as empty array
  const [county, setCounty] = useState(""); // New state for county
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        setManualLocation(true);
      }
    );
  }, []);

  const fetchAllCounties = async () => {
    try {
      const response = await fetch(`${backendUrl}/county`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Counties data:", responseData); // Debugging line
        setCounties(responseData.all_counties || []);
      } else {
        setError("Error fetching all counties");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    // Fetch counties when the component mounts
    fetchAllCounties();
  }, []);

  useEffect(() => {
    // Add event listener for clicks outside the dropdown when the dropdown is open
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleServiceFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const uuid = localStorage.getItem("signupUUID");

      // Create FormData for image
      const formImage = new FormData();
      formImage.append("image", image);

      const userImageResponse = await fetch(`${backendUrl}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formImage,
      });

      if (userImageResponse.ok) {
        const imageData = await userImageResponse.json();
        setMessage(imageData.message);
      } else {
        const imageError = await userImageResponse.json();
        setError(imageError.error);
      }

      // Create FormData for user details
      const formData = new FormData();
      formData.append("middle_name", middle_name);
      formData.append("national_id", national_id);
      formData.append("phone_number", phone_number);
      formData.append("uids", uuid);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("county", county);

      const userDetailsResponse = await fetch(`${backendUrl}/signup2`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (userDetailsResponse.ok) {
        const userDetailsData = await userDetailsResponse.json();
        localStorage.setItem(
          "userDetailsData",
          JSON.stringify(userDetailsData)
        );
      } else {
        const userDetailsErrors = await userDetailsResponse.json();
        setError(userDetailsErrors.error);
      }

      if (userDetailsResponse.ok && userImageResponse.ok) {
        setMessage("User details registered successfully");
        navigate("/providerPage");
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="provider-details-container">
      <h1>Service Provider</h1>
      <p>
        Please complete your registration by filling in the form below in order
        to start.
      </p>
      <form onSubmit={handleServiceFormSubmit} className="form">
        <div className="input-group">
          <input
            type="text"
            placeholder="ID Number"
            value={national_id}
            onChange={(e) => setN_id(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Phone number"
            value={phone_number}
            onChange={(e) => setNumber(e.target.value)}
            className="input"
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Middle name"
            value={middle_name}
            onChange={(e) => setMiddle(e.target.value)}
            className="input"
          />
          <select
            id="counties"
            required
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="input"
          >
            <option value="" disabled>
              Location
            </option>
            {counties.map((county) => (
              <option key={county.id} value={county.name}>
                {county.name}
              </option>
            ))}
          </select>
        </div>
        <div className="file-upload">
          <label htmlFor="file-upload" className="file-upload-label">
            {image ? image.name : "Upload File"}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="file-input"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Loading..." : "Get Started"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default ProviderDetails;
