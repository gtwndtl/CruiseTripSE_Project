import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
const NotLoggedInPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>Oops! You're not logged in</h1>
      <p>
        Please log in to access this page.
      </p>
      <div className="button-group">
        <button
          className="primary-button"
          onClick={() => navigate("/login")}
        >
          Go to Login
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

export default NotLoggedInPage;
