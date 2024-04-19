import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ProductImageScan = () => {
  const [imageData, setImageData] = useState("");
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterImage, setFilterImage] = useState();
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(1);
  const campaignId = localStorage.getItem("CampaignId");
  const scanType = localStorage.getItem("ScanType");
  const [selectedStage, setselectedStage] = useState("stage-1");
  const [selectedLevel, setselectedLevel] = useState("ImageScan1");
  const [stageId, setStageId] = useState(0);

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
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type === "image/png") {
        setFile(selectedFile);
        setUploadMessage("");
      } else {
        setUploadMessage("Please upload PNG format only.");
        setTimeout(() => setUploadMessage(""), 4000);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleSave = async () => {
    if (!file) {
      alert("Please select a file before saving.");
      return;
    }
    setLoading(true);
    setSaving(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        `http://15.206.198.172/cms/campaign/upload-mind/${campaignId}/${stageId}/${level}/${selectedLevel}/product`,
        // /cms/campaign/upload-mind/:campaign_id/:stage_id/:level/:key:/content_type
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (
        response.data === "Both .mind and image file got uploaded successfully"
      ) {
        setUploadMessage("Image  Uploaded Successfully !!");
        fetchAndFilterImages();
        setTimeout(() => setUploadMessage(""), 7000);
      } else {
        setUploadMessage("Image Updated Successfully !!");
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleStageChange = (e) => {
    setselectedStage(e.target.value);
    setStageId(data?.stages[e.target.value]?.stage_id);
  };

  const handlelevelImageUpload = (e, index) => {
    setImageData(e.target.value);
    setLevel(e.target.selectedIndex + 1);
    setselectedLevel(e.target.value);
  };

  const options = [
    { value: "ImageScan1", level: 1 },
    { value: "ImageScan2", level: 2 },
    { value: "ImageScan3", level: 3 },
    { value: "ImageScan4", level: 4 },
    { value: "ImageScan5", level: 5 },
  ];
  const values = options.map((option) => option.value);
  const orders = options.map((option) => option.level);
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
                <div className="col-10">
                  <h2 className="title text-center">
                    Generate Image to be Scan
                  </h2>
                  <hr />
                  {uploadMessage && (
                    <div
                      className="alert alert-success text-center"
                      style={{ marginTop: "-10px", marginBottom: "-9px" }}
                    >
                      {uploadMessage}
                    </div>
                  )}
                  <div className="imageScan__container"></div>
                  <h6>Select the Stage</h6>
                  <select
                    id="stage"
                    className="form-select"
                    style={{ width: "350px", marginLeft: "20px" }}
                    onChange={(e) => handleStageChange(e)}
                  >
                    {stages.map((stage, index) => (
                      <option key={index} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: "20px" }}>
              <div className="col-6">
                <div
                  style={{
                    border: "1px dotted black",
                    padding: "20px",
                    width: "350px",
                    margin: "auto",
                  }}
                >
                  <div className="mb-2">
                    <h6>Select the images Level wise</h6>
                    <select
                      id="imagedata"
                      className="form-select"
                      value={imageData}
                      onChange={(e, index) => {
                        handlelevelImageUpload(e, index);
                      }}
                    >
                      {values.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e)}
                      disabled={!selectedLevel}
                    />
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
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    marginBottom: "5px",
                    marginTop: "20px",
                  }}
                >
                  {data.mainQR && data.mainQR.key}
                </p>
                <div
                  style={{
                    border: "1px dotted black",
                    padding: "5px",
                    width: "130px",
                    height: "130px",
                    margin: "auto",
                    marginTop: "5px",
                  }}
                  className="mb-2"
                >
                  {data.mainQR && (
                    <>
                      <div style={{ padding: "10px" }}>
                        <img
                          src={data.mainQR.image}
                          alt={data.mainQR.key}
                          style={{ width: "100px", height: "100px" }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-6">
                <div
                  style={{
                    padding: "3px",
                    width: "500px",
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  {data &&
                    data.stages &&
                    Object.keys(data.stages).map((stageKey) => {
                      const stage = data.stages[stageKey];
                      const imageKeys = Object.keys(stage).filter(
                        (imageKey) =>
                          imageKey !== "stage_id" && imageKey !== "campaign_id"
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
export default ProductImageScan;
