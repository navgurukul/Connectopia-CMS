import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faRocket, faMagnifyingGlass, faX, faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "./Organisation.css";
import { Link } from "react-router-dom";
import axios from "axios";
import CampaignModal from "../components/CampaignModal";
import AddUserModel from "../components/AddUserModel";
import AddAdminModel from "../components/AddAdminModel"
import UpdateCampaignModel from "../components/UpdateCampaignModel";

export function OrganisationDetail({ backToDashboard, goToContentManage }) {

  const [searchTerm, setSearchTerm] = useState("");
  const [campaignList, setCampaignList] = useState([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditCampaignModal, setShowEditCampaignModal] = useState(false);
  const [campainDetails, setCampainDetails] = useState({});

  const userType = localStorage.getItem('user-type');

  const retrievedLoggedInUserDataObject = localStorage.getItem('loggedInUserData');
  const userData = JSON.parse(retrievedLoggedInUserDataObject);

  useEffect(() => {
    const userTypee = localStorage.getItem('user-type');

    const cleanUp = () => {
      if (userTypee === 'superadmin') {
        localStorage.removeItem('validUserOrganization');
      }
    };
    return cleanUp;

  }, []);

  const handleShowAddAdminModal = () => {
    setShowAddAdminModal(true);
  };
  const handleCloseAddAdminModal = () => {
    setShowAddAdminModal(false);
  };

  const handleShowCampaignModal = () => {
    setShowCampaignModal(true);
  };
  const handleCloseCampaignModal = () => {
    setShowCampaignModal(false);
  };

  const handleShowAddUserModal = () => {
    setShowAddUserModal(true);
  };
  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const handleCloseEditCampaignModal = () => {
    setShowEditCampaignModal(false);
  };

  let organisationList = localStorage.getItem('selectedOrganisation');
  organisationList = organisationList.replace(/['"]+/g, '');

  let selectedOrganisationDesc;
  if (userType === 'superadmin') {
    selectedOrganisationDesc = localStorage.getItem('selectedOrganisationDesc');
    selectedOrganisationDesc = selectedOrganisationDesc.replace(/['"]+/g, '');
  }

  useEffect(() => {
    fetchCampaigns();
  }, [organisationList]);

  function fetchCampaigns() {
    setCampaignList([]);

    if (organisationList) {
      let url;

      if (userData.usertype === 'superadmin') {
        url = `https://15.206.198.172/organisation/${organisationList}`;
      } else {
        url = `https://15.206.198.172/campaignsByEmailid/${userData.emailid}`;
      }

      axios
        .get(url)
        .then((response) => {
          setCampaignList(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching data", error);
        });
    }
  };

  const filteredCampaign = campaignList.filter((campaign) =>
    campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateCampaignStatus = async (campaignName, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    const requestData = {
      campaignname: campaignName,
      status_value: newStatus
    };
    const apiUrl = 'https://15.206.198.172/setStatus';

    try {
      const response = await axios.post(apiUrl, requestData);

      if (response.status === 200) {
        setCampaignList(prevCampaigns => {
          const index = prevCampaigns.findIndex(camp => camp.campaign_name === campaignName);

          const updatedCampaign = {
            ...prevCampaigns[index],
            status: newStatus
          };

          const updatedCampaigns = [...prevCampaigns];
          updatedCampaigns[index] = updatedCampaign;

          return updatedCampaigns;
        });
      } else {
        console.error('Status update failed:', response.data);
      }
    } catch (error) {
      console.error('There was an error updating the status:', error);
    }
  };


  const deleteCampaign = async (campaignName) => {
    const apiUrl = `https://15.206.198.172/deleteCampaign/${campaignName}`;
    try {
      const response = await axios.delete(apiUrl);

      if (response.status === 200) {
        setCampaignList(prevCampaigns => {
          return prevCampaigns.filter(camp => camp.campaign_name !== campaignName);
        });
      } else {
        console.error('Failed to delete campaign:', response.data);
      }
    } catch (error) {
      console.error('There was an error deleting the campaign:', error);
    }
  };

  function oncampaignClick(campaignid, campaignName, scantype) {
    localStorage.setItem("CampaignId", campaignid)
    localStorage.setItem("CampaigName", campaignName)
    localStorage.setItem("ScanType", scantype)
    localStorage.setItem("TempCampaignId", campaignid)
    localStorage.setItem("TempCampaigName", campaignName)
    goToContentManage()
  }

  function handleUpdateCampaign(campaign) {
    setCampainDetails(campaign)
    setShowEditCampaignModal(true);
  }

  return (
    <div className="container">
      <div style={{ flex: 1 }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 ">
              <button className="create-button" onClick={handleShowCampaignModal}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} /> Create Campaigns
              </button>
            </div>


            <div className="col-md-6 ">
              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-center">Manage Users</h5>
                </div>

                {userType === 'superadmin' && (
                  <div className="col-md-6 text-end ">
                    <Link to="/" className="clickable-link" onClick={backToDashboard}>
                      <p>&lt; Back to Organization</p>
                    </Link>
                  </div>
                )}
              </div>

              <div className="row ">
                <>

                  <div className="col-md-4 text-end">
                    <button className="create-buttons" onClick={handleShowAddUserModal}><FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "5px" }} /> Add users</button>
                  </div>
                  {userType !== 'user' ?
                    <div className="col-md-4 text-start">
                      <button className="create-buttons" onClick={handleShowAddAdminModal}><FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "5px" }} /> Add admins</button>
                    </div>
                    : null}
                  <div className="col-md-4">
                  </div>
                </>
              </div>
            </div>

          </div>
        </div>
        <strong style={{ marginLeft: '10px' }}>Oganization Description:</strong> {userType === 'superadmin' ? selectedOrganisationDesc : userData.organisation_desc}
      </div>

      <div className="row ">
        <div className="col-12 custom-div">
          <div className="shadowbox">
            <div className="row custom-div" style={{ marginTop: '-15px' }}>
              <div className="col-6">
                <strong style={{ float: 'left', marginLeft: '10px', marginTop: '25px' }}>CURRENT CAMPAIGNS</strong>
              </div>
              <div className="col-6 custom-div text-end">
                <div className="search-container">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="search-icon"
                  />
                  <input
                    type="text"
                    placeholder="Search by Campaign"
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
                      <thead>
                        <tr>
                          <th>Campaign name</th>
                          <th>Start date</th>
                          <th>End date</th>
                          <th>Admins assigned</th>
                          <th>Users assigned</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>

                        {filteredCampaign
                          .filter(campaign => campaign.campaign_name && campaign.campaign_name.trim() !== "")
                          .map((campaign, index) => {
                            const admins = campaign.users
                              .filter(user => user.usertype === 'admin')
                              .map(admin => admin.name)
                              .join(", ");

                            const users = campaign.users
                              .filter(user => user.usertype === 'user')
                              .map(user => user.name)
                              .join(", ");

                            const rocketIconColor = campaign.status === 'active' ? 'green' : 'red';

                            return (
                              <tr key={index}>
                                <td className="text-start" style={{ wordWrap: "break-word", maxWidth: "250px", padding: "5px 20px" }}>
                                  <Link className="clickable-link"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      oncampaignClick(campaign.campaignid, campaign.campaign_name, campaign.scantype);
                                    }}
                                  >
                                    {campaign.campaign_name}
                                  </Link>
                                </td>
                                <td>{campaign.startdate}</td>
                                <td>{campaign.enddate}</td>
                                <td>{admins}</td>
                                <td>{users}</td>

                                <td>
                                  <FontAwesomeIcon icon={faPen} className="icon-style" onClick={() => handleUpdateCampaign(campaign)} />
                                  <FontAwesomeIcon
                                    icon={faRocket}
                                    className="icon-style"
                                    onClick={() => updateCampaignStatus(campaign.campaign_name, campaign.status)}
                                    style={{ color: rocketIconColor }}
                                  />
                                  {userType !== 'user' ? <FontAwesomeIcon icon={faTrash} className="icon-style" onClick={() => deleteCampaign(campaign.campaign_name)} /> : null}
                                </td>

                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCampaignModal && (
        <CampaignModal onClose={handleCloseCampaignModal} onCampaignCreated={fetchCampaigns} />
      )}

      {showAddUserModal && (
        <AddUserModel onClose={handleCloseAddUserModal} onUserCreated={fetchCampaigns} />
      )}

      {showAddAdminModal && (
        <AddAdminModel onClose={handleCloseAddAdminModal} onAdminCreated={fetchCampaigns} />
      )}

      {showEditCampaignModal && (
        <UpdateCampaignModel onClose={handleCloseEditCampaignModal} campainDetails={campainDetails} onCampaignUpdated={fetchCampaigns} />
      )}

    </div>
  );
}
