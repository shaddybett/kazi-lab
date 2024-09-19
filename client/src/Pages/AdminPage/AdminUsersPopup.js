import React from "react";
import { Modal, Button, Avatar } from "flowbite-react"; // Ensure Spinner is imported
import "./AdminPage.css";

function AdminUsersPopup({ user, onClose, minimize }) {
  if (!user) return null;

  return (
    <div className="admin-user-popup ">
      <Modal show={true} onClose={onClose}>
        <Modal.Header className="modal-header">
          <i className="fas fa-user-circle"></i>{" "}
          <span className="ml-2">{`${user.first_name} ${user.last_name}`}</span>
        </Modal.Header>

         <Modal.Body>
          <div className="flex flex-col items-center items2 ">
            <div
              className={` ${minimize ? "mini-user-detail" : "user-detail"} ${
                !user.phone_number &&
                !user.national_id &&
                !user.likes &&
                !user.jobs
                  ? "centered"
                  : ""
              }`}
              >
              <div className={`${minimize ? "mini-details-1" : "details-1" }`}>
                <img
                  src={user.image}
                  alt={Avatar}
                  className="image-dt"
                  rounded
                />
                <h3 className="details-1-name">{`${user.first_name} ${user.last_name}`}</h3>
                <p className="text-black details-1-email">{user.email}</p>
              </div>

              {/* Only show the details-2 section if any of the optional fields are present */}
              {(user.phone_number ||
                user.national_id ||
                user.likes ||
                user.jobs) && (
                <div className="details-2">
                  <div className="details-2-dt">
                    {user.phone_number && (
                      <p className="detail-item">
                        <i className="fas fa-phone"></i>
                        <strong>Phone Number:</strong> {user.phone_number}
                      </p>
                    )}
                    {user.national_id && (
                      <p className="detail-item">
                        <i className="fas fa-id-card"></i>
                        <strong>National ID:</strong> {user.national_id}
                      </p>
                    )}
                    {user.likes !== undefined && (
                      <p className="detail-item">
                        <i className="fas fa-thumbs-up"></i>
                        <strong>Likes:</strong> {user.likes || 0}
                      </p>
                    )}
                    {user.jobs !== undefined && (
                      <p className="detail-item">
                        <i className="fas fa-briefcase"></i>
                        <strong>Jobs:</strong> {user.jobs || 0}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="image-grid">
              {user.photos.length > 0 && (
                <>
                  <h4 className="image-section-heading">
                    <i className="fas fa-camera"></i> Uploaded Photos
                  </h4>

                  <div className="grid-container">
                    {user.photos.map((photo, index) => (
                      <div key={index} className="admin-grid-item-container">
                        <img
                          src={photo}
                          alt={`User's uploads ${index + 1}`}
                          className="admin-grid-item"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
              {user.videos.length > 0 && (
                <>
                  <h4 className="admin-video-heading">
                    <i className="fas fa-video"></i> Uploaded Videos
                  </h4>

                  <div className="admin-grid-containers">
                    {user.videos.map((video, index) => (
                      <div key={index} className="admin-grid-item-container">
                        <video
                          src={video}
                          controls
                          className="admin-grid-items"
                          preload="metadata"
                        >
                          <source src={video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
