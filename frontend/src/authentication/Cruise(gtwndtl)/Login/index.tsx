import { Button, Form, Input, message, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Spinner from "../../../components/stripe-spinner/Spinner";
import "./index.css";
import { SignIn } from "../../../services/https";
import { SignInInterface } from "../../../interfaces/SignIn";
import sea_wave from "../../../assets/sea.jpg";

function CruiseSignInPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const { Title } = Typography;

  const onFinish = async (values: SignInInterface) => {
    localStorage.clear();
    setIsLoading(true)
    const res = await SignIn(values);
    if (res.status == 200) {
      messageApi.success("Sign-in successful");
      localStorage.setItem("page", "dashboard");
      localStorage.setItem("token_type", res.data.token_type);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("role", res.data.role);

      setTimeout(function () {
        setIsLoading(false)
        switch (res.data.role) {
          case "Admin":
            localStorage.setItem("isAdminLogin", "true");
            navigate("/admin/promotion");
            break;
          case "Customer":
            localStorage.setItem("isCustomerLogin", "true");
            navigate("/home");
            break;
          default:
            navigate("/");
        }
      }, 2000);
    } else {
      setIsLoading(false)
      messageApi.error(res.data.error);
    }
  };



  return (
    <div className="cruise-login-container">
      {contextHolder}
      <div className="cruise-login-wrapper">
        <Row className="cruise-login-card">
          {/* Left side */}
          <Col className="cruise-login-left" xs={24} sm={24} md={12}>
            <div className="cruise-login-left-content">
              <Title level={3} className="cruise-login-title">Welcome Back!</Title>
              <p className="cruise-login-subtitle">Log in to access your account and explore more.</p>
              <Form name="login-form" onFinish={onFinish} layout="vertical" requiredMark={false}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please enter your email!" }]}
                >
                  <Input placeholder="name@example.com" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please enter your password!" }]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="cruise-login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner /> : "Sign In"}
                  </Button>
                </Form.Item>
              </Form>
              <p className="cruise-login-footer">
                New to our platform? <a onClick={() => navigate("/signup")}>Create an account here!</a>
              </p>
            </div>
          </Col>
          {/* Right side */}
          <Col className="cruise-login-right" xs={0} sm={0} md={12}>
            <img
              src={sea_wave}
              alt="sea-wave"
              className="cruise-login-image"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default CruiseSignInPages;
