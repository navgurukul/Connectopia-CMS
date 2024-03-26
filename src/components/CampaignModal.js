import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode.react";
import axios from "axios";
import "./CampaignModal.css";

const CampaignModal = ({ onClose, onCampaignCreated }) => {
  const [data, setData] = useState("");
  const [generateQR, setGenerateQR] = useState(false);
  const qrRef = useRef();

  const [scannerType, setScannerType] = useState("");
  const [campaignName, setcampaignName] = useState("");
  const [qrscanData, setQrscanData] = useState("https://skillmuni.in/AR-Game/");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const retrievedLoggedInUserDataObject =
    localStorage.getItem("loggedInUserData");
  const userData = JSON.parse(retrievedLoggedInUserDataObject);

  const selectedOrganisation = localStorage.getItem("selectedOrganisation");

  const generateCampaignId = async () => {
    try {
      const response = await axios.get(
        "https://skillmuni.in:8080/nextCampaignId"
      );

      const campaignId = response.data.CampaignId;
      setData(campaignId);

      if (campaignId) {
        setGenerateQR(true);
      }
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  };

  const downloadQRCode = () => {
    if (!data) {
      console.error(
        "Campaign ID is missing. Please generate a campaign ID first."
      );
      return;
    }

    const canvas = qrRef.current.querySelector("canvas");
    const imageData = canvas.toDataURL("image/png");

    if (canvas) {
      const a = document.createElement("a");
      a.href = imageData;
      a.download = "QRCode.png";
      a.click();
    } else {
      console.error("Could not find the canvas element.");
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();

    if (
      !data ||
      !campaignName ||
      !scannerType ||
      !description ||
      !startDate ||
      !endDate
    ) {
      setAlertMessage("Please make sure all fields are filled correctly.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return;
    }

    const organisationName = selectedOrganisation;

    const payload = {
      campaignid: data,
      organisation: organisationName,
      campaignname: campaignName,
      startdate: startDate,
      enddate: endDate,
      desc: description,
      scantype: scannerType,
      usertype: userData.usertype,
      emailid: userData.emailid,
    };

    try {
      const response = await axios.post(
        "https://skillmuni.in:8080/api/createNewCampaign",
        payload
      );

      if (response.data) {
        const canvas = qrRef.current.querySelector("canvas");

        const imageData = canvas.toDataURL("image/png");

        const imageBlob = dataURLtoBlob(imageData);

        const formData = new FormData();
        formData.append("image", imageBlob, "qr-code.png");

        try {
          const apiUrl = `https://skillmuni.in:8080/updateimage/${data}/0/Main-QRCode/${scannerType}`;
          const updateImageResponse = await axios.post(apiUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (updateImageResponse.data) {
            if (onCampaignCreated) {
              onCampaignCreated();
            }
            onClose();
            alert("Campaign created successfully!");
          } else {
            console.error("Failed to update the image. No response data.");
          }
        } catch (error) {
          console.error("There was an error when uploading the image:", error);
        }
      } else {
        console.error("Failed to create the campaign. No response data.");
      }
    } catch (error) {
      console.error("There was an error:", error);
      setAlertMessage("Campaign already exists.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return;
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

  useEffect(() => {
    if (generateQR && data) {
      qrRef.current.focus();
    }
  }, [generateQR, data]);

  const handleFocus = (e) => {
    e.target.type = "date";
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      e.target.type = "text";
    }
  };

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;

    const timestampStart = new Date(startDate).getTime();
    const timestampEnd = new Date(selectedDate).getTime();

    if (timestampEnd < timestampStart) {
      setAlertMessage("End date cannot be before start date.");
    } else {
      setEndDate(selectedDate);
    }
  };

  return (
    <div>
      <div className="modal-overlay">
        {alert.show && (
          <div
            className="alert alert-danger alert-message alert-msg-message"
            role="alert"
            style={{
              position: "fixed",
              top: "25px",
              right: "25px",
              padding: "10px",
              borderRadius: "5px",
              zIndex: 1000,
            }}
          >
            {alert.message}
          </div>
        )}

        <div className="modal-container">
          <header>
            <h2 className="create-campaign-heading">Create Campaign</h2>
            <button className="close-button" onClick={onClose}>
              <span className="big-close-button">&times;</span>
            </button>
          </header>
          {alertMessage && (
            <div
              className="alert alert-danger alert-message text-center"
              style={{
                width: "100%",
                marginTop: "-20px",
                marginBottom: "15px",
              }}
            >
              {" "}
              {alertMessage}{" "}
            </div>
          )}
          <section>
            <form>
              <div className="form-group">
                <div className="form-floating">
                  <input
                    type="text"
                    id="campaignName"
                    required
                    placeholder="Enter Campaign name"
                    className="form-control"
                    value={campaignName}
                    onChange={(e) => setcampaignName(e.target.value)}
                  />
                  <label htmlFor="campaignName">Enter Campaign name</label>
                </div>
                <div className="form-floating">
                  <textarea
                    id="campaignDescription"
                    required
                    placeholder="Campaign description"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  <label htmlFor="campaignDescription">
                    Campaign description
                  </label>
                </div>
              </div>
              <div className="form-group">
                <div className="form-floating">
                  <input
                    type="text"
                    id="startDate"
                    required
                    placeholder="Campaign start date"
                    className="form-control"
                    min={getToday()}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="startDate">Campaign start date</label>
                </div>
                <div className="form-floating">
                  <input
                    type="text"
                    id="webURL"
                    required
                    placeholder="Web URL to access app (for QR code purpose)"
                    className="form-control"
                    value={qrscanData}
                    onChange={(e) => setQrscanData(e.target.value)}
                  />
                  <label htmlFor="webURL">
                    Web URL to access app (for QR code purpose)
                  </label>
                </div>
              </div>
              <div className="form-group">
                <div className="form-floating">
                  <input
                    type="text"
                    id="endDate"
                    required
                    placeholder="Campaign end date"
                    className="form-control"
                    min={startDate}
                    value={endDate}
                    onChange={handleEndDateChange}
                    disabled={!startDate}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="endDate">Campaign end date</label>
                </div>
                <div className="form-floating select-wrapper">
                  <select
                    id="scannerType"
                    required
                    placeholder="Scanner Type"
                    className="form-control"
                    value={scannerType}
                    onChange={(e) => setScannerType(e.target.value)}
                    onFocus={() => !scannerType && setScannerType("")}
                  >
                    <option value="" disabled hidden>
                      Scanner Type
                    </option>
                    <option value="QRscan">QR Code</option>
                    <option value="imagescan">Image Scan</option>
                  </select>
                  <label htmlFor="scannerType">Scanner Type</label>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="btn-generate-campaign"
                      onClick={generateCampaignId}
                    >
                      Generate Campaign Id
                    </button>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      id="campaignName"
                      required
                      className="form-control input-campaign"
                      value={data}
                      ref={qrRef}
                      onChange={() => {}}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              </div>
              {data && (
                <div className="QR-form-group" style={{ marginLeft: "10%" }}>
                  <button
                    type="button"
                    className="btn-generate-campaign btn-generate-QR"
                    onClick={downloadQRCode}
                    disabled={!generateQR || !data}
                  >
                    Download QR Code
                  </button>
                  <div ref={qrRef} className="input-QRCode">
                    {generateQR &&
                      data &&
                      (() => {
                        return (
                          <QRCode
                            value={`${qrscanData}${data}/${scannerType}`}
                            size={100}
                            level={"H"}
                            style={{ marginTop: "-7px", marginLeft: "-9px" }}
                          />
                        );
                      })()}
                  </div>
                </div>
              )}

              <p className="notice">
                *Duplicate campaign is not acceptable. Each campaign <br /> you
                create must be unique to one another
              </p>
              <button
                type="button"
                className="btn-create-campaign"
                onClick={handleCreateCampaign}
              >
                Save
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;
