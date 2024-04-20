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
      order: 1,
    },
    {
      name: "Progress Bar",
      description: "This indicates the user progress on Stage",
      formats: "PNG, JPG, JPEG",
      order: 2,
    },
    {
      name: "Text Promt After Successful Scan",
      description: "This will pop up when the user successfully scans the image",
      formats: "PNG, JPG, JPEG",
      order: 3,
    },
    {
      name: "Level Completion Thought",
      description: "Character thought after successfully scans",
      formats: "PNG, JPG, JPEG",
      order: 4,
    },
    {
      name: "Level Completion Badge",
      description: "This icon/ image will appear in the stage progress bar",
      formats: "PNG, JPG, JPEG",
      order: 5,
    },
    {
      name: "Time Up Registration",
      description: "Registration on Level completed",
      formats: "PNG, JPG, JPEG",
      order: 6,
    },
    {
      name: "Reward Claim Badge",
      description: "This badge will be shown on the  counters to claim reward",
      formats: "PNG, JPG, JPEG",
      order: 7,
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

  const handleUploadIconClick = (event, item, imageIndex) => {
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

  const handleFileChange = (event, imageIndex) => {
    const file = event.target.files[0];
    const order = imageIndex + 1;
    
    console.log(imageIndex, "This is the image index")

    if (file) {
      setLoading(true);
      const isLevelMap = selectedItem.name === "Level Map";
      const isGif = file.type === "image/gif";

      if (isLevelMap && !isGif) {
        alert("Please upload a GIF file for Level Map.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file)

      const basePageNumber = levelStartIndexes[selectedLevel - 1];
      const contentOffset = contentOffsets[selectedItem.name] || 0;
      const pageNumber = basePageNumber + contentOffset;
      const isImageAvailable = imageData && imageData[imageIndex]?.hasOwnProperty("image");
      console.log(isImageAvailable ? 'upload-gif' : 'update-gif', isImageAvailable)
      let endpoint, url, method;

      if (isLevelMap) {
        endpoint = isImageAvailable ? 'update-gif' : 'upload-gif';
        method = "update-gif" ? 'PUT' : 'POST';
        url = `https://connectopia.co.in/cms/campaign/${endpoint}/${campaignId}/${1}/${file.name.replace(/\s/g, '').slice(0, -4)}/${scanType}/${order}/${1}/level`;
      } else {
        endpoint = isImageAvailable ? 'update-image' : 'upload-image';
        console.log( isImageAvailable ? 'PUT' : 'POST' , "This is inside the endpoint")
        method = isImageAvailable ? 'PUT' : 'POST';
        url = `https://connectopia.co.in/cms/campaign/${endpoint}/${campaignId}/${selectedLevel}/${file.name.replace(/\s/g, '').slice(0, -4)}/${scanType}/${order}/${1}/level`;
      }
      //28. POST: /cms/campaign/upload-image/:campaign_id/:level/:key/:scantype/:order/:stage_number/:content_type      

      fetch(url, {
        method: method,
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
      const response = await fetch(`https://connectopia.co.in/cms/campaign/get-signed-url/no-status/${campaignId}/${scanType}`);
      const data = await response.json();

      console.log("Data: ", data)
      setImageData(data?.level);
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
                      const isImageAvailable = imageData &&
                      imageData[index]?.hasOwnProperty("image");  

                      // console.log("isImageAvailable", isImageAvailable)
                      const imageUrl = imageData && imageData[adjustedIndex];

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
                                onChange={(event) => handleFileChange(event, index)}
                              />
                            ) : (
                              <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={(event) => handleFileChange(event, index)}
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




//LOGIC for stage mapping


// import React, { useState } from "react";
// import "./styles.css";

// export default function App() {
//   let arr = [1, 2, 3, 4, 5];
//   const [selectedDiv, setSelectedDiv] = useState(null);

//   const handleDivClick = (number) => {
//     setSelectedDiv(number);
//   };

//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>Start editing to see some magic happen!</h2>
//       <div className="container" style={{ display: "flex" }}>
//         {arr.map((val) => {
//           return (
//             <div
//               key={val}
//               style={{
//                 color: "red",
//                 width: "100px",
//                 height: "100px",
//                 border: selectedDiv === val ? "2px solid blue" : "none",
//                 cursor: "pointer",
//               }}
//               onClick={() => handleDivClick(val)}
//             >
//               {val}
//             </div>
//           );
//         })}
//       </div>
//       {selectedDiv && <p>Selected: {selectedDiv}</p>}
//     </div>
//   );
// }
