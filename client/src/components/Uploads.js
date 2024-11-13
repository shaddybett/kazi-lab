import React, { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Spinner, FileInput } from "flowbite-react";
import Swal from "sweetalert2";
import "./ProviderDashboard.css";

function Uploads({ minimized }) {
  const [files, setFiles] = useState([]);
  const [data, setData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };
  const handleEntry = useCallback(async () => {
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
  }, [backendUrl]);

  useEffect(() => {
    handleEntry();
  }, [handleEntry]);

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
        console.log('filefilefiletype',fileType)
        console.log('fileName',fileName)
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
  return (
    <div className="mt-6 w-full flex justify-center">
      <div className={ minimized ? "" : "uploads-card bg-gray-900 text-white shadow-lg rounded-lg p-8 w-full max-w-2xl"}>
        <div>
          <p className="mb-2 text-center">
            Upload photos or videos of your work
          </p>
          <FileInput
            id="file-upload-helper-text"
            type="file"
            multiple
            onChange={handleFileChange}
            className="mb-4 w-full file-input"
          />
          <button
            className={`upload-btn ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <Spinner aria-label="Loading" size="sm" className="mr-2" />
            ) : (
              "Upload"
            )}
          </button>
          <p className="text-xs text-center mt-2">Max 4 photos and 2 videos</p>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="media-grid ">
          {photos.length > 0 && (
            <div>
              <h4 className={minimized ? "section-heading" : "section-heading" }>
                <i className="fas fa-camera"></i> Uploaded Photos
              </h4>
              <div className={minimized ? "mini-photos-grid" : "photos-grid"}>
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className={
                      minimized
                        ? "mini-grid-item-container"
                        : "grid-item-container"
                    }
                  >
                    <img
                      src={photo}
                      alt={`Uploaded ${index + 1}`}
                      className="grid-ite"
                    />
                    <button onClick={() => handlePhotoDelete(photo)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div className="mt-6">
              <h4 className={minimized ? "video-heading" : "video-heading" }>
                <i className="fas fa-video"></i> Uploaded Videos
              </h4>
              <div className="videos-grid">
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className={
                      minimized
                        ? "mini-grid-video-container"
                        : "grid-video-container"
                    }
                  >
                    <video
                      controls
                      className="grid-video-item"
                      preload="metadata"
                    >
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button onClick={() => handleVideoDelete(video)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Uploads;
