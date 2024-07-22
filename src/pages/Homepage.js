import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../Components/Navbar";
import { Spinner } from "react-bootstrap";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [queryResults, setQueryResults] = useState([]);
  const [query, setQuery] = useState({ title: "", artist: "", year: "" });
  const [errorQuery, setErrorQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUser");
    const storedEmail = localStorage.getItem("loggedInEmail");
    if (storedUsername) {
      setUsername(storedUsername);
      setEmail(storedEmail);
      fetchSubscriptions(storedEmail);
    } else {
      setUsername("Guest");
    }
  }, []);

  const escapeForJS = (str) => {
    if (!str) return str;
    return str
      .replace(/\\/g, "\\\\") // Escape backslashes first
      .replace(/'/g, "\\'") // Escape single quotes
      .replace(/"/g, '\\"'); // Escape double quotes
  };

  const reverseEscapeJS = (str) => {
    if (!str) return str;
    return str.replace(/\\/g, "");
  };

  const fetchSubscriptions = async (email) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_ENDPOINT_SUB,
        {
          email: email,
          userAction: "get",
        },
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY_SUB,
          },
        }
      );
      const parsedBody = JSON.parse(response.data.body);
      console.log(parsedBody);
      if (Array.isArray(parsedBody)) {
        setSubscriptions(parsedBody);
      } else {
        console.error("Unexpected response format:", response.data.body);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const performQuery = async () => {
    try {
      setErrorQuery(""); // Reset error query before making a new request
      setQueryResults([]);
      setLoading(true); // Start loading

      const response = await axios.post(
        process.env.REACT_APP_API_ENDPOINT_SUB,
        {
          ...query,
          userAction: "query",
        },
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY_SUB,
          },
        }
      );
      const results = JSON.parse(response.data.body);
      const statusCode = response.data.statusCode;
      console.log("Query statusCode:", statusCode);
      console.log("Query results:", results);
      if (statusCode === 200) {
        if (Array.isArray(results) && results.length > 0) {
          setQueryResults(results);
        } else {
          setQueryResults([]);
          setErrorQuery("No results found. Please try again.");
        }
      } else {
        setErrorQuery(
          results.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("Failed to perform query:", error);
      setErrorQuery("Error performing query. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const addSubscription = async (title, artist) => {
    if (username === "Guest") {
      alert("Please log in to subscribe to this music.");
      return;
    }

    const requestData = {
      email: email,
      title: reverseEscapeJS(title),
      artist: reverseEscapeJS(artist),
      userAction: "add",
    };

    console.log("Data being sent to Lambda:", requestData); // Log the data

    try {
      await axios.post(process.env.REACT_APP_API_ENDPOINT_SUB, requestData, {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY_SUB,
        },
      });

      alert("Subscription added successfully");
      fetchSubscriptions(email);
    } catch (error) {
      console.error("Error adding subscription:", error);
      alert("Failed to add subscription");
    }
  };

  const removeSubscription = async (title, artist) => {
    try {
      await axios.post(
        process.env.REACT_APP_API_ENDPOINT_SUB,
        {
          email: email,
          title: reverseEscapeJS(title),
          artist: reverseEscapeJS(artist),
          userAction: "delete",
        },
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY_SUB,
          },
        }
      );
      alert("Subscription removed successfully");
      fetchSubscriptions(email);
    } catch (error) {
      console.error("Error removing subscription:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInEmail");
    setUsername("Guest");
    setEmail("");
    setSubscriptions([]);
  };

  return (
    <div>
      <NavBar username={username} handleLogout={handleLogout} />
      <div className="text-center">
        {username !== "goose" && (
          <>
            <div className="mt-5 mb-5" id="subscriptionsSection">
              <h5 className="display-6 mb-5">Your subscriptions</h5>
              <table id="subscriptionsTable" className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Image</th>
                    <th>Year</th>
                    <th>Unsubscribe</th>
                  </tr>
                </thead>
                <tbody id="subscriptionsList">
                  {subscriptions.map((sub) => (
                    <tr key={sub.title_artist}>
                      <td>{sub.title}</td>
                      <td>{sub.artist}</td>
                      <td>
                        <img
                          src={
                            process.env.REACT_APP_API_S3 +
                            `${encodeURIComponent(sub.title_artist)}.jpg`
                          }
                          alt={`Image of ${sub.artist}`}
                          style={{ width: "80px", height: "auto" }}
                        />
                      </td>
                      <td>{sub.year}</td>
                      <td>
                        <button
                          className="btn btn-light"
                          onClick={() =>
                            removeSubscription(sub.title, sub.artist)
                          }
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5" id="querySection">
              <h5 className="display-6 mb-5">Search for Music</h5>
              <div className="row mx-auto" style={{width: '80%'}}>
                <div className="col-md-4 form-group">
                  <label htmlFor="queryTitle">Title:</label>
                  <input
                    type="text"
                    id="queryTitle"
                    className="form-control"
                    placeholder="Enter title"
                    value={query.title}
                    onChange={(e) =>
                      setQuery({ ...query, title: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4 form-group">
                  <label htmlFor="queryArtist">Artist:</label>
                  <input
                    type="text"
                    id="queryArtist"
                    className="form-control"
                    placeholder="Enter artist"
                    value={query.artist}
                    onChange={(e) =>
                      setQuery({ ...query, artist: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4 form-group">
                  <label htmlFor="queryYear">Year:</label>
                  <input
                    type="text"
                    id="queryYear"
                    className="form-control"
                    placeholder="Enter year"
                    value={query.year}
                    onChange={(e) =>
                      setQuery({ ...query, year: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-12 form-group text-center">
                  <button
                    id="queryButton"
                    className="btn btn-primary mb-2"
                    style={{ marginTop: "25px", width: "10%" }}
                    onClick={performQuery}
                  >
                    Query
                  </button>
                </div>
              </div>
              {errorQuery && (
                <div className="alert alert-danger mt-3" role="alert">
                  {errorQuery}
                </div>
              )}
              {loading ? (
                <div className="d-flex justify-content-center mt-5">
                  <Spinner animation="border" role="status">
                  </Spinner>
                </div>
              ) : (
                <div className="mt-3 mb-3">
                  <table id="queryTable" className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Image</th>
                        <th>Year</th>
                        <th>Subscribe</th>
                      </tr>
                    </thead>
                    <tbody id="queryResults">
                      {queryResults.map((music) => (
                        <tr key={music.title_artist}>
                          <td>{music.title}</td>
                          <td>{music.artist}</td>
                          <td>
                            <img
                              src={music.img_url}
                              alt={`Image of ${music.artist}`}
                              style={{ width: "80px", height: "auto" }}
                            />
                          </td>
                          <td>{music.year}</td>
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                addSubscription(music.title, music.artist)
                              }
                            >
                              Subscribe
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
