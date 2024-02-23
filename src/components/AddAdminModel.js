import axios from "axios";
import React, { useEffect, useState } from "react";
// import './CreateOrganizationModel.css';

const AddAdminModel = ({ onClose, onAdminCreated }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [alertMessages, setAlertMessages] = useState("");
    const [error, setError] = useState({ name: "", email: "", password: "" });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const selectedOrganisation = localStorage.getItem("selectedOrganisation");

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    useEffect(() => {
        if (alertMessages) {
            const alertTimer = setTimeout(() => {
                setAlertMessages("");
            }, 3000);
            return () => clearTimeout(alertTimer);
        }
    }, [alertMessages]);

    function handleAddadmin(e) {
        e.preventDefault();
        const adminData = {
            emailid: email,
            password: password,
            organisation: selectedOrganisation,
            name: name,
            usertype: "admin",
        };

        axios
            .post("https://skillmuni.in:8080/createNewUser", adminData)
            .then((response) => {
                if (onAdminCreated) {
                    onAdminCreated();
                }
                setAlertMessages("Admin added successfully!");
                const timerId = setTimeout(() => {
                    setAlertMessages("");
                }, 5000);
                onClose();
            })
            .catch((error) => {
                setAlertMessages("There was an error creating the admin!");
            });
    }

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        validateName(newName);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        validateEmail(newEmail);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const validateName = (name) => {
        if (!/^[a-zA-Z ]{3,}$/.test(name)) {
            setError((prevError) => ({
                ...prevError,
                name: "Name must be at least 3 characters and contain only letters.",
            }));
            return false;
        }
        setError((prevError) => ({ ...prevError, name: "" }));
        return true;
    };

    const validateEmail = (email) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError((prevError) => ({
                ...prevError,
                email: "Email must be a valid email address.",
            }));
            return false;
        }
        setError((prevError) => ({ ...prevError, email: "" }));
        return true;
    };

    const validatePassword = (password) => {
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
            setError((prevError) => ({
                ...prevError,
                password:
                    "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, and one number.",
            }));
            return false;
        }
        setError((prevError) => ({ ...prevError, password: "" }));
        return true;
    };

    return (
        <div>
            <div className="modal-overlay">
                <div className="modal-container1" style={{ marginTop: "1em", paddingTop: "1em" }} >
                    <header className="header1">
                        <h2 className="create-campaign-heading" style={{ marginBlock: "0em" }} > Add Admin </h2>
                        <button className="close-button1" onClick={onClose}>
                            <span className="big-close-button1">&times;</span>
                        </button>
                    </header>
                    <section>
                        <form onSubmit={handleAddadmin}>
                            <div className="form-group1">
                                {alertMessages && (<div className="alert alert-danger alert-message">{alertMessages}</div>)}
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        id="adminName"
                                        required
                                        className="form-control"
                                        placeholder="Name"
                                        value={name}
                                        onChange={handleNameChange}
                                    />
                                    <label htmlFor="adminName">Name</label>
                                    {error.name && <div style={{ color: 'red', fontSize: "12px" }}>{error.name}</div>}
                                </div>

                                <div className="form-floating">
                                    <input
                                        type="email"
                                        id="adminEmail"
                                        required
                                        className="form-control"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        autoComplete="email"
                                    />
                                    <label htmlFor="adminEmail">Enter Email</label>
                                    {error.email && <div style={{ color: 'red', fontSize: "12px" }}>{error.email}</div>}
                                </div>

                                <div className="form-floating" style={{ position: "relative" }}>
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        id="userPassword"
                                        required
                                        className="form-control"
                                        placeholder="Password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                    <label htmlFor="userPassword">Password</label>
                                    {error.password && (
                                        <div style={{ color: "red", fontSize: "12px" }}>
                                            {error.password}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={togglePasswordVisibility}
                                        style={{
                                            position: "absolute",
                                            top: error.password ? "calc(50% - 20px)" : "calc(50% - 0px)",
                                            right: "15px",
                                            transform: "translateY(-50%)",
                                        }}
                                    >
                                        <i
                                            className={`fa ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"
                                                }`}
                                        ></i>
                                    </button>
                                </div>

                            </div>
                            <br />

                            <p className="notice">
                                *Duplicate user is not acceptable. Each admin you create <br />{" "}
                                must be unique to one another
                            </p>
                            <br />

                            <button type="submit" className="btn-create-campaign"> Add Admin </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AddAdminModel;
