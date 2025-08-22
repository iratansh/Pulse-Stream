import React, { useState } from "react";
import { FaSignInAlt, FaUserPlus, FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    let isValid = true;
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Validate name for registration
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "email is required";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    // Validate confirm password for registration
    if (!isLogin && !formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard"); // Redirect to dashboard on success
      } else {
        const errorData = await response.json();
        setApiError(
          errorData.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="hero-wrapper">
      <main className="content-container" style={{ padding: "4rem 0" }}>
        <section
          className="text-container"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <div className="example-item" style={{ padding: "2rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1 className="heading" style={{ fontSize: "2rem" }}>
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="description" style={{ color: "#64748b" }}>
                {isLogin ? "Sign in to continue" : "Join our community today"}
              </p>
            </div>

            {/* Error message display */}
            {apiError && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#ef4444",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {apiError}
              </div>
            )}

            {/* Auth Toggle */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <button
                onClick={() => {
                  setIsLogin(true);
                  setApiError(""); // Clear errors when switching forms
                  setErrors({}); // Clear form validation errors
                }}
                style={{
                  background: isLogin ? "#3b82f6" : "#f1f5f9",
                  color: isLogin ? "white" : "#64748b",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <FaSignInAlt style={{ marginRight: "0.5rem" }} />
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setApiError(""); // Clear errors when switching forms
                  setErrors({}); // Clear form validation errors
                }}
                style={{
                  background: !isLogin ? "#3b82f6" : "#f1f5f9",
                  color: !isLogin ? "white" : "#64748b",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <FaUserPlus style={{ marginRight: "0.5rem" }} />
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#64748b",
                    }}
                  >
                    Full Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaUser
                      style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#64748b",
                      }}
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                        border: `2px solid ${
                          errors.name ? "#ef4444" : "#e5e7eb"
                        }`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                      }}
                      placeholder="John Smith"
                    />
                  </div>
                  {errors.name && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>
                      {errors.name}
                    </span>
                  )}
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#64748b",
                  }}
                >
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <FaUser
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#64748b",
                    }}
                  />
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                      border: `2px solid ${
                        errors.email ? "#ef4444" : "#e5e7eb"
                      }`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                    placeholder="jsmith@gmail.com"
                  />
                </div>
                {errors.email && (
                  <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>
                    {errors.email}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#64748b",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <FaLock
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#64748b",
                    }}
                  />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                      border: `2px solid ${
                        errors.password ? "#ef4444" : "#e5e7eb"
                      }`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>
                    {errors.password}
                  </span>
                )}
              </div>

              {!isLogin && (
                <div style={{ marginBottom: "2rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#64748b",
                    }}
                  >
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaLock
                      style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#64748b",
                      }}
                    />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                        border: `2px solid ${
                          errors.confirmPassword ? "#ef4444" : "#e5e7eb"
                        }`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                      }}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              )}

                <button
                  type="submit"
                  className="primary-button"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "1rem",
                  }}
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
