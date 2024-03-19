import React, { useState } from "react";
import axios from "axios";
import "./CampaignModal.css";

export function RemoveCampaign({ onClose, selectedOrganisation, campaigns, email, onRemoveCampaign }) {

  const [removeCampaign, setRemoveCampaign] = useState("");

  const assignCampaign = async () => {
    const data = {
      emailid: email,
      campaign_name: removeCampaign,
    };
    try {
      const response = await axios.delete("http://15.206.198.172//removeCampaignFromUser", { data });
      if (response.status === 200) {
        alert("Campaign removed successfully!");
        onRemoveCampaign(selectedOrganisation);
        onClose();
      } else {
        console.error("Received non-success status:", response.status);
        alert("Failed to remove the campaign. Server responded with non-success status.");
      }
    } catch (error) {
      console.error("Error removing the campaign:", error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      alert("Error removing the campaign. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container1">
        <header className="header1">
          <h2 className="create-campaign-heading">Remove Campaign from</h2>
          <p className="text-center mt-3">{email}</p>
          <button className="close-button1" onClick={onClose}>
            <span className="big-close-button1">&times;</span>
          </button>
        </header>
        <section>
          <form>
            <div className="form-group1">
              <div className="form-floating select-wrapper">
                <select
                  id="campaign"
                  className="form-control"
                  value={removeCampaign}
                  onChange={(e) => {
                    setRemoveCampaign(e.target.value);
                  }}
                >
                  <option value="">Select a Campaign</option>
                  {campaigns.map((campaign, index) => (
                    <option key={index} value={campaign}>
                      {campaign}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <br />
            <br />
            <button
              type="button"
              className="btn-create-campaign"
              onClick={assignCampaign}
            >
              Remove Campaign
            </button>
            <br />
          </form>
        </section>
      </div>
    </div>
  );
}