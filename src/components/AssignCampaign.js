import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CampaignModal.css";

export function AssignCampaign({ onClose, selectedOrganisation, campaigns, email, onAddCampaign }) {

  const [campaignList, setCampaignList] = useState([]);
  const [addCampaign, setAddCampaign] = useState("");

  useEffect(() => {
    if (selectedOrganisation) {
      axios
        .get(
          `http://15.206.198.172//organisation/${selectedOrganisation}`
        )
        .then((response) => {
          setCampaignList(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the campaigns", error);
        });
    }
  }, [selectedOrganisation]);

  const assignCampaign = () => {
    const data = {
      emailid: email,
      campaign_name: addCampaign,
    };
    axios
      .post("http://15.206.198.172//assignCampaignToUser", data)
      .then((response) => {
        alert("Campaign assigned successfully!");
        onAddCampaign(selectedOrganisation);
      })
      .catch((error) => {
        console.error("Error assigning the campaign:", error);
        alert("Error assigning the campaign. Please try again.");
      });
    onClose();
  };

  const getUniqueCampaigns = () => {
    return campaignList.filter(
      (orgCampaign) => !campaigns.includes(orgCampaign.campaign_name)
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container1">
        <header className="header1">
          <h2 className="create-campaign-heading">Assign Campaign to</h2>
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
                  value={addCampaign}
                  onChange={(e) => {
                    const addcampaign = e.target.value;
                    setAddCampaign(addcampaign);
                  }}
                >
                  <option value="">Select a Campaign</option>
                  {getUniqueCampaigns().map((campaign, index) => (
                    <option key={index} value={campaign.campaign_name}>
                      {campaign.campaign_name}
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
              Add Campaign
            </button>
            <br />
          </form>
        </section>
      </div>
    </div>
  );
}