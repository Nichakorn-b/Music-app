import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      //const hashedPassword = await bcrypt.hash(password, 10);
      const formData = {
        email: email,
        user_name: username,
        password: password,
        userAction: "register",
      };

      const response = await axios.post(
        process.env.REACT_APP_API_ENDPOINT_LOGIN,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY_LOGIN,
          },
        }
      );

      if (response.data.statusCode === 200) {
        alert(response.data.body);
        navigate("/login"); // Redirect to login page
      } else {
        setErrorMessage(response.data.body);
      }
    } catch (error) {
      setErrorMessage(
        error.response
          ? error.response.data
          : "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="display-4 mt-5 mb-4">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputUsername" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="inputUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3 mt-4">
            <button type="submit" className="btn btn-primary" style={{ width: "100%", height: "auto" }}>
              Register
            </button>
            </div>
            <div className="form-group mb-3">
              {" "}
              <a href="/login" className="btn btn-outline-secondary" style={{ width: "100%", height: "auto" }}>
                Already have an account? Click here to login
              </a>
            </div>
          </form>
          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
