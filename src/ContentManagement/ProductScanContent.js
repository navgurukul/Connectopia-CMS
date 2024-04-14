import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode.react";
import axios from "axios";

export const ProductScanContent = () => {
  const [qrData, setQrData] = useState("");
  const [fetchData, setFetchData] = useState("");
  const [generateQR, setGenerateQR] = useState(false);
  const qrRef = useRef();
  const [data, setData] = useState("");
  // const campaign = localStorage.getItem("CampaignId");
  const [uploadedQRs, setUploadedQRs] = useState([]);
  const campaignId = localStorage.getItem("CampaignId");

  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedStageId, setSelectedStageId] = useState(null);
;

  useEffect(() => {
    QRDATA();
  }, []);

  console.log(selectedStageId,'selectedStageId');
  console.log(selectedStage,'selectedStage');

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
    // const apiUrl = `http://15.206.198.172/updateimage/${campaign}/0/${qrData}/QRscan`;
    const apiUrl = `http://15.206.198.172/cms/campaign/upload-image/${campaignId}/1/level?level=1&stage_id=46&key=${qrData}`;
    //https://15.206.198.172/cms/campaign/upload-image/47/1/level?level=1&stage_id=46&key=QR%20-1

    // 'https://15.206.198.172/cms/campaign/upload-image/48/0/general?level=1&stage_id=48&key=qr1'

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image uploaded successfully:", response.data);
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
        `http://15.206.198.172/cms/campaign/get-signed-url/${campaignId}/qr`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Data-get,", data[0]);
      setStages(data.data.stages);

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
                      onChange={(e) => setQrData(e.target.value)}
                    >
                      <option value="">Select QR</option>
                      <option
                        value="QR 1"
                        disabled={uploadedQRs.includes("QR 1")}
                      >
                        QR Code 1
                      </option>
                      <option
                        value="QR 2"
                        disabled={uploadedQRs.includes("QR 2")}
                      >
                        QR Code 2
                      </option>
                      <option
                        value="QR 3"
                        disabled={uploadedQRs.includes("QR 3")}
                      >
                        QR Code 3
                      </option>
                      <option
                        value="QR 4"
                        disabled={uploadedQRs.includes("QR 4")}
                      >
                        QR Code 4
                      </option>
                      <option
                        value="QR 5"
                        disabled={uploadedQRs.includes("QR 5")}
                      >
                        QR Code 5
                      </option>
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
              {/* for get UI */}
              <div className="col-6 ">
                <div
                  style={{
                    border: "1px dotted black",
                    padding: "5px",
                    width: "500px",
                    marginLeft: "-50px",
                  }}
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-center">Title</th>
                        <th className="text-center">Uploaded QR codes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(fetchData) &&
                        fetchData.map((item, index) => (
                          <tr key={item.key}>
                            <td className="text-center">
                              {item.key.slice(0, -4)}
                            </td>
                            <td className="text-center">
                              <a
                                href={item.value}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={item.value}
                                  alt={item.key.slice(0, -4)}
                                  style={{ width: "30px", height: "30px" }}
                                />
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
