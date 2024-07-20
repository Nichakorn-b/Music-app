import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NavBar = ({ username, handleLogout }) => {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login"); // Redirect to login page
  };

  const handleLoginClick = () => {
    navigate("/login"); // Redirect to login page
  };
  //   return (
  //     <Navbar bg="light" expand="lg">
  //       <Navbar.Brand href="#home">Music Subscription Service</Navbar.Brand>
  //       <Nav className="ml-auto"></Nav>
  //       <Navbar.Toggle aria-controls="basic-navbar-nav" />
  //       <Navbar.Collapse id="basic-navbar-nav">
  //         <Nav className="ml-auto">
  //           {username !== "Guest" && (
  //             <Nav.Item>
  //               <Button variant="outline-secondary" onClick={handleLogoutClick}>
  //                 Logout
  //               </Button>
  //             </Nav.Item>
  //           )}
  //         </Nav>
  //       </Navbar.Collapse>
  //     </Navbar>
  //   );
  // };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand className="display-3">
        Welcome, <span>{username}</span>
        </Navbar.Brand>
        <Nav className="mr-auto"></Nav>
        <Nav className="mr-auto">
          {username !== "Guest" ? (
            <Nav.Item>
              <Button variant="outline-secondary" onClick={handleLogoutClick}>
                Logout
              </Button>
            </Nav.Item>
          ) : (
            <Nav.Item>
              <Button variant="outline-secondary" onClick={handleLoginClick}>
                Login
              </Button>
            </Nav.Item>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
