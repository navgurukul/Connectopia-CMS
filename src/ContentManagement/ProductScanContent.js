import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode.react";
import axios from "axios";

export const ProductScanContent = () => {
  const [qrData, setQrData] = useState("");
  const [fetchData, setFetchData] = useState("");
  const [generateQR, setGenerateQR] = useState(false);
  const qrRef = useRef();
  const [data, setData] = useState("");
  const [productData, setProductData] = useState([]);
  const [uploadedQRs, setUploadedQRs] = useState([]);
  const campaignId = localStorage.getItem("CampaignId");
  const scanType = localStorage.getItem("ScanType");
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [qrLevel, setQrLevel] = useState(null);

  useEffect(() => {
    QRDATA();
  }, []);

  const downloadQRCode = async () => {
    if (data) {
      setGenerateQR(true);
    }
    const canvas = qrRef.current.querySelector("canvas");
    const imageData = canvas.toDataURL("image/png");
    if (canvas) {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "QRCode.png";
      a.click();
    }
    const imageBlob = dataURLtoBlob(imageData);
    const formData = new FormData();
    formData.append("image", imageBlob);

    const apiUrl = `http://15.206.198.172/cms/campaign/upload-image/${campaignId}/${qrLevel}/product?level=${qrLevel}&stage_id=${selectedStageId}&key=${encodeURIComponent(
      qrData
    )}`;

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error uploading image:", error.message);
    } finally {
      setData("");
      QRDATA();
      setQrData("");
    }
  };

  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  
  const QRDATA = async () => {
    try {
      const response = await fetch(
        `http://15.206.198.172/cms/campaign/general-product/${campaignId}/${scanType}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStages(data.product.stages);
      const stagesArray = Object.values(data.product.stages);
      setProductData(stagesArray);
      setFetchData(data[0]);
      const uploaded = data[0].map((qr) => qr.key.split(".")[0]);
      setUploadedQRs(uploaded);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelectChange = (e) => {
    setSelectedStage(e.target.value);
    const selectedStageData = stages[e.target.value];
    if (selectedStageData) {
      setSelectedStageId(selectedStageData.stage_id);
    }
  };

  const generateQRCode = () => {
    if (qrData.trim()) {
      setGenerateQR(true);
    } else {
      alert("Please enter data to generate QR Code.");
    }
  };

  const options = [
    { value: "QR 1", label: "QR Code 1", level: 1 },
    { value: "QR 2", label: "QR Code 2", level: 2 },
    { value: "QR 3", label: "QR Code 3", level: 3 },
    { value: "QR 4", label: "QR Code 4", level: 4 },
    { value: "QR 5", label: "QR Code 5", level: 5 },
  ];

  const handleSelectOptionChange = (e) => {
    setQrData(e.target.value);
    const selectedOption = options?.find(
      (option) => option.value === e.target.value
    );
    if (selectedOption) {
      setQrLevel(selectedOption.level);
    }
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
                <div className="col-10">
                  <h2 className="title  text-center">
                    {" "}
                    Generate QR-Codes to be Scan
                  </h2>
                  <hr />
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: "20px" }}>
              <div className="col-6">
                {/* <h6 style={{ marginLeft: "10px" }}>Select the Stage</h6> */}

                <select
                  className="form-select"
                  style={{ width: "350px", margin: "auto" }}
                  value={selectedStage}
                  onChange={handleSelectChange}
                >
                  <option value="">Select a stage</option>
                  {Object.keys(stages)
                    .filter((stageKey) => stageKey !== "total_stages")
                    .map((stageKey) => (
                      <option key={stageKey} value={stageKey}>
                        {stageKey}
                      </option>
                    ))}
                </select>

                <div
                  style={{
                    border: "1px dotted black",
                    padding: "20px",
                    width: "350px",
                    margin: "auto ",
                    marginTop: "25px",
                  }}
                >
                  <div className="mb-2">
                    <select
                      id="qrdata"
                      className="form-select"
                      value={qrData}
                      onChange={handleSelectOptionChange}
                    >
                      <option value="">Select QR</option>
                      {options?.map((option, index) => (
                        <option
                          key={index}
                          value={option.value}
                          disabled={uploadedQRs.includes(option.value)}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <button
                    type="button"
                    onClick={generateQRCode}
                    className="btn btn-primary"
                    style={{ marginLeft: "60px" }}
                  >
                    Generate QR Code
                  </button>
                  <br />
                  {generateQR && (
                    <button
                      type="button"
                      onClick={downloadQRCode}
                      className="btn btn-secondary"
                      style={{ marginLeft: "60px", marginTop: "8px" }}
                    >
                      Download QR Code
                    </button>
                  )}
                  <div
                    ref={qrRef}
                    style={{ marginTop: "20px", marginLeft: "60px" }}
                  >
                    {generateQR && qrData && (
                      <QRCode value={qrData} size={160} level={"H"} />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-6 ">
                <div
                  style={{
                    padding: "5px",
                    width: "500px",
                    marginLeft: "-50px",
                  }}
                >
                  <div style={{ maxHeight: "580px", overflowY: "auto" }}>
                    {productData.map((stage, stageIndex) => (
                      <div key={stageIndex}>
                        <h2>Stage {stageIndex + 1}</h2>
                        <table
                          style={{ border: "1px dotted black" }}
                          className="table"
                        >
                          <thead>
                            <tr>
                              <th className="text-center">Title</th>
                              <th className="text-center">Uploaded QR codes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.values(stage).map((item, index) => {
                              if (item.key) {
                                return (
                                  <tr key={item.key}>
                                    <td className="text-center">{item.key}</td>
                                    <td className="text-center">
                                      <a
                                        href={item.image}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <img
                                          src={item.image}
                                          alt={item.key}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                          }}
                                        />
                                      </a>
                                    </td>
                                  </tr>
                                );
                              }
                              return null;
                            })}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
