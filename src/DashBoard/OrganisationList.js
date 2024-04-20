import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faMagnifyingGlass,
  faX,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Organisation.css";
import CreateOrganizationModel from "../components/CreateOrganizationModel";
import axios from "axios";

export function Organisation({ onOrgClick }) {
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [details, setDetails] = useState("");
  const [id, setId] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const retrievedLoggedInUserDataObject =
    localStorage.getItem("loggedInUserData");
  const userData = JSON.parse(retrievedLoggedInUserDataObject);

  const handleShowModal = () => {
    setName("");
    setDetails("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);
  const filteredOrganizations = organizations?.filter((org) => {
    return org.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleEditClick = (name, desc, id) => {
    setName(name);
    setDetails(desc);
    setId(id);
    setShowModal(true);
  };

  const fetchOrganizations = async () => {
    if (userData.usertype === "superadmin") {
      try {
        const apiUrl = `https://connectopia.co.in/cms/organization/list/${userData.email}/${userData.usertype}`;
        const response = await fetch(apiUrl);
        const data = await response?.json();
        setOrganizations(data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

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

  const deleteOrganization = async (OrganizationId) => {
    if (window.confirm(`Are you sure you want to delete ${OrganizationId}?`)) {
      const apiUrl = `https://connectopia.co.in/cms/organization/delete/${OrganizationId}`;
      try {
        const response = await axios.delete(apiUrl);

        if (response.status === 200) {
          fetchOrganizations();
          alert("Organization deleted successfully !!");
        } else {
          console.error("Failed to delete organization:", response.data);
        }
      } catch (error) {
        console.error("There was an error deleting the organization:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="container">
        <button className="create-button" onClick={handleShowModal}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />{" "}
          Create Organization
        </button>
      </div>
      <div className="row text-center">
        <div className="col-12 ">
          <div className="shadowbox">
            <div className="row" style={{ marginTop: "-15px" }}>
              <div className="col-6">
                <strong
                  style={{
                    float: "left",
                    marginLeft: "10px",
                    marginTop: "25px",
                  }}
                >
                  CURRENT ORGANIZATIONS
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
                    placeholder="Search by Organization"
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
          </div>
          <div className="shadowbox-body">
            <div className="col-12">
              <div className="container">
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table
                    className="table-hover custom-table"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th className="text-center">Organization name</th>
                        <th className="text-center">Date created</th>
                        <th className="text-center">Description</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrganizations.map((org, index) => (
                        <tr key={index}>
                          <td
                            className="text-start"
                            style={{
                              wordWrap: "break-word",
                              maxWidth: "200px",
                              padding: "5px 20px",
                            }}
                          >
                            <Link
                              className="clickable-link"
                              onClick={(e) => {
                                e.preventDefault();
                                onOrgClick(org);
                              }}
                            >
                              {org.name}
                            </Link>
                          </td>
                          <td>{convertUTCtoIST(org.created_at)}</td>
                          <td
                            className="text-start"
                            style={{
                              wordWrap: "break-word",
                              maxWidth: "300px",
                              padding: "5px 0px 5px 20px",
                            }}
                          >
                            {org.description}
                          </td>
                          <td>
                            <FontAwesomeIcon
                              icon={faPen}
                              style={{ marginLeft: "6px" }}
                              className="icon-style"
                              onClick={() =>
                                handleEditClick(
                                  org.name,
                                  org.description,
                                  org.id
                                )
                              }
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="icon-style"
                              style={{ marginRight: "6px" }}
                              onClick={() => deleteOrganization(org.id)}
                            />
                            &nbsp; &nbsp;
                          </td>
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

      {showModal && (
        <CreateOrganizationModel
          onClose={handleCloseModal}
          onOrganizationCreated={fetchOrganizations}
          organizationData={{ organisation: name, desc: details, id: id }}
        />
      )}
    </div>
  );
}
