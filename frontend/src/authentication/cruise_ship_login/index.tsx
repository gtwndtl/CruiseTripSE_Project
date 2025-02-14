import { Button, Form, Input, message, Flex, Row, Col, Typography } from "antd";
// import { useNavigate } from "react-router-dom";
// import { SignIn } from "../../services/https";
// import { SignInInterface } from "../../interfaces/SignIn";
// import logo from "./../../assets/logo.png";
import { useState } from "react";
import Spinner from "../../components/stripe-spinner/Spinner";
import { GuestSignIn } from "../../booking_trip/service/https";
import { GuestSignInInterface } from "../../booking_trip/interfaces/IGuestSignIn";
import "./index.css"


export default function CruiseShipLogin() {
  // const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const { Title, Text } = Typography;

  const onFinish = async (values: GuestSignInInterface) => {
    setIsLoading(true)
    localStorage.clear()
    console.log("values", values)
    const res = await GuestSignIn(values);
    if (res.status == 200) {
      messageApi.success("Sign-in successful");
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("page", "dashboard");
      localStorage.setItem("token_type", res.data.token_type);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("guest_id", res.data.id);
      localStorage.setItem("role", res.data.role);

      setTimeout(() => {
        setIsLoading(false)
        location.href = `${location.pathname}/home`;
      }, 2000);
    } else {
      setIsLoading(false)
      messageApi.error(res.data.error);
    }
  };

  return (
    <div className="login-container" >
      {contextHolder}
      <Flex justify="center" align="center" className="login">
        <div className="card-login">
          <Row className="left-side-container" align={"middle"} justify={"center"} style={{width:"360px", height: "auto", padding:"24px" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{marginBottom:"12px"}}>
              <Title level={3}>Login in to your account</Title>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                style={{width:"100%"}}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Birth Day"
                  name="birthday"
                  rules={[
                    { required: true, message: "Please input your birth date!" },
                  ]}
                >
                  <Input type="date" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    disabled={isLoading}
                    style={{ width:"100%", borderRadius:"4px", background:"var(--color-theme-main)" }}
                  >
                    {isLoading ? <Spinner/> : "log in"}
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <div className="right-side-container">
            <div className="overlay"></div>
              <div className="intro-content">
                <Title level={1} style={{color:"white", margin:0}}>Welcome!</Title>
                <Text style={{fontSize:"12px", color:"white", margin:0}}>This web page is for use on the cruise ship. To log in, you need a completed trip booking. Use your email and birthdate as your password to access the system.</Text>
              </div>

            <div>
            </div>
          </div>
        </div>
      </Flex>
    </div>
  );
}
