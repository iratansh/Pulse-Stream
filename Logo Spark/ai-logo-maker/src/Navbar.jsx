import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NavigationBar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Check user status
  useEffect(() => {
    const checkUserStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setCurrentUser(null);
      }
    };

    // Check on mount
    checkUserStatus();

    // Setup storage event listener to detect changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        checkUserStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const handleUserStateChange = () => {
      checkUserStatus();
    };
  
    window.addEventListener('userStateChanged', handleUserStateChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userStateChanged', handleUserStateChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    // Redirect to landing page
    navigate('/');
  };

  return (
    <Navbar
      fixed="top"
      expand="lg"
      style={{
        background: "linear-gradient(90deg, #1a237e 0%, #283593 100%)",
        padding: "10px 20px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Container fluid>
        <Navbar.Brand
          style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: "1.5rem",
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Logo Spark
        </Navbar.Brand>

        <Nav className="mx-auto d-flex align-items-center">
          <Nav.Link
            className="mx-2"
            style={{
              color: "#E8EAF6",
              fontWeight: "500",
              transition: "color 0.2s ease",
            }}
            onClick={() => navigate("/logo-maker")}
          >
            Logo Maker
          </Nav.Link>
          <Nav.Link
            className="mx-2"
            style={{
              color: "#E8EAF6",
              fontWeight: "500",
              transition: "color 0.2s ease",
            }}
            onClick={() => navigate("/documentation")}
          >
            Documentation
          </Nav.Link>
          <Nav.Link
            className="mx-2"
            style={{
              color: "#E8EAF6",
              fontWeight: "500",
              transition: "color 0.2s ease",
            }}
            onClick={() => navigate("/logo-ideas")}
          >
            Logo Ideas
          </Nav.Link>
          <Nav.Link
            className="mx-2"
            style={{
              color: "#E8EAF6",
              fontWeight: "500",
              transition: "color 0.2s ease",
            }}
            onClick={() => navigate("/pricing")}
          >
            Pricing
          </Nav.Link>
          <Nav.Link
            className="mx-2"
            style={{
              color: "#E8EAF6",
              fontWeight: "500",
              transition: "color 0.2s ease",
            }}
            onClick={() => navigate("/blog")}
          >
            Blog
          </Nav.Link>
        </Nav>

        <Nav>
          {currentUser ? (
            <NavDropdown 
              title={
                <span style={{ color: "#E8EAF6" }}>
                  {currentUser.name || currentUser.username}
                </span>
              } 
              id="user-dropdown"
              align="end"
              style={{
                color: "#E8EAF6",
                fontWeight: "500",
              }}
            >
              <NavDropdown.Item onClick={() => navigate("/saved-logos")}>Saved</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link
                style={{
                  color: "#E8EAF6",
                  marginRight: "15px",
                  fontWeight: "500",
                  transition: "color 0.2s ease",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Nav.Link>
              <Nav.Link
                style={{
                  backgroundColor: "#FF4081",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "4px",
                  fontWeight: "600",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "all 0.2s ease",
                }}
                className="d-flex align-items-center justify-content-center"
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F50057")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FF4081")
                }
                onClick={() => navigate("/login")}
              >
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}