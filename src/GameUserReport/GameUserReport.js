import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faMagnifyingGlass,
  faX,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../UserContent/UserDetails.css";
import "./GameUserReport.css";
import axios from "axios";

export function UserGameReport({ setSelectedName, setSelectedDetail }) {
  const [userReport, setUserReport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [userDetail, setUserDetail] = useState([]);
  const [organisation, setOrganisation] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [selectCampaignId, setSelectCampaignId] = useState("");

  const userOrganization = localStorage.getItem("selectedOrganisation");
  const userType = localStorage.getItem("user-type");
  const userEmailid = localStorage.getItem("email");
  const organizationId = localStorage.getItem("selectedOrgId");

  const retrievedLoggedInUserDataObject =
    localStorage.getItem("loggedInUserData");
  const userData = JSON.parse(retrievedLoggedInUserDataObject);

  useEffect(() => {
    setCampaignList([]);
    setSelectCampaignId("");
    if (organisationName) {
      axios
        .get(
          `https://connectopia.co.in/cms/organization/${
            organisationName || organizationId
          }`
        )
        .then((response) => {
          setCampaignList(response.data.data);
        })
        .catch((error) => {
          console.error("There was an error fetching data", error);
        });
    }
  }, [organisationName]);

  const filteredUserReport = userReport.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function convertUTCtoIST(dateString) {
    const date = new Date(dateString);
    const offset = 5.5;
    const istDate = new Date(date.getTime() - offset * 60 * 60 * 1000);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(istDate);
  }

  const convertUTCDateToIST = (dateString) => {
    if (!dateString) {
      console.error("Invalid date string received:", dateString);
      return {
        date: "Invalid date",
        time: "Invalid time",
      };
    }

    try {
      const dateUTC = new Date(dateString);
      const ISTOffset = 330;
      const dateIST = new Date(dateUTC.getTime() + ISTOffset * 60 * 1000);

      return {
        date: dateIST.toLocaleDateString("en-IN"),
        time: dateIST.toLocaleTimeString("en-IN"),
      };
    } catch (error) {
      console.error(
        "Error parsing date string:",
        dateString,
        "; Error:",
        error
      );
      return {
        date: "Error parsing date",
        time: "Error parsing time",
      };
    }
  };

  const fetchOrganisation = async () => {
    try {
      const apiUrl = `https://connectopia.co.in/cms/organization/list/${userEmailid}/${userType}`;
      const response = await fetch(apiUrl);

      const data = await response.json();
      setOrganisation(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const convertArrayOfObjectsToCSV = (array) => {
    let result;

    if (array.length > 0) {
      const columnDelimiter = ",";
      const lineDelimiter = "\n";

      const keys = [
        "phonenumber",
        "name",
        "emailid",
        "campaignid",
        "date",
        "time",
        "campaign_name",
        "organisation",
      ];

      result = "";
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      array.forEach((item) => {
        let ctr = 0;
        let data = {};

        keys.forEach((key) => {
          if (ctr > 0) result += columnDelimiter;

          if (key === "date") {
            const istDateTime = convertUTCDateToIST(item[key]);
            data["date"] = istDateTime.date;
            data["time"] = istDateTime.time;

            result += data["date"];
          } else if (key === "time") {
            result += data["time"];
          } else {
            if (item[key] && /[",\n]/.test(item[key])) {
              result += `"${item[key].replace(/"/g, '""')}"`;
            } else {
              result += item[key];
            }
          }

          ctr++;
        });
        result += lineDelimiter;
      });
    }
    return result;
  };

  const downloadCSV = () => {
    const array = filteredUserReport;
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "user_game_report.csv";
    const blob = new Blob([csv], { type: "text/csv" });
    const csvUrl = window.URL.createObjectURL(blob);

    link.href = csvUrl;
    link.setAttribute("download", filename);
    link.click();
  };

  const fetchUsersByOrganisation = async (organizationId) => {
    try {
      organizationId = organizationId.replace(/\s/g, "_");
      const apiUrl = `https://connectopia.co.in/cms/organization/user/${organizationId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setUserDetail(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchUserReport = async (selectCampaignId) => {
    try {
      const apiUrl = `https://connectopia.co.in/cms/customer/players/${selectCampaignId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserReport(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUserReport();
    fetchOrganisation();
    setCampaignList([]);
    setSelectCampaignId("");
  }, []);

  useEffect(() => {
    if (selectCampaignId) {
      fetchUserReport(selectCampaignId);
    }
  }, [selectCampaignId]);

  useEffect(() => {
    if (
      !organisationName ||
      !selectCampaignId ||
      selectCampaignId.trim() === "" ||
      organisationName.trim() === ""
    ) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setShowMessage(false);
    }
  }, [organisationName, selectCampaignId]);

  const deleteUser = (phoneNumber) => {
    axios
      .delete(
        `https://connectopia.co.in/deletePlayer/${phoneNumber}/${selectCampaignId}`
      )
      .then((response) => {
        fetchUserReport();
      })
      .catch((error) => {
        console.error("There was an error deleting the user!", error);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-3 text-start">
          {userType === "superadmin" ? (
            <select
              id="organisationName"
              className="form-select"
              value={organisationName}
              onChange={(e) => {
                const selectedOrg = e.target.value;
                setOrganisationName(selectedOrg);
                if (selectedOrg) {
                  fetchUsersByOrganisation(selectedOrg);
                }
              }}
            >
              <option value="">Select an Organization</option>
              {organisation.map((org, index) => (
                <option key={index} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        <div className="col-3 text-center">
          {(organisationName || userOrganization) && (
            <div>
              <select
                id="Campaign"
                className="form-select"
                value={selectCampaignId}
                onChange={(e) => {
                  setSelectCampaignId(e.target.value);
                }}
                onFocus={() => !selectCampaignId && setSelectCampaignId("")}
              >
                <option value="">Select Campaign</option>
                {campaignList
                  ?.filter(
                    (campaign) => campaign.name && campaign.name.trim() !== ""
                  )
                  .map((campaign) => (
                    <option key={campaign.name} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div className="col-6 text-end">
          <button className="btn custom-download-btn" onClick={downloadCSV}>
            <strong>Download Report :</strong>{" "}
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      </div>

      {showMessage && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "lightyellow",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Please select an organization and campaign to perform an action on
          'Game User' !!
        </div>
      )}

      <div className="row text-center">
        <div className="col-12">
          <div className="shadowbox">
            <div className="row custom-div">
              <div className="col-6">
                <strong
                  style={{
                    float: "left",
                    marginLeft: "15px",
                    marginTop: "25px",
                  }}
                >
                  Game Users
                </strong>
              </div>
              <div className="col-6 custom-div text-end">
                <div className="search-container">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="search-icon"
                  />
                  <input
                    type="text"
                    placeholder="Search by Name"
                    className="input-serach"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <FontAwesomeIcon
                      icon={faX}
                      className="clear-icon"
                      onClick={() => setSearchTerm("")}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="shadowbox-body">
              <div className="col-12">
                <div className="container">
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <table className="custom-table">
                      <thead
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#E6E6E6",
                          zIndex: 1,
                        }}
                      >
                        <tr>
                          <th>Name</th>
                          <th>Phone Number</th>
                          <th>Email ID</th>
                          <th>Date and Time</th>
                          {userData.usertype !== "user" ? (
                            <th>Actions</th>
                          ) : null}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUserReport.map((user, index) => (
                          <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.phone}</td>
                            <td>{user.email}</td>
                            <td>{convertUTCtoIST(user.created_at)}</td>
                            {userData.usertype !== "user" ? (
                              <td className="text-center">
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Are you sure you wish to delete this user?"
                                      )
                                    ) {
                                      deleteUser(user.phonenumber);
                                    }
                                  }}
                                />
                              </td>
                            ) : null}
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
    </div>
  );
}


