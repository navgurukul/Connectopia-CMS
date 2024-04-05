import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faMagnifyingGlass, faX, faCircleMinus, faCirclePlus, faUsers, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "./UserDetails.css";
import { Link } from "react-router-dom";
import AddUserModel from "../components/AddUserModel";
import { AssignCampaign } from "../components/AssignCampaign";
import { RemoveCampaign } from "../components/RemoveCampaign";
import axios from "axios";
import UpdateUserAdminModel from "../components/UpdateUserAdminModel";

export function UserDetails({ setSelectedName, setSelectedDetail }) {

  const [organisation, setOrganisation] = useState([]);
  const [organisationName, setOrganisationName] = useState("");
  const [userDetail, setUserDetail] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addCampaign, setAddCampaign] = useState(false);
  const [removeCampaign, setRemoveCampaign] = useState(false);
  const [emailCampaign, setEmailCampaign] = useState("")
  const [showMessage, setShowMessage] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [showUpdateUserAdminModel, setShowUpdateUserAdminModel] = useState(false);

  const retrievedLoggedInUserDataObject = localStorage.getItem('loggedInUserData');
  const userData = JSON.parse(retrievedLoggedInUserDataObject);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseAddCampaign = () => {
    setAddCampaign(false);
  };

  function handleUpdateUserAdmin(user) {
    setUserDetails(user)
    setShowUpdateUserAdminModel(true);
  }
  const handleCloseUpdateUserAdminModal = () => {
    setShowUpdateUserAdminModel(false);
  };

  const handleRemoveCampaign = (campaigns, gmail) => {
    setSelectedCampaigns(campaigns);
    setEmailCampaign(gmail)
    setRemoveCampaign(true);
  };
  const handleAddCampaign = (campaigns, gmail) => {
    setSelectedCampaigns(campaigns);
    setEmailCampaign(gmail)
    setAddCampaign(true);
  };
  const handleCloseRemoveCampaign = () => {
    setRemoveCampaign(false);
  };

  const showAdmins = () => {
    setUserTypeFilter('admin');
  };

  const showUsers = () => {
    setUserTypeFilter('user');
  };

  const showAll = () => {
    setUserTypeFilter('');
  };

  useEffect(() => {
    if (userData.usertype !== 'superadmin') {
      setOrganisationName(userData.name);
      fetchUsersByOrganisation(userData.name);
    } else {
      fetchOrganisation();
    }
  }, []);

  useEffect(() => {
    if (!organisationName || organisationName.trim() === "") {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setShowMessage(false);
    }
  }, [organisationName]);

  const fetchOrganisation = async () => {
    if (userData.usertype === "superadmin") {
      try {
        const apiUrl = `http://15.206.198.172/cms/organization/list/${userData.email}/${userData.usertype}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setOrganisation(data);
        // console.log(data, "data this is the user data")
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const filteredUserDetails = userDetail.filter((user) =>
    user.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
  );

  let displayedUsers = filteredUserDetails;
  if (userTypeFilter) {
    displayedUsers = filteredUserDetails.filter(user => user.usertype === userTypeFilter);
  }


  const fetchUsersByOrganisation = async (selectedOrganisation) => {
    // console.log(organisation, "selectedOrganisation")
    let orgId = parseInt(organisation.find(org => org.name === selectedOrganisation).id);
    // console.log(orgId, "orgId")
    try {
      const apiUrl = `http://15.206.198.172/cms/organization/user/${orgId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setUserDetail(data);
      console.log(data, "data this is the user data")
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleDeleteCmsUser = (email) => {
    const url = 'http://15.206.198.172/cms/cms-user/delete';

    axios({
      method: 'delete',
      url: url,
      data: {
        email: email,
      },
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log('User deleted successfully!', response);
      })
      .catch(error => {
        console.error('There was an error deleting the user!', error);
      });
  };

  return (
    <div className="container"  >
      <div className="container">
        <div className="row">
          <div className="col-md-4 text-begin ">
            <div>
              {userData.usertype === 'superadmin' ?
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
                    <option key={index} value={org.name}>
                      {org.name}
                    </option>
                  ))}
                </select>
                : null}
            </div>

            {showMessage && (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "lightyellow",
                  textAlign: "center",
                  marginTop: "10px",
                  width: '650px',
                  marginLeft: '100px'
                }}
              >
                Please select an organization to perform an action on 'Users/Admins' !!
              </div>
            )}

            <br />
            <div className="row">
              <div className="col-md-4" onClick={showAll}>
                <button className="create-buttons-new"><FontAwesomeIcon icon={faUsers} />View All</button>
              </div>
              <div className="col-md-4" onClick={showAdmins}>
                <button className="create-buttons-new" ><FontAwesomeIcon icon={faUser} />View Admins</button>
              </div>
              <div className="col-md-4" onClick={showUsers}>
                <button className="create-buttons-new"><FontAwesomeIcon icon={faUser} />View Users</button>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="row  text-end">
              <Link to="/">
                <p>&lt; Back </p>
              </Link>
            </div>
            <div className="row ">
              <div className="col-8"></div> <br />
              <div className="col-4 text-end" style={{ marginTop: "7%" }}>
                {" "}
                {userData.usertype !== 'user' ?
                  <button className="create-buttons" onClick={handleShowModal} style={{ marginRight: '30px', marginTop: '-30px' }}><FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "5px" }} /> Add Users</button>
                  : null}
              </div>
            </div>
          </div>
        </div>

        <div className="row text-center">
          <div className="col-12">
            <div className="shadowbox">
              <div className="row custom-div" style={{ marginTop: '-10px' }}>
                <div className="col-6">
                  <strong style={{ float: 'left', marginLeft: '15px', marginTop: '25px' }}>All Admins and Users</strong>
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
                            top: 0,
                            backgroundColor: "#E6E6E6",
                            zIndex: 1,
                          }}
                        >
                          <tr>
                            <th>Role</th>
                            <th>Name</th>
                            <th>Email ID</th>
                            <th>Campaigns</th>
                            {userData.usertype !== 'user' ? <th>Actions</th> : null}
                          </tr>
                        </thead>
                        <tbody>
                          {displayedUsers.map((user, index) => (
                           
                            <tr key={index}>
                              <td>{user.usertype}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.campaigns.map((campaign) => (
                                <div key={campaign.campaignid}>{campaign.campaign_name}</div>
                              ))}</td>

                              {userData.usertype !== 'user' ?
                                <td>
                                  <FontAwesomeIcon
                                    icon={faCirclePlus}
                                    style={{ color: "green", cursor: 'pointer' }}
                                    className="mr-3"
                                    onClick={() => {
                                      const campaignNames = user.campaigns
                                        .map((cam) => cam.campaign_name)
                                      const gmail = user.email;
                                      handleAddCampaign(campaignNames, gmail);
                                    }}
                                  />
                                  &nbsp; &nbsp; &nbsp;
                                  <FontAwesomeIcon
                                    icon={faCircleMinus}
                                    style={{ color: "#FF7F7F", cursor: 'pointer' }}
                                    className="mr-3"
                                    onClick={() => {
                                      const campaignNames = user.campaigns.map((cam) => cam.campaign_name)
                                      const gmail = user.email;
                                      handleRemoveCampaign(campaignNames, gmail);
                                    }}
                                  />
                                  &nbsp; &nbsp; &nbsp;
                                  <FontAwesomeIcon
                                    icon={faPen}
                                    style={{ cursor: 'pointer' }}
                                    className="mr-3"
                                    onClick={() => handleUpdateUserAdmin(user)}
                                  />
                                  &nbsp; &nbsp; &nbsp;
                                  <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer' }}
                                    onClick={() => handleDeleteCmsUser(user.email)} />
                                </td>
                                : null}

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

      {showModal && <AddUserModel onClose={handleCloseModal} />}

      {showUpdateUserAdminModel && <UpdateUserAdminModel userDetails={userDetails} onClose={handleCloseUpdateUserAdminModal} onUpdateUserAdmin={fetchUsersByOrganisation} selectedOrganisation={organisationName} />}

      {addCampaign && (
        <AssignCampaign
          onClose={handleCloseAddCampaign}
          selectedOrganisation={organisationName}
          campaigns={selectedCampaigns}
          email={emailCampaign}
          onAddCampaign={fetchUsersByOrganisation}
        />
      )}

      {removeCampaign && (
        <RemoveCampaign
          onClose={handleCloseRemoveCampaign}
          selectedOrganisation={organisationName}
          campaigns={selectedCampaigns}
          email={emailCampaign}
          
          onRemoveCampaign={fetchUsersByOrganisation}
        />
      )}

    </div>
  );
}
