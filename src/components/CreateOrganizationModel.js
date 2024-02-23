import React, { useState, useEffect } from "react";

const CreateOrganizationModel = ({ onClose, onOrganizationCreated, organizationData }) => {

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertMessages, setAlertMessages] = useState("");

  const isValidName = (input) => {
    return /^.{3,}$/.test(input);
  };

  useEffect(() => {
    if (organizationData) {
      setName(organizationData.organisation);
      setDetails(organizationData.desc);
    } else {
    }
  }, [organizationData]);

  useEffect(() => {
    if (alertMessages) {
      const alertTimer = setTimeout(() => {
        setAlertMessages("");
      }, 3000);
      return () => clearTimeout(alertTimer);
    }
  }, [alertMessages]);

  const handleSaveChanges = async (organisationData) => {
    if (organizationData && organizationData.organisation) {
      if (!name || !details) {
        setAlertMessages("Please fill both the inputs.");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
        return;
      }
      if (!isValidName(name)) {
        setAlertMessage(
          "Name must be at least 3 characters long."
        );
        return;
      }
      try {
        const apiUrl = "https://skillmuni.in:8080/editOrganisation";
        const requestData = {
          organisation: organizationData.organisation,
          neworganisation: name,
          desc: details,
        };
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        if (response.ok) {
          if (onOrganizationCreated) {
            onOrganizationCreated();
          }
          onClose();
        } else {
          const result = await response.json();
          setAlertMessages("Organization with this name already exists.")
        }
      } catch (error) {
        setAlertMessages("An error occurred. Please try again.");
      }
    } else {
      if (!name || !details) {
        setAlertMessages("Please fill both the inputs.");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
        return;
      }
      if (!isValidName(name)) {
        setAlertMessage(
          "Name must be at least 3 characters long."
        );
        return;
      }
      try {
        const apiUrl = "https://skillmuni.in:8080/organisation";
        const requestData = {
          organisation: name,
          desc: details,
        };
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        if (response.ok) {
          if (onOrganizationCreated) {
            onOrganizationCreated();
          }
          onClose();
        } else {
          const result = await response.json();
          setAlertMessages(result.message || "Error occurred while creating the organization.");
        }
      } catch (error) {
        setAlertMessages("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-container1">
          <header className="header1">
            <h2 className="create-campaign-heading">{organizationData.organisation ? "Update Organization" : "Create Organization"}</h2>
            <button className="close-button1" onClick={onClose}>
              <span className="big-close-button1">&times;</span>
            </button>
          </header>
          <section>
            <form>
              <div className="form-group1">
                {alertMessages && (
                  <div className="alert alert-danger alert-message">
                    {" "}
                    {alertMessages}{" "}
                  </div>
                )}
                <div className="form-floating">
                  <input
                    type="text"
                    id="organizationName"
                    required
                    placeholder="Enter Organization name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="organizationName">
                    Enter Organization name
                  </label>
                  {alertMessage && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {alertMessage}{" "}
                    </div>
                  )}
                </div>
                <div className="form-floating">
                  <textarea
                    id="organizationDescription"
                    required
                    placeholder="Organization description"
                    className="form-control"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  ></textarea>
                  <label htmlFor="organizationDescription">
                    Organization description
                  </label>
                </div>
              </div>
              <br />
              <p className="notice">
                *Duplicate organization is not acceptable. Each organization
                <br /> you create must be unique to one another
              </p>
              <br />
              <br />
              <button
                type="button"
                className="btn-create-campaign"
                onClick={handleSaveChanges}
              >
                {organizationData.organisation ? "Update Organization" : "Create Organization"}
              </button>
              <br />
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
export default CreateOrganizationModel;



