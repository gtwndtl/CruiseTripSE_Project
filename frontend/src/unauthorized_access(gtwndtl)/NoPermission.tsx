import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
const NoPermission: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>Unauthorized Access</h1>
      <p>
        You do not have permission to access this page.
      </p>
      <div className="button-group">
        <button
          className="primary-button"
          onClick={() => navigate("/home")}
        >
          Go to Home
        </button>
        <a
          className="secondary-button"
          href="https://www.facebook.com/share/1BCm2ko5nD/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default NoPermission;
