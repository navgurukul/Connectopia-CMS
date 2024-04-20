import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ProductRandomSequence = () => {
  const [imageData, setImageData] = useState("");
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const campaignId = localStorage.getItem("CampaignId");
  const scanType = localStorage.getItem("ScanType");
  const [selectedStage, setselectedStage] = useState("stage-1");
  const [productMainQR, setProductMainQR] = useState({});
  const [stageId, setStageId] = useState(0);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [stages, setStages] = useState([]);

  useEffect(() => {
    fetchAndFilterImages();
  }, []);

  async function fetchAndFilterImages() {
    const url = `http://15.206.198.172/cms/campaign/general-product/${campaignId}/${scanType}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      data && setData(data.product);
      data && setStageId(data.product.stages[selectedStage].stage_id);
      setStages(Object.keys(data.product.stages));
      setProductMainQR(data.product);
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files.length !== 5) {
      alert("Please select exactly 5 files.");
      return;
    }
    const files = Array.from(e.target.files);
    const nonPngFiles = files.some((file) => file.type !== "image/png");

    if (nonPngFiles) {
      setUploadMessage("Please upload PNG format only.");
      setTimeout(() => setUploadMessage(""), 4000);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setFile(files);
      setUploadMessage("");
      setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSave = async () => {
    if (!file || file.length === 0) {
      alert("Please select a file before saving.");
      return;
    }
    setLoading(true);
    setSaving(true);
    const formData = new FormData();

    for (let i = 0; i < file.length; i++) {
      formData.append("image", file[i]);
    }

    try {
      const response = await axios.post(
        `http://15.206.198.172/cms/campaign/upload-bulk/${campaignId}/${stageId}/product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (
        response.data === "Both.mind and image file got uploaded successfully"
      ) {
        setUploadMessage("Image  Uploaded Successfully !!");
        fetchAndFilterImages();
        setTimeout(() => setUploadMessage(""), 7000);
      } else {
        setUploadMessage("Image  Updated Successfully !!");
        fetchAndFilterImages();
        setTimeout(() => setUploadMessage(""), 7000);
      }
    } catch (error) {
      console.error("Error uploading file: ", error);
    } finally {
      setSaving(false);
      setLoading(false);
      setImageData("");
      setFile(null);
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const handleStageChange = (e) => {
    setselectedStage(e.target.value);
    setStageId(data?.stages[e.target.value]?.stage_id);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="shadowbox">
            <div className="shadowbox-head">
              <div className="row">
                <div className="col-1">
                  <div className="text-begin">
                    <ul className="list-inline"></ul>
                  </div>
                </div>
                <div
                  className="col-10"
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <h2 className="title text-center">
                    Add images for Random Scanning
                  </h2>
                  <div>
                  <div
                    style={{
                      border: "1px dotted black",
                      padding: "5px",
                      width: "110px",
                      height: "110px",
                      margin: "auto",
                    }}
                  >
                    
                    {productMainQR.mainQR && (
                      <>
                  
                        <div style={{ padding: "10px" }}>
                          <img
                            src={productMainQR.mainQR.image}
                            alt={productMainQR.mainQR.key}
                            style={{ width: "80px", height: "80px" }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <h5>Main QR code</h5>
                  </div>
                  <hr />
                  {uploadMessage && (
                    <div
                      className="alert alert-success text-center"
                      style={{ marginTop: "-10px", marginBottom: "-10px" }}
                    >
                      {uploadMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
           < hr/>
            <div
              className="row align-items-start"
              style={{ marginTop: "20px" }}
            >
              <div className="col-6">
                <div
                  style={{
                    // border: "1px dotted black",
                    padding: "5px",
                    width: "350px",
                    margin: "auto",
                  }}
                >
                  <div className="mb-2">
                    <div className="imageScan__container"></div>
                    <h6>Select the Stage</h6>
                    <select
                      id="stage"
                      className="form-select"
                      style={{ width: "350px"}}
                      onChange={(e) => handleStageChange(e)}
                    >
                      {stages.map((stage, index) => (
                        <option key={index} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                    <div className="input-section" style={{margin:"1rem 0"}}>
                      <h6>Select 5 images</h6>
                      <div
                        style={{ width: "330px", border: "1px solid black" }}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          multiple
                        />
                      </div>
                    </div>
                    <div
                      className={`image-preview-container ${
                        previewUrls.length > 0 ? "has-images" : ""
                      }` }
                    >
                      {previewUrls.map((url, index) => (
                        <div key={index} className="image-preview-item">
                          <img
                            src={url}
                            alt="Preview"
                            style={{ width: "70px", height: "70px" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "25px", marginLeft: "100px" }}
                    onClick={handleSave}
                  >
                    {saving ? "Training..." : "Save Image"}
                  </button>

                  {loading && (
                    <div style={{ marginTop: "15px" }}>
                      <div
                        className="loading-bar"
                        style={{ width: "100%" }}
                      ></div>
                      <p>
                        Please wait as the image is being trained, this might
                        take some time.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-6">
                <div
                  style={{
                    padding: "3px",
                    width: "500px",
                    maxHeight: "370px",
                    overflowY: "auto",
                  }}
                >
                  {data &&
                    data.stages &&
                    Object.keys(data.stages).map((stageKey) => {
                      const stage = data.stages[stageKey];
                      const imageKeys = Object.keys(stage).filter(
                        (imageKey) =>
                          imageKey !== "stage_id" &&
                          imageKey !== "campaign_id" &&
                          imageKey !== "mind"
                      );
                      return (
                        <>
                          <p>{stageKey}</p>
                          <table
                            className="table"
                            style={{ border: "1px dotted black" }}
                          >
                            <thead>
                              <tr>
                                <th className="text-center">Title</th>
                                <th className="text-center">Image Scanner</th>
                              </tr>
                            </thead>
                            <tbody>
                              {imageKeys.length > 0 ? (
                                imageKeys.map((imageKey, index) => {
                                  const image = stage[imageKey];
                                  if (Object.keys(image).length === 0) {
                                    return (
                                      <tr key={index}>
                                        <td colSpan="2" className="text-center">
                                          No images available
                                        </td>
                                      </tr>
                                    );
                                  }
                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        {image.key}
                                      </td>
                                      <td className="text-center">
                                        <a
                                          href={image.image}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <img
                                            src={image.image}
                                            alt={image.key}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                            }}
                                          />
                                        </a>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="2" className="text-center">
                                    No images available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductRandomSequence;
