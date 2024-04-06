import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEye, faPen, faUpload } from "@fortawesome/free-solid-svg-icons";

export function LevelContent() {
  const LevelData = [
    {
      name: "Level Map",
      description: "This indicates the user progress on a level map",
      formats: "GIF",
    },
    {
      name: "Progress Bar",
      description: "This indicates the user progress on Stage",
      formats: "PNG, JPG, JPEG",

    },
    {
      name: "Text Promt After Successful Scan",
      description: "This will pop up when the user successfully scans the image",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "Level Completion Thought",
      description: "Character thought after successfully scans",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "Level Completion Badge",
      description: "This icon/ image will appear in the stage progress bar",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "Time Up Registration",
      description: "Registration on Level completed",
      formats: "PNG, JPG, JPEG",
    },
    {
      name: "Reward Claim Badge",
      description: "This badge will be shown on the  counters to claim reward",
      formats: "PNG, JPG, JPEG",
    },
  ];

  const contentOffsets = {
    "Level Map": 1,
    "Progress Bar": 2,
    "Text Promt After Successful Scan": 3,
    "Level Completion Thought": 4,
    "Level Completion Badge": 5,
    "Time Up Registration": 6,
    "Reward Claim Badge": 7
  };

  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imageData, setImageData] = useState({});
  const fileInputRef = useRef(null);
  const levelStartIndexes = [20, 40, 60, 80, 100];
  const gifInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const campaignId = localStorage.getItem('CampaignId');
  const scanType = localStorage.getItem('ScanType');

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
  };

  const handleUploadIconClick = (event, item, index) => {
    setSelectedItem(item);

    if (item.name === "Level Map") {
      if (gifInputRef.current) {
        gifInputRef.current.value = "";
        gifInputRef.current.click();
      }
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setLoading(true);
      const isLevelMap = selectedItem.name === "Level Map";
      const isGif = file.type === "image/gif";

      if (isLevelMap && !isGif) {
        alert("Please upload a GIF file for Level Map.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const basePageNumber = levelStartIndexes[selectedLevel - 1];
      const contentOffset = contentOffsets[selectedItem.name] || 0;
      const pageNumber = basePageNumber + contentOffset;

      const isImageAvailable = imageData.hasOwnProperty(pageNumber.toString());

      let endpoint, url;

      if (isLevelMap) {
        endpoint = isImageAvailable ? 'updategif' : 'uploadgif';
        url = `http://15.206.198.172/${endpoint}/${campaignId}/${pageNumber}/${selectedItem.name}/${scanType}`;
      } else {
        endpoint = isImageAvailable ? 'updateimage' : 'uploadimage';
        url = `http://15.206.198.172/${endpoint}/${campaignId}/${pageNumber}/${selectedItem.name}/${scanType}`;
      }

      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.ok ? response.text() : Promise.reject(response))
        .then(data => {
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

  const fetchData = async () => {
    try {
      // const response = await fetch(`http://15.206.198.172/withoutStatus/allsignedurls/${campaignId}/${scanType}`);
      const response = await fetch(`http://15.206.198.172/cms/campaign/get-signed-url/no-status/${campaignId}/${scanType}`);
      const data = await response.json();

      setImageData(data);
    } catch (error) {
      console.error("An error occurred while fetching the data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaignId, scanType]);

  const handleDownloadClick = (imageUrl) => {
    const imagess = imageUrl[0].value;
    // setQrCodeUrl(imageUrl);
    const a = document.createElement('a');
    a.href = imagess;
    a.download = 'downloaded_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const handlePreviewClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  return (
    <div className="container">
      <div className="row text-center">
        <div className="shadowbox">
          <div className="shadowbox-body">
            <div style={{ textAlign: "start" }}><h6><strong>Select the Stage</strong></h6></div>
            <div style={{ textAlign: "start", marginBottom: "10px", marginTop: "10px" }}>
              {[1, 2, 3, 4, 5].map((num, index) => (
                <button
                  key={num}
                  onClick={() => handleLevelClick(num)}
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    margin: "5px",
                    backgroundColor: selectedLevel === num ? "green" : "gray",
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="col-12">

              {uploadMessage && (
                <div className="alert alert-success text-center" style={{ marginTop: '-10px', marginBottom: '-10px', paddingTop: '6px', paddingBottom: '6px' }}>
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

                <table className="custom-table" style={{ marginTop: '20px' }}>
                  <thead>
                    <tr>
                      <th>Content name</th>
                      <th>Description</th>
                      <th>Acceptable formats</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LevelData.map((item, index) => {
                      const basePageNumber = levelStartIndexes[selectedLevel - 1];
                      const contentOffset = contentOffsets[item.name] || 0;
                      const pageNumber = basePageNumber + contentOffset;
                      const adjustedIndex = pageNumber.toString();
                      const isImageAvailable = imageData.hasOwnProperty(adjustedIndex);

                      const imageUrl = imageData[adjustedIndex];

                      return (
                        <tr key={index}>
                          <td style={{ padding: '6px' }}>
                            <strong>{item.name}</strong>
                          </td>
                          <td style={{ padding: '6px' }}>{item.description}</td>
                          <td style={{ padding: '6px' }}>{item.formats}</td>
                          <td style={{ width: '110px', padding: '6px' }}>
                            <FontAwesomeIcon
                              className="icon-styles"
                              icon={!isImageAvailable ? faUpload : faPen}
                              onClick={(event) => handleUploadIconClick(event, item, index)}
                              style={{
                                cursor: 'pointer',
                                color: isImageAvailable ? 'green' : null
                              }}
                            />
                            {isImageAvailable && (
                              <FontAwesomeIcon
                                className="icon-styles"
                                icon={faDownload}
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
                                onClick={() => handlePreviewClick(imageUrl[0].value)}
                              />
                            )}
                            {item.name === "Level Map" ? (
                              <input
                                type="file"
                                accept=".gif"
                                ref={gifInputRef}
                                style={{ display: "none" }}
                                onChange={(event) => handleFileChange(event)}
                              />
                            ) : (
                              <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={(event) => handleFileChange(event)}
                              />
                            )}
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

