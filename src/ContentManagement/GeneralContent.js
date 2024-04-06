import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEye,
  faPen,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import "./ContentManagement.css";

export function GeneralContent() {
  const contentData = [
    {
      name: "Background",
      description: "Background is common throughout",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "Welcome Screen",
      description: "Background is common throughout",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "Instructions Screen",
      description: "A banner that explains how to play the quest.",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "Privacy Policy Screen",
      description: "A banner that informs about the privacy policies",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "Time up - wooden plank",
      description: " Time to complete the game",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "sky Background",
      description: "Common for level Map",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "Registration Screen",
      description: "User Registration",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "Progress Bar",
      description: "Progess Bar appears in the start",
      formats: "PNG, JPG, JPEG",
    },
  ];

  const [imageData, setImageData] = useState({});

  const [currentUpload, setCurrentUpload] = useState({
    item: null,
    index: null,
  });
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const campaignId = localStorage.getItem("CampaignId");
  const scanType = localStorage.getItem("ScanType");

  // console.log("campaignId", campaignId);
  // console.log("scanType", scanType);
  const handleUploadIconClick = (event, item, index) => {
    setCurrentUpload({ item, index });

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    return () => {
      setCurrentUpload({ item: null, index: null });
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const { item, index } = currentUpload;

    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const pageNumber = index + 1;
      const contentName = item.name;

      console.log("contentName",contentName);

      const isImageAvailable = imageData.hasOwnProperty((index + 1).toString());

      const endpoint = isImageAvailable ? "updateimage" : "uploadimage";
      const url = `http://15.206.198.172/${endpoint}/${campaignId}/${pageNumber}/${contentName}/${scanType}`;

      // /cms/campaign/upload-image/:campaign_id/:level/:key/:scantype/:order/:stage_number/:content_type   
      const urls = `http://15.206.198.172/cms/campaign/upload-image/${campaignId}/${pageNumber}/${contentName}/${scanType}/1/1/general`;

      fetch(urls, {
        method: "POST",
        body: formData,
      })
        .then((response) =>
        console.log("----kkkkkkk", response),
          // response.ok ? response.text() : Promise.reject(response)
        )
        .then((data) => {
          fetchData();
          setLoading(false);
          setUploadMessage("Image Uploaded Successfully !!");
          setTimeout(() => setUploadMessage(""), 7000);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
          setUploadMessage("Image Upload Failed !!");
          setTimeout(() => setUploadMessage(""), 7000);
        });
    } else {
      setLoading(false);
    }
  };

  const handleDownloadClick = (imageUrl) => {
    const imagess = imageUrl[0].value;
    // setQrCodeUrl(imageUrl);
    const a = document.createElement("a");
    a.href = imagess;
    a.download = "downloaded_image.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        // `http://15.206.198.172/withoutStatus/allsignedurls/${campaignId}/${scanType}`
        `http://15.206.198.172/cms/campaign/get-signed-url/no-status/${campaignId}/${scanType}`
      );

      const data = await response.json();
      console.log("dikha_ab", data);

      setImageData(data);
    } catch (error) {
      console.error("An error occurred while fetching the data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaignId, scanType]);

  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreviewClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  return (
    <div className="container style={{ marginTop: '50px' }}">
      <div className="row text-center">
        <div className="shadowbox">
          <div className="shadowbox-body">
            <div className="col-12">
              {uploadMessage && (
                <div className="alert alert-success text-center">
                  {uploadMessage}
                </div>
              )}

              <div className="table-container">
                {loading && (
                  <div>
                    <div
                      className="loading-bar"
                      style={{ width: "100%", marginBottom: "5px" }}
                    ></div>
                  </div>
                )}

                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Content name</th>
                      <th>Description</th>
                      <th>Acceptable formats</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentData.map((item, index) => {
                      const adjustedIndex = (index + 1).toString();
                      const isImageAvailable =
                        imageData.hasOwnProperty(adjustedIndex);
                      const imageUrl = imageData[adjustedIndex];
                      return (
                        <tr key={index}>
                          <td>
                            <strong>{item.name}</strong>
                          </td>
                          <td>{item.description}</td>
                          <td>{item.formats}</td>
                          <td style={{ width: "110px" }}>
                            <FontAwesomeIcon
                              className="icon-styles"
                              icon={!isImageAvailable ? faUpload : faPen}
                              onClick={(event) =>
                                handleUploadIconClick(event, item, index)
                              }
                              style={{
                                cursor: "pointer",
                                color: isImageAvailable ? "green" : null,
                              }}
                            />
                            {isImageAvailable && (
                              <FontAwesomeIcon
                                icon={faDownload}
                                className="icon-styles"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDownloadClick(imageUrl)}
                              />
                            )}
                            {isImageAvailable && (
                              <FontAwesomeIcon
                                className="icon-styles"
                                icon={faEye}
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handlePreviewClick(imageUrl[0].value)
                                }
                              />
                            )}
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPreview && (
        <div className="modal modalStyles">
          <div className="modal-content modalContentStyles">
            <button className="close-button12" onClick={closePreview}>
              <span className="big-close-button12">&times;</span>
            </button>
            <img src={previewImage} alt="Preview" className="imageStyles" />
          </div>
        </div>
      )}
    </div>
  );
}
