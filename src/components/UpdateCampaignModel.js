import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CampaignModal.css";

const UpdateCampaignModel = ({
  onClose,
  campainDetails,
  onCampaignUpdated,
}) => {
  console.log("campainDetails", campainDetails);
  const [campaignName, setcampaignName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "" });

  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setcampaignName(campainDetails.campaign_name);
    setDescription(campainDetails.desc);
    setStartDate(campainDetails.startdate);
    setEndDate(campainDetails.enddate);

    if (campainDetails.campaign_duration) {
      const [hours, minutes, seconds] = campainDetails.campaign_duration
        .split(":")
        .map((num) => num.padStart(2, "0"));
      setDuration({ hours, minutes, seconds });
    }
  }, []);

  const showAlert = (message) => {
    setAlert({ show: true, message });
    setTimeout(() => {
      setAlert({ show: false, message: "" });
    }, 5000);
  };

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();

    if (!campaignName || !description || !startDate || !endDate) {
      showAlert("Please make sure all fields are filled correctly.");
      return;
    }
    const { hours, minutes, seconds } = duration;

    const payload = {
      campaign_name: campainDetails.campaign_name,
      newcampaign_name: campaignName,
      startdate: startDate,
      enddate: endDate,
      desc: description,
      campaign_duration: `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    };

    try {
      const response = await axios.post(
        "https://connectopia.co.in/editCampaign",
        payload
      );

      if (response.data) {
        onCampaignUpdated();
        onClose();
      } else {
        console.error("Failed to update the campaign. No response data.");
        showAlert("Failed to update the campaign.");
      }
    } catch (error) {
      console.error("There was an error:", error);
      showAlert("There was an error updating the campaign.");
    }
  };

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
      showAlert("End date cannot be before start date.");
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

        <div className="modal-container" style={{ marginTop: "70px" }}>
          <header>
            <h2 className="create-campaign-heading pt-3">Update Campaign</h2>
            <button
              className="close-button"
              onClick={onClose}
              style={{ marginTop: "50px" }}
            >
              <span className="big-close-button">&times;</span>
            </button>
          </header>
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
              </div>

              {/* added timer update code here */}
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
                        value={duration.hours}
                        onChange={(e) =>
                          setDuration({
                            ...duration,
                            hours: Number(e.target.value),
                          })
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
                        value={duration.minutes}
                        onChange={(e) =>
                          setDuration({
                            ...duration,
                            minutes: Number(e.target.value),
                          })
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
                        value={duration.seconds}
                        onChange={(e) =>
                          setDuration({
                            ...duration,
                            seconds: Number(e.target.value),
                          })
                        }
                      />
                      <label htmlFor="seconds">Seconds</label>
                    </div>
                  </div>
                </div>
              </div>

              <p className="notice">
                *Duplicate campaign is not acceptable. Each campaign <br /> you
                create must be unique to one another
              </p>
              <br />
              <button
                type="button"
                className="btn-create-campaign"
                onClick={handleUpdateCampaign}
              >
                Update Campaign
              </button>
              <br />
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UpdateCampaignModel;
