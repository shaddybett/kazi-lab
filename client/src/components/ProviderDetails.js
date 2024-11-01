import React, { useEffect, useState, useCallback } from "react";
import { Card, Label, Select, Button, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import "./ProviderDetails.css"; // Assuming we add custom styles here

function ProviderDetails() {
  const [error, setError] = useState("");
  const [phone_number, setNumber] = useState("");
  const [national_id, setN_id] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [counties, setCounties] = useState([]);
  const [county, setCounty] = useState("");
  const [token, setToken] = useState(null);
  const [uuid, setUuid] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUuid = localStorage.getItem("signupUUID");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUuid) {
      setUuid(storedUuid);
    }

    // Fetch geolocation coordinates when the component mounts
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        setError("Could not retrieve location. Please enable location services.");
      }
    );
  }, []);  

  const fetchAllCounties = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/county`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setCounties(responseData.all_counties || []);
      } else {
        setError("Error fetching all counties");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchAllCounties();
  }, [fetchAllCounties]);

  const handleServiceFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const uuid = localStorage.getItem("signupUUID");

      if (!latitude || !longitude) {
        setError("To be easily located by clients, please enable location then refresh the page.");
        setLoading(false);  // Stop the loading spinner
        return;  
      }

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
        // const imageData = await userImageResponse.json();
        // setMessage(imageData.message);
      } else {
        const imageError = await userImageResponse.json();
        setError(imageError.error);
      }

      const formData = new FormData();
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
        localStorage.setItem("userDetailsData", JSON.stringify(userDetailsData));
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
    <div className="provider-details-container flex flex-col items-center justify-center py-10 px-4">
      <Card className=" contain w-full max-w-lg">
        <h1 className="text-xl font-semibold mb-4 text-center ">
          Complete Your Signup
        </h1>
        <form onSubmit={handleServiceFormSubmit} className="space-y-4">
          <div  >
            <Label htmlFor="phone_number" className="text-white" value="Phone Number" />
            <input
              id="phone_number"
              type="text"
              placeholder="0722000000"
              value={phone_number}
              onChange={(e) => setNumber(e.target.value)}
              className="input-field "
            />
          </div>
          <div>
            <Label htmlFor="national_id" className="text-white" value="National ID" />
            <input
              id="national_id"
              type="text"
              placeholder="12345678"
              value={national_id}
              onChange={(e) => setN_id(e.target.value)}
              className="input-field"
            />
          </div>
          <div  >
            <Label htmlFor="file-upload" className="text-white" value={image ? image.name : "Upload Profile Picture"} />
            <input
              id="file-upload"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="input-file border "
            />
          </div>
          <div>
            <Label htmlFor="counties" className="text-white" value="Select County" />
            <Select
              id="counties"
              required
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="input-field"
            >
              <option value="" disabled>
                Select your county
              </option>
              {counties.map((county) => (
                <option key={county.id} value={county.name}>
                  {county.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Spinner aria-label="Loading" size="sm" className="mr-2" /> : "Submit"}
          </Button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {message && <p className="text-green-500 mt-4">{message}</p>}
      </Card>
    </div>
  );
}

export default ProviderDetails;


