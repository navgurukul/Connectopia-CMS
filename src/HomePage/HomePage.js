import React, { useEffect, useState } from "react";
import "./HomePage.css";
import Navbar from "../Navbar/Navbar";
import { Organisation } from "../DashBoard/OrganisationList";
import { OrganisationDetail } from "../DashBoard/OrganisationDetail";
import { UserDetails } from "../UserContent/UserDetails";
import { ContentManagement } from "../ContentManagement/ContentManagement";
import { UserGameReport } from "../GameUserReport/GameUserReport";

export function HomePage({ handleLogout, loggedInUserData }) {
  const [selected, setSelected] = useState();
  const [selectedOrg, setSelectedOrg] = useState();
  const [userType, setUserType] = useState(null);

  const retrievedLoggedInUserDataObject = localStorage.getItem('loggedInUserData');
  const userData = JSON.parse(retrievedLoggedInUserDataObject);


  useEffect(() => {
    if (loggedInUserData.name) {
      setSelectedOrg(loggedInUserData.name);
      localStorage.setItem('selectedOrganisation', loggedInUserData.name);
     
      localStorage.setItem('validUserOrganization', loggedInUserData.name);
    }
  }, [loggedInUserData])

  const handleOrgClick = (org) => {
    setSelectedOrg(org.name);
    console.log(org," this is the org")
    localStorage.setItem("selectedOrgId", org.id);
    localStorage.setItem('selectedOrganisation', org.name);
    localStorage.setItem('selectedOrganisationDesc', org.description);
    setSelected("OrganizationDetails");

    const userOrganization = localStorage.getItem('selectedOrganisation');
    localStorage.setItem('validUserOrganization', userOrganization);
  };

  const goToDashboard = () => {
    setSelected("Dashboard");
  };

  const goToContentManagement = () => {
    setSelected("ContentManagement");
    localStorage.setItem("ContentManagement", "ContentManagement")
  };

  useEffect(() => {
    const storedUserType = localStorage.getItem('user-type');
    setUserType(storedUserType);
    setSelected("Dashboard");

  }, []);

  return (
    <div className="home-page">
      <Navbar handleLogout={handleLogout} />
      <div className="styled-container">
        <div className="column1">
          <div style={{ flex: 3 }}>
            <div>
              Role:
              <br />
              <strong>
                {
                  userType === 'superadmin' ? 'Super Admin' :
                    (userType === 'admin' ? 'Admin' :
                      (userType === 'user' ? 'User' : 'Unknown'))
                }
              </strong>
              <br />
              <span>({" "}{userData.name}{" "})</span>
              <br /> <br />
              <strong>{userData.emailid}</strong>
            </div>
          </div>
          <div
            style={{ flex: 1, backgroundColor: selected === "Dashboard" ? "#E4DEDE" : "transparent" }}
            onClick={() => setSelected("Dashboard")}
          >
            Dashboard
          </div>
          <div
            style={{ flex: 1, backgroundColor: selected === "UserManagement" ? "#E4DEDE" : "transparent" }}
            onClick={() => setSelected("UserManagement")}
          >
            User Management
          </div>
          {localStorage.getItem('TempCampaignId') &&
            <div
              style={{ flex: 1, backgroundColor: selected === "ContentManagement" ? "#E4DEDE" : "transparent" }}
              onClick={() => setSelected("ContentManagement")}
            >
              Content Management
            </div>
          }
          <div
            style={{ flex: 1, backgroundColor: selected === "UserReport" ? "#E4DEDE" : "transparent" }}
            onClick={() => setSelected("UserReport")}
          >
            Game User Report
          </div>
          <div style={{ flex: 4 }}></div>
        </div>
        <div className="column2">
          {(!selected || selected === "Dashboard") && userType === 'superadmin' && <Organisation onOrgClick={handleOrgClick} />}
          {(!selected || selected === "Dashboard") && (userType === 'admin' || userType === 'user') && <OrganisationDetail org={selectedOrg} backToDashboard={goToDashboard} goToContentManage={goToContentManagement} />}
          {selected === "UserManagement" && <UserDetails />}
          {selected === "UserReport" && <UserGameReport />}
          {selected === "ContentManagement" && <ContentManagement />}
          {selected === "OrganizationDetails" && <OrganisationDetail org={selectedOrg} backToDashboard={goToDashboard} goToContentManage={goToContentManagement} />}
        </div>
      </div>
    </div>
  );
}
