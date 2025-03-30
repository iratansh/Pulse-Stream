import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function NavigationBar() {
  const navigate = useNavigate();

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
          }}
        >
          Logo Spark
        </Navbar.Brand>

        <Nav className="mx-auto d-flex align-items-center">
          <Nav.Link
            on
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
            onClick={() => navigate("/register")}
          >
            Register
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
