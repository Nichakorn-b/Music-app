import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import bcrypt from "bcryptjs";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
      userAction: 'login'
    };

    try {
      const response = await axios.post(process.env.REACT_APP_API_ENDPOINT_LOGIN, formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY_LOGIN
        }
      });

      if (response.data.statusCode === 200) {
        alert(`Welcome, ${response.data.body.user_name}`);
        localStorage.setItem('loggedInUser', response.data.body.user_name);
        localStorage.setItem('loggedInEmail', response.data.body.email);
        navigate('/home'); // redirect to main page
      } else {
        setErrorMessage(response.data.body);
      }
    } catch (error) {
      setErrorMessage(error.response.data);
    }
  };

  return (
    <div className="container">
      <h1 className="display-4 mt-5 mb-4">Login</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="inputEmail" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                name="email"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="inputPassword" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
            <button type="submit" className="mt-3 btn btn-primary btn-block" style={{ width: "100%", height: "auto" }}>Login</button>
            </div>
            <div className="form-group mb-3">
              <a href="/register" className="btn btn-outline-secondary btn-block" style={{ width: "100%", height: "auto" }}>Not a member with us? Click here to register</a>
            </div>
          </form>
          {errorMessage && (
            <div id="errorMessage" className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
