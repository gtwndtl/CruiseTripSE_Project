import React from "react";
import { Layout, Row, Col } from "antd";
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import "./FooterLandingPage.css";

const FooterLandingPage: React.FC = () => {
  return (
    <Layout.Footer className="footerlanding">
      <div className="footerlanding-container">
        {/* Logo Section */}
        <Row className="footer-section" justify="center" align="middle">
          <Col span={24} className="footer-logo">
            <h2>Cruise Ship</h2>
          </Col>
        </Row>

        {/* Contact Information Section */}
        <Row className="footer-section" justify="center" align="middle">
          <Col span={24} className="footer-contact">
            <p>
              <PhoneOutlined /> Phone: <a href="tel:+123456789">+1 234 567 89</a>
            </p>
            <p>
              <MailOutlined /> Email: <a href="mailto:support@cruiseship.com">support@cruiseship.com</a>
            </p>
          </Col>
        </Row>

        {/* Social Media Icons */}
        <Row className="footer-section" justify="center" align="middle">
          <Col span={24} className="footer-social">
            <a href="https://www.facebook.com/share/1BCm2ko5nD/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
              <FacebookOutlined />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <TwitterOutlined />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramOutlined />
            </a>
          </Col>
        </Row>

        {/* Copyright Section */}
        <Row className="footer-section" justify="center" align="middle">
          <Col span={24} className="footer-copyright">
            © {new Date().getFullYear()} Cruise Ship. All rights reserved.
          </Col>
        </Row>
      </div>
    </Layout.Footer>
  );
};

export default FooterLandingPage;
