import React from "react";
import { useNavigate } from "react-router-dom";
import "./UnauthorizedAccess.css";

const UnauthorizedAccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>Access Denied</h1>
      <p>
        It seems you don't have a valid trip reservation. Please make sure you have completed your payment and boarding process.
      </p>
      <div className="button-group">
        <button 
          className="primary-button" 
          onClick={() => navigate("/cruise-ship/login")}
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

export default UnauthorizedAccess;
