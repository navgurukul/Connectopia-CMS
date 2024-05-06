import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode.react";
import axios from "axios";

export const ProductScanContent = () => {
  const [qrData, setQrData] = useState("");
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

  const [productMainQR, setProductMainQR] = useState({});

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
  };
  const saveQR = async () => {
    if (data) {
      setGenerateQR(true);
    }
    const canvas = qrRef.current.querySelector("canvas");
    const imageData = canvas.toDataURL("image/png");

    const imageBlob = dataURLtoBlob(imageData);
    const formData = new FormData();
    formData.append("image", imageBlob);
    const apiUrl = `https://connectopia.co.in/cms/campaign/upload-mind/${campaignId}/${selectedStageId}/${qrLevel}/QR-${qrLevel}/product-qr`;
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
        `https://connectopia.co.in/cms/campaign/general-product/${campaignId}/${scanType}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStages(data.product.stages);
      const stagesArray = Object.values(data.product.stages);
      setProductData(stagesArray);
      setProductMainQR(data.product);
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

  console.log("ProductData:", data.product);

  const options = [
    { value: "QR 1", label: "QR Code 1", level: 1 },
    { value: "QR 2", label: "QR Code 2", level: 2 },
    { value: "QR 3", label: "QR Code 3", level: 3 },
    { value: "QR 4", label: "QR Code 4", level: 4 },
    { value: "QR 5", label: "QR Code 5", level: 5 },
  ];

  const product = (data && data.product) || {};

  const handleSelectOptionChange = (e) => {
    setQrData(e.target.value);
    console.log("Selected QR Data:", e.target.value);
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
                          disabled={uploadedQRs?.includes(option.value)}
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
                    style={{ marginLeft: "60px", width: "150px" }}
                  >
                    Generate QR
                  </button>
                  <br />
                  {generateQR && (
                    <button
                      type="button"
                      onClick={saveQR}
                      className="btn btn-secondary"
                      style={{
                        marginLeft: "60px",
                        marginTop: "8px",
                        width: "150px",
                      }}
                    >
                      Save QR Code
                    </button>
                  )}
                  {generateQR && (
                    <button
                      type="button"
                      onClick={downloadQRCode}
                      className="btn btn-secondary"
                      style={{
                        marginLeft: "60px",
                        marginTop: "8px",
                        width: "150px",
                      }}
                    >
                      Download QR
                    </button>
                  )}
                  <div
                    ref={qrRef}
                    style={{ marginTop: "20px", marginLeft: "60px", padding: "15px 15px", border:"2px solid black", width: "200px", height: "200px"}}
                  >
                    {generateQR && qrData && (
                      <QRCode value={qrData} size={160} level={"H"} />
                    )}
                  </div>
                </div>

                <p
                  style={{
                    textAlign: "center",
                    marginRight: "10px",
                    marginBottom: "5px",
                    marginTop: "25px",
                  }}
                >
                  {productMainQR.mainQR && productMainQR.mainQR.key}
                </p>

                <div
                  style={{
                    border: "1px dotted black",
                    padding: "10px",
                    width: "200px",
                    height: "180px",
                    margin: "auto",
                    marginTop: "5px",
                  }}
                  className="mb-2"
                >
                  {productMainQR.mainQR && (
                    <>
                      <div style={{ padding: "10px" }}>
                        <img
                          src={productMainQR.mainQR.image}
                          alt={productMainQR.mainQR.key}
                          style={{ width: "150px", height: "140px" }}
                        />
                      </div>
                    </>
                  )}
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
