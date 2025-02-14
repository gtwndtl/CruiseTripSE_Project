import React, { useState, useEffect } from "react";
import { Dropdown, Layout, Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import cruise_ship_logo from "../../assets/cruise_ship_logo.jpg";
import "./NavbarLadingPage.css";
import { GetUsersById } from "../../services/https";

const NavbarLandingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ตรวจสอบสถานะการล็อกอินจาก localStorage
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(
    localStorage.getItem("isCustomerLogin") === "true"
  );

  // เก็บข้อมูลลูกค้า
  const [customerData, setCustomerData] = useState<any>(null);

  // ดึงข้อมูลลูกค้าจาก customerID
  useEffect(() => {
    if (isCustomerLoggedIn) {
      const customerID = Number(localStorage.getItem("id"));
      GetUsersById(customerID).then((response) => {
        setCustomerData(response.data); // สมมติว่าข้อมูลถูกเก็บใน response.data
      });
    }
  }, [isCustomerLoggedIn]);

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "profile":
        console.log("Profile clicked");
        break;
      case "review":
        navigate("/customer/review");
        break;
      case "logout":
        setIsCustomerLoggedIn(false); // ล็อกเอาต์
        localStorage.setItem("isCustomerLogin", "false"); // อัปเดต localStorage
        localStorage.removeItem("role");
        localStorage.setItem("dontShowPromotion", "false");
        navigate("/home");
        window.location.reload();
        break;
      default:
        break;
    }
  };

  // เมนู dropdown
  const menu = (
    <Menu className="navbar-customer-menu" onClick={handleMenuClick}>
      <Menu.Item key="review" >
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" danger>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header className="navbaradmin">
      <div className="navbaradmin-container">
        {/* Logo Section */}
        <div
          className="navbaradmin-logo"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          <img src={cruise_ship_logo} alt="Cruise Ship Logo" />
          <h1 className="navbaradmin-title">Cruise Ship</h1>
        </div>

        {/* Menu Section */}
        <nav className="navbaradmin-menu">
          <Link to="/home">
            <button
              className={`navbaradmin-button ${location.pathname.startsWith("/home") ? "active" : ""
                }`}
            >
              Home
            </button>
          </Link>
          <Link to="/promotion/trip">
            <button
              className={`navbaradmin-button ${location.pathname.startsWith("/promotion/trip") ? "active" : ""}`}
            >
              Promotion
            </button>
          </Link>
          <Link to="#" onClick={(e) => e.preventDefault()}>
            <button
              className="navbaradmin-button"
              disabled
            >
              Trip
            </button>
          </Link>
          <Link to="#" onClick={(e) => e.preventDefault()}>
            <button
              className="navbaradmin-button"
              disabled
            >
              Food-Service
            </button>
          </Link>
        </nav>
        {/* Action Icons Section */}
        <div className="navbar-customer-actions">
          {isCustomerLoggedIn ? (
            <Dropdown className="dropdown-customer" overlay={menu} trigger={["click"]} placement="bottomRight">
              <div className="navbar-customer-card" onClick={(e) => e.preventDefault()}>
                <div className="customer-avatar">
                  {customerData?.avatar ? (
                    <img src={customerData.avatar} alt="avatar" />
                  ) : (
                    <UserOutlined style={{ fontSize: "20px", color: "#ffffff" }} />
                  )}
                </div>
                <div className="navbar-customer-info">
                  <span className="navbar-customer-name">{customerData?.first_name + ' ' + customerData?.last_name}</span>
                </div>
              </div>
            </Dropdown>
          ) : (
            <button
              className="navbaradmin-login-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>

      </div>
    </Layout.Header>
  );
};

export default NavbarLandingPage;
