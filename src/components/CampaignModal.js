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
  const [qrscanData, setQrscanData] = useState(
    "https://master.d1ywywy8pav9t.amplifyapp.com/"
  );
  const [sequence, setSequence] = useState("random");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  const retrievedLoggedInUserDataObject =
    localStorage.getItem("loggedInUserData");
  const userData = JSON.parse(retrievedLoggedInUserDataObject);

  const selectedOrganisation = localStorage.getItem("selectedOrganisation");

  const generateCampaignId = async () => {
    try {
      const response = await axios.get(
        "http://15.206.198.172/cms/campaign-next"
      );

      const campaignId = response.data.id;
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
      !endDate ||
      !time
    ) {
      setAlertMessage("Please make sure all fields are filled correctly.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return;
    }

    if (time.hours < 0 || time.hours > 23) {
      setAlertMessage("Hours must be between 0 and 23.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return;
    }

    if (time.minutes < 0 || time.minutes > 59) {
      setAlertMessage("Minutes must be between 0 and 59.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return;
    }

    if (time.seconds < 0 || time.seconds > 59) {
      setAlertMessage("Seconds must be between 0 and 59.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return;
    }

    const organisationName = selectedOrganisation;

    const payload = {
      campaignid: data,
      organisation_id: parseInt(localStorage.getItem("selectedOrgId")),
      name: campaignName,
      startdate: startDate,
      enddate: endDate,
      description: description,
      scantype: scannerType,
      status: "active",
      scan_sequence:sequence,
      email: userData.email,
      campaign_duration: `${time.hours
        .toString()
        .padStart(2, "0")}:${time.minutes
        .toString()
        .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`,
    };

    try {
      const response = await axios.post(
        "http://15.206.198.172/cms/campaign/create",
        payload
      );

      if (response.data) {
        const canvas = qrRef.current.querySelector("canvas");

        const imageData = canvas.toDataURL("image/png");

        const imageBlob = dataURLtoBlob(imageData);

        const formData = new FormData();
        formData.append("image", imageBlob, "qr-code.png");

        try {
          const apiUrl = `http://15.206.198.172/updateimage/${data}/0/Main-QRCode/${scannerType}`;
          const updateImageResponse = await axios.post(apiUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("updateImageResponse", updateImageResponse);

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

  console.log("data", data);

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
                    <option value="qr">QR Code</option>
                    <option value="image">Image Scan</option>
                  </select>
                  <label htmlFor="scannerType">Scanner Type</label>
                </div>
              </div>

              {/* Added timer   */}

              <div className="form-group">
                <div className="form-group row">
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="number"
                        id="hours"
                        required
                        placeholder="Hours"
                        className="form-control"
                        min="0"
                        max="23"
                        value={time.hours === 0 ? "00" : time.hours}
                        onChange={(e) =>
                          setTime({ ...time, hours: e.target.value })
                        }
                      />
                      <label htmlFor="hours">Hours</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="number"
                        id="minutes"
                        required
                        placeholder="Minutes"
                        className="form-control"
                        min="0"
                        max="59"
                        value={time.minutes === 0 ? "00" : time.minutes}
                        onChange={(e) =>
                          setTime({ ...time, minutes: e.target.value })
                        }
                      />
                      <label htmlFor="minutes">Minutes</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="number"
                        id="seconds"
                        required
                        placeholder="Seconds"
                        className="form-control"
                        min="0"
                        max="59"
                        value={time.seconds === 0 ? "00" : time.seconds}
                        onChange={(e) =>
                          setTime({ ...time, seconds: e.target.value })
                        }
                      />
                      <label htmlFor="seconds">Seconds</label>
                    </div>
                  </div>
                </div>

                {/* added Scan sequence type */}

                {/* <div className="form-floating select-wrapper">
                  <select
                    id="scannerType"
                    required
                    placeholder="Scann sequence type"
                    className="form-control"
                    value={scannerType}
                    onChange={(e) => setScannerType(e.target.value)}
                    onFocus={() => !scannerType && setScannerType("")}
                  >
                    <option value="" disabled hidden>
                      Scan sequence type
                    </option>
                    <option value="QRscan">Fixed sequence</option>
                    <option value="imagescan">Random sequence</option>
                  </select>
                  <label htmlFor="scannerType">Scan sequence type</label>
                </div> */}
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
                            value={`${qrscanData}?campaignId=${data}&scanType=${scannerType}`}
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
