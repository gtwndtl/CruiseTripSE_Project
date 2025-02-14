import { Space, Button, Col, Row, Divider, Form, AutoComplete, Card, message, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { HarborsInterface } from "../../../interface/Harbor";
import { CreateHarbor } from "../../../service/http";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../../../components/third-party/Loader";
import "./index.css";

// Define type for options
interface CountryOption {
  value: string;
}

function HarborCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [countries, setCountries] = useState<CountryOption[]>([]); // List of countries with value property
  const [options, setOptions] = useState<CountryOption[]>([]); // AutoComplete options
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all?fields=name");
        const countryList = response.data.map((country: { name: { common: string } }) => ({
          value: country.name.common, // Use value for AutoComplete
        }));
        setCountries(countryList);
        setOptions(countryList); // Set initial options
      } catch (error) {
        messageApi.open({
          type: "error",
          content: "ไม่สามารถโหลดรายชื่อประเทศได้ กรุณาลองใหม่อีกครั้ง",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const handleSearch = (value: string) => {
    if (value) {
      const filteredOptions = countries.filter((country) =>
        country.value.toLowerCase().includes(value.toLowerCase())
      );
      setOptions(filteredOptions);
    } else {
      setOptions(countries); // Reset options when there's no value
    }
  };

  const onFinish = async (values: HarborsInterface) => {
    try {
      const res = await CreateHarbor(values);
      if (res.status === 201) {
        messageApi.open({
          type: "success",
          content: "สร้างข้อมูลสำเร็จ!",
        });
        setTimeout(() => {
          navigate("/admin/harbor");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error || "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      });
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="spinner-review-container">
          <Loader />
        </div>
      ) : (
    <div
      className="card-container"
      style={{ height: "50vh", display: "flex", justifyContent: "center", alignItems: "center", marginTop: 50 }}
    >
      {contextHolder}
      <Card style={{ width: "100%", maxWidth: 500 }}>
        <h2><b>สร้าง HARBOR</b></h2>
        <Divider />
        <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
          {/* Input ชื่อท่าเรือ */}
          <Row justify="center">
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ชื่อท่าเรือ"
                name="harbor_name"
                rules={[{ required: true, message: "กรุณากรอกชื่อท่าเรือ !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* AutoComplete เลือกประเทศ */}
          <Row justify="center">
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ประเทศ"
                name="country"
                rules={[{ required: true, message: "กรุณาเลือกประเทศ !" }]}
              >
                <AutoComplete
                  style={{ width: "100%" }}
                  placeholder={"กรุณาเลือกประเทศ"}
                  options={options}
                  onSearch={handleSearch}
                  dropdownMatchSelectWidth={false} // Prevent dropdown stretching
                  dropdownClassName="autocomplete-dropdown"
                  dropdownRender={(menu) => (
                    <div style={{ maxHeight: 300, overflowY: "auto", overflowX: "auto", overflow: "hidden" }}>
                      {menu}
                    </div>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* ปุ่ม Action */}
          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/admin/harbor">
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      Cancel
                    </Button>
                  </Link>
                  <Button className="create-button" type="primary" htmlType="submit">
                    <Space>
                    <PlusOutlined />
                    <span className="create-button__text">Create Harbor</span>
                    </Space>
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
      )}
    </div>
  );
}

export default HarborCreate;
