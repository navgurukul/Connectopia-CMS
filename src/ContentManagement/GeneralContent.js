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
      order: 1,
    },
    {
      name: "Welcome Screen",
      description: "Welcome screen for the user to start the quest.",
      formats: "PNG, JPG, JPEG",
      order: 2,
    },
    {
      name: "Instructions Screen",
      description: "A banner that explains how to play the quest.",
      formats: "PNG, JPG, JPEG",
      order: 3,
    },
    {
      name: "Privacy Policy Screen",
      description: "A banner that informs about the privacy policies",
      formats: "PNG, JPG, JPEG",
      order: 4,
    },
    {
      name: "Time up - wooden plank",
      description: " Time to complete the game",
      formats: "PNG, JPG, JPEG",
      order: 5,
    },
    {
      name: "sky Background",
      description: "Common for level Map",
      formats: "PNG, JPG, JPEG",
      order: 6,
    },
    {
      name: "Registration Screen",
      description: "User Registration",
      formats: "PNG, JPG, JPEG",
      order: 7,
    },
    {
      name: "Progress Bar",
      description: "Progess Bar appears in the start",
      formats: "PNG, JPG, JPEG",
      order: 8,
    },
    {
      name: "Button",
      description: "Button to start the game",
      formats: "PNG, JPG, JPEG",
      order: 9,
    },
  ];

  const [imageData, setImageData] = useState({});

  const fileInputRefs = contentData.map(() => React.createRef());

  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const campaignId = localStorage.getItem("CampaignId");
  const scanType = localStorage.getItem("ScanType");

  const handleUploadIconClick = (event, item, index, isImageAvailable) => {
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = "";
      fileInputRefs[index].current.click();
    }
  };

  const handleFileChange = (event, order, isImageAvailable, contentId) => {
    const file = event.target.files[0];
    console.log(contentId, "Item");
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      let key = file?.name.slice(0, -4);
      console.log("key", key);

      let API_DATA = {
        url: "",
        method: "",
      };
      isImageAvailable
        ? (API_DATA = {
            url: `https://connectopia.co.in/cms/campaign/update-image/${contentId}/general`,
            method: "PUT",
          })
        : (API_DATA = {
            url: `https://connectopia.co.in/cms/campaign/upload-image/${campaignId}/${order}/general?key=${key}&level=0&stage_id=0`,
            method: "POST",
          });

      fetch(API_DATA.url, {
        method: API_DATA.method,
        body: formData,
      })
        .then((response) => {
          console.log(response, "API response");
        })
        .then((data) => {
          fetchData();
          setTimeout(() => {
            fetchData();
          }, 8000);

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
        `https://connectopia.co.in/cms/campaign/general-product/${campaignId}/${scanType}`
      );

      const data = await response?.json();

      setImageData(data?.general);
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
    console.log("imageUrl", imageUrl);
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
                    {contentData?.map((item, index) => {
                      const adjustedIndex = (index + 1)?.toString();
                      const isImageAvailable =
                        imageData &&
                        imageData[item.order]?.hasOwnProperty("image");
                      const contentId = imageData && imageData[item.order]?.id;
                      // if(imageData ){
                      //   console.log("imageData", imageData[item.order]);
                      // }

                      // console.log("isImageAvailable", imageData);
                      const imageUrl =
                        imageData && imageData[item.order]?.image;
                      console.log("imageUrl", imageUrl, item.order);
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
                                handleUploadIconClick(
                                  event,
                                  item,
                                  index,
                                  isImageAvailable
                                )
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
                                onClick={() =>
                                  handleDownloadClick(imageUrl, item.order)
                                }
                              />
                            )}
                            {isImageAvailable && (
                              <FontAwesomeIcon
                                className="icon-styles"
                                icon={faEye}
                                style={{ cursor: "pointer" }}
                                onClick={() => handlePreviewClick(imageUrl)}
                              />
                            )}
                            <input
                              type="file"
                              ref={fileInputRefs[index]}
                              style={{ display: "none" }}
                              onChange={(event) =>
                                handleFileChange(
                                  event,
                                  item.order,
                                  isImageAvailable,
                                  contentId
                                )
                              }
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
