import { Button, Form, Input, message, Row, Col, Typography, DatePicker, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Spinner from "../../../components/stripe-spinner/Spinner";
import "./index.css";
import { CreateUser } from "../../../services/https";
import sea_wave from "../../../assets/sea.jpg";

function CruiseSignInPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const { Title } = Typography;


  const calculateAge = (birthday: Date) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const onFinish = async (values: any) => {
    setIsLoading(true); // เปิด Loading เมื่อเริ่มทำงาน
    try {
      const age = calculateAge(values.birthday.toDate());
      const payload = {
        ...values,
        age: age,
        role_id: 3,
      };
  
      const res = await CreateUser(payload);
  
      if (res.status === 201) {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
  
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An unexpected error occurred. Please try again.",
      });
    } finally {
      // ปิด Loading ในทุกกรณี
      setIsLoading(false);
    }
  };
  



  return (
    <div className="cruise-signup-container">
      {contextHolder}
      <div className="cruise-signup-wrapper">
        <Row className="cruise-signup-card">
          {/* Right side */}
          <Col className="cruise-signup-right" xs={0} sm={0} md={12}>
            <img
              src={sea_wave}
              alt="sea-wave"
              className="cruise-signup-image"
            />
          </Col>
          {/* Left side */}
          <Col className="cruise-signup-left" xs={24} sm={24} md={12}>
            <div className="cruise-signup-left-content">
              <Title level={3} className="cruise-signup-title">Create an Account</Title>
              <p className="cruise-signup-subtitle">Join us today to explore endless possibilities.</p>
              <Form name="signup-form" onFinish={onFinish} layout="vertical" requiredMark={false}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="First Name"
                      name="first_name"
                      rules={[
                        { required: true, message: "Please enter your first name!" },
                        {
                          pattern: /^[a-zA-Zก-๙\s]+$/,
                          message: "Can only contain Thai or English characters!",
                        },
                      ]}
                    >
                      <Input placeholder="First Name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Last Name"
                      name="last_name"
                      rules={[
                        { required: true, message: "Please enter your last name!" },
                        {
                          pattern: /^[a-zA-Zก-๙\s]+$/,
                          message: "Can only contain Thai or English characters!",
                        },
                      ]}
                    >
                      <Input placeholder="Last Name" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Email Address"
                      name="email"
                      rules={[
                        { type: "email", message: "Invalid email format!" },
                        { required: true, message: "Please enter your email!" },
                      ]}
                    >
                      <Input placeholder="name@example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[
                        { required: true, message: "Please enter your phone number!" },
                        {
                          validator: (_, value) => {
                            if (!value || /^0\d{9}$/.test(value)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Phone number must be 10 digits and start with 0!")
                            );
                          },
                        },
                      ]}
                    >
                      <Input placeholder="Phone number" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[{ required: true, message: "Please enter your password!" }]}
                    >
                      <Input.Password placeholder="Password" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Confirm Password"
                      name="confirm_password"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Please confirm your password!" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="Confirm your password" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Date of Birth"
                      name="birthday"
                      rules={[{ required: true, message: "Please select your date of birth!" }]}
                    >
                      <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" placeholder="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Gender"
                      name="gender_id"
                      rules={[{ required: true, message: "Please select your gender!" }]}
                    >
                      <Select
                        placeholder="Select your gender"
                        options={[
                          { value: 1, label: "Male" },
                          { value: 2, label: "Female" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="cruise-signup-button"
                        disabled={isLoading}
                      >
                        {isLoading ? <Spinner /> : "Sign Up"}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>

              <p className="cruise-signup-footer">
                Already have an account? <a onClick={() => navigate("/login")}>Log in here!</a>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default CruiseSignInPages;
