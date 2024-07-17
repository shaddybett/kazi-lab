import React, { useRef, useState } from "react";
import { Avatar, Button } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import PhoneNumberPopup from "./PhoneNumberPopup";

function UserDetailsPopup({ user, onClose }) {
  const popupRef = useRef();
  const [jobsDone, setJobsDone] = useState(user.jobs || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const assignJob = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${backendUrl}/assign_job/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setJobsDone(data.jobs_done);
      setShowPhonePopup(true);
    } catch (error) {
      setError('Error assigning job');
      console.error('Error assigning job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const namee = user.first_name;
  localStorage.setItem('name', namee);
  const idde = user.id;
  localStorage.setItem("idde", idde);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={popupRef} className="bg-white rounded-lg p-6 w-full max-w-xs md:max-w-sm mx-4 md:mx-0">
        <div className="flex flex-col items-center gap-2 mt-10">
          <Avatar className="mb-10" img={user.image} size="xl" />
          <div className="text-center md:text-left">
            <p className="mb-3 text-black">
              <strong>Name:</strong> {user.first_name} {user.middle_name}{" "}
              {user.last_name}
            </p>
            <div className="flex items-center mb-3">
              <strong>Email:</strong>
              <span className="ml-2">{user.email}</span>
              <a href={`mailto:${user.email}`} className="ml-2 text-blue-500">
                <FontAwesomeIcon icon={faEnvelope} className="ml-10" />
              </a>
            </div>
            <p className="mb-3 text-black">
              Jobs assigned:
              <strong className="text-green-700 ml-2" >{jobsDone || 0}</strong> 
            </p>
            <p className="mb-3 text-black">
            Likes:
              <strong className="text-green-700 ml-2" >{user.likes || 0}</strong> 
            </p>
            <p  className="text-black" >Click the button below to get {user.first_name}'s phone number </p>
            <Button onClick={assignJob} disabled={loading} gradientDuoTone="purpleToBlue" className="ml-20" >
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
          </div>
          <Button onClick={onClose} className="mt-8 mr-8 " outline gradientDuoTone="purpleToBlue">
            Close
          </Button>
        </div>
      </div>
      {showPhonePopup && (
        <PhoneNumberPopup phoneNumber={user.phone_number} onClose={() => setShowPhonePopup(false)} />
      )}
    </div>
  );
}

export default UserDetailsPopup;
