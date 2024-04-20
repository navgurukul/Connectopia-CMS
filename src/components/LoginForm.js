import React, { useState } from 'react';
import './LoginForm.css';
import logo from '../Assets/Bubblegummers logo Smal.png';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

function LoginForm({ handleLogin, setLoggedInUserData }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const endpoint = 'https://connectopia.co.in/cms/cms-user/login';

        const data = {
            email: email,
            password: password
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            console.log(responseData.data);

            localStorage.setItem('loggedInUserData', JSON.stringify(responseData?.data));

            if (response.ok) {
                handleLogin(responseData?.data);
                responseData?.data.usertype === 'superadmin' || responseData?.data.usertype === 'admin'
                    ? navigate('/details')
                    : navigate('/campaign');

                setLoggedInUserData(responseData?.data);

                localStorage.setItem("email", email);
                localStorage.setItem('user-type', responseData?.data.usertype);
                localStorage.setItem("organization", responseData?.data.name);
            } else {
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 5000);
            }
        } catch (error) {
            console.error('There was an error sending the data', error);
        }
    };

    return (
        <div className="home-page">
            <Navbar />
            <div className='styled-container'>
                <div>
                    <div className="modal-container2" style={{ marginTop: '13%' }}>
                        <img src={logo} alt="Logo" className="modal-logo" />
                        <header className='header1'>
                            <h2 className="create-campaign-heading">Login</h2>
                        </header>
                        <section>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group1">
                                    {error && <div className="alert alert-danger alert-message" role="alert">Please enter correct login credentials!</div>}
                                    <div className="form-floating">
                                        <input type="email" id="userEmail" required className="form-control" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <label htmlFor="userEmail">Enter Email</label>
                                    </div>
                                    <div className="form-floating">
                                        <input type={isPasswordVisible ? "text" : "password"} id="userPassword" required className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <label htmlFor="userPassword">Password</label>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={togglePasswordVisibility}
                                        >
                                            <i className={`fa ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <br /><br />
                                <button type="submit" className='btn-create-campaign'>Login</button>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;



