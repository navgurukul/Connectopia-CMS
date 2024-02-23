import React from 'react';
import { FaHome } from 'react-icons/fa';
import './Navbar.css';
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import logo from '../Assets/Bubblegummers logo Smal.png';

const Navbar = ({ handleLogout }) => {

  const userOrganization = localStorage.getItem('validUserOrganization');
  const campaignId = localStorage.getItem('TempCampaignId');
  const CampaigName = localStorage.getItem('TempCampaigName');

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {
          localStorage.getItem('loggedInUserData') ? <FaHome size={30} style={{marginLeft: '20px'}} /> :
          <img src={logo} alt="Logo1" className="logo1" style={{ width: '180px' }} />
        }
      </div>
      <div className="navbar-center">
      {userOrganization ?
        <div><span style={{ fontWeight: "lighter", fontSize: '17px' }}>Organization:</span> {userOrganization}</div>
        : <div>&nbsp;</div>
      }

      {/* {CampaigName && localStorage.getItem('selectedOrganisation') && localStorage.getItem('user-type') === 'superadmin' ?
        <div><span style={{ fontWeight: "lighter", fontSize: '17px' }}>Organization:</span> {localStorage.getItem('selectedOrganisation')}</div>
        : <div>&nbsp;</div>
      } */}
      
      {CampaigName ? 
        <div><span style={{ fontWeight: "lighter", fontSize: '17px' }}>Campaign name:</span> {CampaigName}</div>
        : <div>&nbsp;</div>
      }
      </div>
     <div className="navbar-right">
        <div>
        <Button 
            className="btn btn-danger btn-sm position-absolute top-0 end-0" 
            style={{marginTop: '20px', marginRight: '40px'}}
            onClick={handleLogout}
            >
            Logout <FontAwesomeIcon icon={faRightFromBracket} />
        </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;