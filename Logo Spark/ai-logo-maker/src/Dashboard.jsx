import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoadingIndicator from "./LoadingIndicator";
import Toast from "./Toast";
import {
  FaDownload,
  FaSave,
  FaSyncAlt,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./LandingPage.css";
import { streamLogos } from "./logoAPI";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(1); // Start with 1 logo already generated
  const [totalLogos, setTotalLogos] = useState(6);
  const [toast, setToast] = useState(null);
  const [aborted, setAborted] = useState(false);
  const [aborting, setAborting] = useState(false); // New state to track abort in progress
  const streamControllerRef = useRef(null);
  const gridRef = useRef(null);
  const abortRequestedRef = useRef(false); // Ref to track if abortion was requested

  useEffect(() => {
    // Initialize with the first logo if available
    if (location.state?.firstLogo) {
      setLogos([
        {
          id: 0,
          path: location.state.firstLogo,
          isSelected: false,
        },
      ]);
      setInitializing(false);
    } else {
      // If we don't have a first logo, redirect back to logo maker
      navigate("/logo-maker");
      return;
    }

    // Start streaming additional logos if we have a task ID
    if (location.state?.taskId && location.state?.companyName) {
      startLogoStream(location.state.taskId, location.state.companyName);
    } else {
      setLoading(false);
    }

    // Cleanup function to abort logo generation when unmounting
    return () => {
      if (streamControllerRef.current) {
        abortRequestedRef.current = true;
        streamControllerRef.current.abort();
        streamControllerRef.current = null;
      }
    };
  }, [location.state, navigate]);

  // Function to start the logo streaming process
  const startLogoStream = (taskId, companyName) => {
    setAborted(false);
    setAborting(false);
    abortRequestedRef.current = false;
    setLoading(true);

    streamControllerRef.current = streamLogos(
      taskId,
      companyName,
      (data) => {
        if (abortRequestedRef.current) {
          console.log("Ignoring new logo after abortion was requested");
          return;
        }

        // Add new logo
        setLogos((prevLogos) => [
          ...prevLogos,
          {
            id: data.index + 1,
            path: data.logo,
            isSelected: false,
          },
        ]);

        // Update progress
        setGenerationProgress((prev) => prev + 1);

        // Show toast notification
        setToast(`Logo ${data.index + 1} generated successfully!`);
      },
      // On complete
      () => {
        setLoading(false);
        setAborting(false);
        setToast("All logos have been generated!");
      },
      // On error
      (error) => {
        console.error("Error streaming logos:", error);
        setLoading(false);
        setAborting(false);
        setToast(`Error generating logos: ${error.message}`);
      },
      // On abort
      (abortData) => {
        console.log("Generation aborted:", abortData);
        setLoading(false);
        setAborted(true);
        setAborting(false);
        setTotalLogos(Math.max(logos.length, abortData.total_generated + 1));
        setToast("Logo generation was cancelled");
      }
    );
  };

  // Function to handle abortion
  const handleAbort = () => {
    if (streamControllerRef.current && !abortRequestedRef.current) {
      abortRequestedRef.current = true;
      setAborting(true);
      setToast("Cancelling generation...");
      streamControllerRef.current.abort(); // Request abortion
    }
  };

  useEffect(() => {
    // Add event listener to handle clicks outside of logos
    const handleClickOutside = (event) => {
      if (
        gridRef.current &&
        gridRef.current.contains(event.target) &&
        event.target === gridRef.current
      ) {
        // Close all menus
        setLogos((prevLogos) =>
          prevLogos.map((logo) => ({
            ...logo,
            isSelected: false,
          }))
        );
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoClick = (id) => {
    setLogos(
      logos.map((logo) => ({
        ...logo,
        isSelected: logo.id === id ? !logo.isSelected : false,
      }))
    );
  };

  const handleDownload = (e, id) => {
    e.stopPropagation();

    // Find the logo with the given ID
    const logo = logos.find((logo) => logo.id === id);
    if (!logo) return;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = logo.path;
    link.download = `logo_${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show toast
    setToast("Logo downloaded successfully!");
  };

  const handleSave = async (e, id) => {
    e.stopPropagation();
    const logo = logos.find((logo) => logo.id === id);
    if (!logo) return;

    const name = window.prompt("Enter a name for this logo:");
    if (!name) {
      setToast("Name is required");
      return;
    }

    try {
      const response = await fetch("/api/saving/save-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ImagePath: logo.path,
          Name: name,
        }),
      });

      if (!response.ok) throw new Error("Failed to save logo");
      setToast("Logo saved to your account!");
    } catch (error) {
      setToast(error.message);
    }
  };

  // Calculate the number of placeholders to show
  // Only create placeholders if generation is still in progress (loading) and not aborted
  const getPlaceholderCount = () => {
    if (aborted || !loading) {
      return 0; // No placeholders if aborted or loading completed
    }

    // Calculate remaining logos to generate
    return Math.max(0, totalLogos - logos.length);
  };

  // Create placeholders based on calculation
  const logoPlaceholders = Array(getPlaceholderCount())
    .fill(null)
    .map((_, i) => ({
      id: `placeholder-${i}`,
      isPlaceholder: true,
    }));

  // Combine real logos with placeholders
  const displayLogos = [...logos, ...logoPlaceholders];

  // If we're still initializing, show a full-page loading state
  if (initializing) {
    return (
      <div className="hero-wrapper">
        <Navbar />
        <main className="content-container" style={{ padding: "4rem 0" }}>
          <LoadingIndicator message="Initializing your dashboard..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="hero-wrapper">
      <Navbar />
      <main className="content-container" style={{ padding: "4rem 0" }}>
        <section style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              padding: "0 20px",
            }}
          >
            <div>
              <h1
                className="heading"
                style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}
              >
                Generated Logos
              </h1>
              {loading && !aborting && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#6366f1",
                  }}
                >
                  <FaSpinner className="spinner" />
                  <span>
                    Generating logos: {generationProgress} of {totalLogos}
                  </span>
                </div>
              )}
              {aborting && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#f97316",
                  }}
                >
                  <FaSpinner className="spinner" />
                  <span>Cancelling generation...</span>
                </div>
              )}
              {aborted && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#ef4444",
                  }}
                >
                  <FaExclamationTriangle />
                  <span>
                    Generation cancelled: {logos.length} logos created
                  </span>
                </div>
              )}
              {!loading && !aborted && logos.length > 0 && (
                <div style={{ color: "#10b981" }}>
                  <span>All {logos.length} logos generated successfully</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              {loading && !aborting && !abortRequestedRef.current && (
                <button
                  onClick={handleAbort}
                  className="secondary-button"
                  style={{
                    padding: "0.75rem 1.5rem",
                  }}
                >
                  Cancel Generation
                </button>
              )}
              <button
                onClick={() => navigate("/logo-maker")}
                className="primary-button"
                style={{
                  padding: "0.75rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaSyncAlt />
                Create New Logos
              </button>
            </div>
          </div>

          <div
            ref={gridRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2rem",
              padding: "0 20px",
            }}
          >
            {displayLogos.map((logo) => (
              <div
                key={logo.id}
                style={{
                  position: "relative",
                  cursor: logo.isPlaceholder ? "default" : "pointer",
                  transition: "transform 0.3s ease",
                  transform: logo.isSelected ? "scale(1.02)" : "scale(1)",
                }}
                onClick={(e) => {
                  if (!logo.isPlaceholder) {
                    e.stopPropagation();
                    handleLogoClick(logo.id);
                  }
                }}
              >
                <div
                  className={`example-item ${
                    !logo.isPlaceholder ? "logo-item" : ""
                  }`}
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    height: "250px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: logo.isPlaceholder ? "#f3f4f6" : "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    boxShadow: logo.isSelected
                      ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {logo.isPlaceholder ? (
                    <div style={{ textAlign: "center" }}>
                      <FaSpinner
                        style={{
                          fontSize: "3rem",
                          color: "#d1d5db",
                          animation: "spin 2s linear infinite",
                          marginBottom: "1rem",
                        }}
                      />
                      <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                        {aborting ? "Cancelling..." : "Generating..."}
                      </p>
                    </div>
                  ) : (
                    <img
                      src={logo.path}
                      alt={`Generated logo ${logo.id}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>

                {!logo.isPlaceholder && logo.isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(59, 130, 246, 0.9)",
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "1rem",
                      padding: "1rem",
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    <button
                      onClick={(e) => handleDownload(e, logo.id)}
                      className="primary-button"
                      style={{
                        width: "100%",
                        background: "white",
                        color: "#3b82f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FaDownload />
                      Download
                    </button>
                    <button
                      onClick={(e) => handleSave(e, logo.id)}
                      className="primary-button"
                      style={{
                        width: "100%",
                        background: "white",
                        color: "#3b82f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FaSave />
                      Save to Account
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Toast notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Add some CSS for the spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spinner {
            animation: spin 2s linear infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .logo-item:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }
        `}
      </style>
      <Footer />
    </div>
  );
}
