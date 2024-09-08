import React from "react";
import { Modal, Button } from "flowbite-react";
import "./AdminPage.css";

function AdminUsersPopup({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="admin-user-popup">
      <Modal show={true} onClose={onClose}>
        <Modal.Header>{`${user.first_name} ${user.last_name}`}</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center">
            <div className="user-details">
              <div className="details-1">
                <img
                  src={user.image}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="image-dt"
                />
                <h3 className="details-1-name">{`${user.first_name} ${user.last_name}`}</h3>
                <p className="text-black details-1-email ">{user.email}</p>
              </div>
              <div className="details-2">
                <div className="details-2-dt">
                  
                  <p className="text-black">
                    Full Name: {user.first_name} {user.last_name}
                  </p>
                  <p className="text-black">
                    Phone Number: {user.phone_number}
                  </p>
                  <p className="text-black">National ID: {user.national_id}</p>
                  <p className="text-black">Likes: {user.likes || 0}</p>
                  <p className="text-black">Jobs: {user.jobs || 0}</p>
                </div>
              </div>
            </div>
            <div className="media-gallery">
              <h4 className="text-lg font-semibold">Uploaded Photos</h4>
              <div className="photos">
                {user.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`User's upload ${index}`}
                    className="photo"
                  />
                ))}
              </div>
              <h4 className="text-lg font-semibold mt-4">Uploaded Videos</h4>
              <div className="videos">
                {user.videos.map((video, index) => (
                  <div key={index} className="video-thumbnail">
                    <video src={video} controls className="video" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminUsersPopup;
