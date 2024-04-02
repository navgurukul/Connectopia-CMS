import React, { useEffect, useState } from "react";
import "./HomePage.css";
import Navbar from "../Navbar/Navbar";
import { Organisation } from "../DashBoard/OrganisationList";
import { OrganisationDetail } from "../DashBoard/OrganisationDetail";
import { UserDetails } from "../UserContent/UserDetails";
import { ContentManagement } from "../ContentManagement/ContentManagement";
import { UserGameReport } from "../GameUserReport/GameUserReport";

// Define constants for user types
const USER_TYPES = {
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user',
  UNKNOWN: 'unknown'
};

// Define constants for selected states
const SELECTED_STATES = {
  DASHBOARD: 'Dashboard',
  USER_MANAGEMENT: 'UserManagement',
  CONTENT_MANAGEMENT: 'ContentManagement',
  USER_REPORT: 'UserReport',
  ORGANIZATION_DETAILS: 'OrganizationDetails'
};

export function HomePage({ handleLogout, loggedInUserData }) {
  const [selected, setSelected] = useState();
  const [selectedOrg, setSelectedOrg] = useState();
  const [userType, setUserType] = useState(null);

  const retrievedLoggedInUserDataObject = localStorage.getItem('loggedInUserData');
  const userData = JSON.parse(retrievedLoggedInUserDataObject);

  useEffect(() => {
    if (loggedInUserData.organisation) {
      setSelectedOrg(loggedInUserData.organisation);
      localStorage.setItem('selectedOrganisation', loggedInUserData.organisation);
      localStorage.setItem('validUserOrganization', loggedInUserData.organisation);
    }
  }, [loggedInUserData]);

  const handleOrgClick = (org) => {
    setSelectedOrg(org.organisation);
    localStorage.setItem('selectedOrganisation', org.organisation);
    localStorage.setItem('selectedOrganisationDesc', org.desc);
    setSelected(SELECTED_STATES.ORGANIZATION_DETAILS);
    localStorage.setItem('validUserOrganization', org.organisation);
  };

  const goToDashboard = () => {
    setSelected(SELECTED_STATES.DASHBOARD);
  };

  const goToContentManagement = () => {
    setSelected(SELECTED_STATES.CONTENT_MANAGEMENT);
    localStorage.setItem(SELECTED_STATES.CONTENT_MANAGEMENT, SELECTED_STATES.CONTENT_MANAGEMENT);
  };

  useEffect(() => {
    const storedUserType = localStorage.getItem('user-type');
    setUserType(storedUserType);
    setSelected(SELECTED_STATES.DASHBOARD);
  }, []);

  return (
    <div className="home-page">
      <Navbar handleLogout={handleLogout} />
      <div className="styled-container">
        <div className="column1">
          <UserInfoDisplay userType={userType} userData={userData} />
          <NavigationMenu selected={selected} setSelected={setSelected} />
        </div>
        <div className="column2">
          <ContentDisplay selected={selected} userType={userType} selectedOrg={selectedOrg} goToDashboard={goToDashboard} goToContentManagement={goToContentManagement} handleOrgClick= {handleOrgClick} />
        </div>
      </div>
    </div>
  );
}

const UserInfoDisplay = ({ userType, userData }) => (
  <div style={{ flex: 3 }}>
    <div>
      Role:
      <br />
      <strong>
        {
          userType === USER_TYPES.SUPER_ADMIN ? 'Super Admin' :
            (userType === USER_TYPES.ADMIN ? 'Admin' :
              (userType === USER_TYPES.USER ? 'User' : USER_TYPES.UNKNOWN))
        }
      </strong>
      <br />
      <span>({" "}{userData.name}{" "})</span>
      <br /> <br />
      <strong>{userData.emailid}</strong>
    </div>
  </div>
);

const NavigationMenu = ({ selected, setSelected }) => (
  <>
    <MenuItem name={SELECTED_STATES.DASHBOARD} selected={selected} setSelected={setSelected} />
    <MenuItem name={SELECTED_STATES.DASHBOARD} selected={selected} setSelected={setSelected} />
    <MenuItem name={SELECTED_STATES.USER_MANAGEMENT} selected={selected} setSelected={setSelected} />
    {localStorage.getItem('TempCampaignId') &&
      <MenuItem name={SELECTED_STATES.CONTENT_MANAGEMENT} selected={selected} setSelected={setSelected} />
    }
    <MenuItem name={SELECTED_STATES.USER_REPORT} selected={selected} setSelected={setSelected} />
    <div style={{ flex: 4 }}></div>
  </>
);

const MenuItem = ({ name, selected, setSelected }) => (
  <div
    style={{ flex: 1, backgroundColor: selected === name ? "#E4DEDE" : "transparent" }}
    onClick={() => setSelected(name)}
  >
    {name}
  </div>
);

const ContentDisplay = ({ selected, userType, selectedOrg, goToDashboard, goToContentManagement, handleOrgClick }) => (
  <>
    {(!selected || selected === SELECTED_STATES.DASHBOARD) && userType === USER_TYPES.SUPER_ADMIN && <Organisation onOrgClick={handleOrgClick} />}
    {(!selected || selected === SELECTED_STATES.DASHBOARD) && (userType === USER_TYPES.ADMIN || userType === USER_TYPES.USER) && <OrganisationDetail org={selectedOrg} backToDashboard={goToDashboard} goToContentManage={goToContentManagement} />}
    {selected === SELECTED_STATES.USER_MANAGEMENT && <UserDetails />}
    {selected === SELECTED_STATES.USER_REPORT && <UserGameReport />}
    {selected === SELECTED_STATES.CONTENT_MANAGEMENT && <ContentManagement />}
    {selected === SELECTED_STATES.ORGANIZATION_DETAILS && <OrganisationDetail org={selectedOrg} backToDashboard={goToDashboard} goToContentManage={goToContentManagement} />}
  </>
);
