import { Space, Button, Col, Row, Divider, Form, Input, Card, message, Select } from "antd";
import { PlusOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreateRoute, GetWeather, CreateHarborRoute, GetHarbors } from "../../../service/http";
import { WeathersInterface } from "../../../interface/Weather";
import { HarborsInterface } from "../../../interface/Harbor";
import Loader from "../../../../components/third-party/Loader";
import "./index.css";

function RouteShipCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [weather, setWeather] = useState<WeathersInterface[]>([]);
  const [harbors, setHarbors] = useState<HarborsInterface[]>([]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลสภาพอากาศ
  const onGetWeather = async () => {
    let res = await GetWeather();
    if (res.status === 200) {
      setWeather(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลอากาศ",
      });
      setTimeout(() => {
        navigate("/admin/routeship");
      }, 2000);
    }
  };

  // ฟังก์ชันดึงข้อมูลท่าเรือ
  const onGetHarbor = async () => {
    let res = await GetHarbors();
    if (res.status === 200) {
      setHarbors(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลท่าเรือ",
      });
      setTimeout(() => {
        navigate("/admin/routeship");
      }, 2000);
    }
  };

  // เรียกข้อมูลตอนที่โหลดคอมโพเนนต์
  useEffect(() => {
    setIsLoading(true);
    onGetWeather();
    onGetHarbor();
    setIsLoading(false);
  }, []);

  // ฟังก์ชันเมื่อกด "ยืนยัน"
  const onFinish = async (values: any) => {
    const routePayload = { route_name: values.route_name, weather_id: values.weather_id };
  
    try {
      // สร้างเส้นทาง
      const routeRes = await CreateRoute(routePayload);
      console.log('CreateRoute response:', routeRes); // ตรวจสอบข้อมูลจาก response
  
      if (routeRes.status === 201) {
        const route_id = routeRes.data?.data?.ID; // เข้าถึง route_id ที่ถูกต้อง
        console.log('Route ID:', route_id); // ตรวจสอบค่าของ route_id
  
        if (route_id) {
          // ถ้ามี route_id ให้ส่งไปสร้าง HarborRoute
          const harborPayload = { route_id, harbors: values.harbors };
          console.log('Payload for Harbor Route:', harborPayload); // ตรวจสอบ payload ก่อนส่ง
          const harborRes = await CreateHarborRoute(harborPayload);
  
          if (harborRes.status === 201) {
            messageApi.open({ type: "success", content: "สร้างเส้นทางและท่าเรือสำเร็จ!" });
            setTimeout(() => {
              navigate("/admin/routeship");
            }, 2000);
          } else {
            messageApi.open({
              type: "error",
              content: harborRes.data.error || "ไม่สามารถสร้างเส้นทางและท่าเรือได้!",
            });
          }
        } else {
          messageApi.open({ type: "error", content: "ไม่พบข้อมูล route_id!" });
        }
      } else {
        messageApi.open({ type: "error", content: routeRes.data?.error || "ไม่สามารถสร้างเส้นทางได้!" });
      }
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดขณะสร้างเส้นทางหรือท่าเรือ",
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
    <div className="card-container" style={{ height: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {contextHolder}
      <Card style={{ width: "100%", maxWidth: 800 }}>
        <b><h2>Create Route and Harbor Route</h2></b>
        <Divider />
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* ชื่อเส้นทาง */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ชื่อเส้นทาง"
                name="route_name"
                rules={[{ required: true, message: "กรุณากรอกชื่อเส้นทาง!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* สภาพอากาศ */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="สภาพอากาศ"
                name="weather_id"
                rules={[{ required: true, message: "กรุณาเลือกสภาพอากาศ!" }]}
              >
                <Select allowClear>
                  {weather?.map((item) => (
                    <Select.Option key={item.ID} value={item.ID}>
                      {item.weather}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* การเลือกท่าเรือ */}
          <Form.List
            name="harbors"
            rules={[{ validator: async (_, harbors) => { if (!harbors || harbors.length < 1) { return Promise.reject(new Error('กรุณาเพิ่มท่าเรืออย่างน้อยหนึ่งแห่ง!')); } } }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => {
                  const validKey: React.Key = key !== undefined ? key : index;
                  return (
                    <div key={validKey}>
                      <Row gutter={16} align="middle">
                        <Col span={20}>
                          <Form.Item
                            {...restField}
                            name={[name ?? index]}
                            rules={[{ required: true, message: `กรุณาเลือกท่าเรือสำหรับระดับ ${index + 1}` }]}
                          >
                            <Select placeholder={`เลือกท่าเรือสำหรับระดับ ${index + 1}`}>
                              {harbors.map((harbor) => (
                                <Select.Option key={harbor.ID} value={harbor.ID}>
                                  {harbor.harbor_name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          {fields.length > 1 && (
                            <Button
                              type="dashed"
                              danger
                              icon={<EnvironmentOutlined />}
                              onClick={() => remove(name ?? index)}
                            />
                          )}
                        </Col>
                      </Row>
                    </div>
                  );
                })}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    เพิ่มท่าเรือ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          {/* ปุ่มส่งฟอร์ม */}
          <Divider />
          <Form.Item>
            <Row justify="end">
              <Space>
                <Button onClick={() => navigate("/admin/routeship")} style={{ marginRight: "10px" }}>
                  ยกเลิก
                </Button>
                <Button className="create-button" type="primary" htmlType="submit" >
                  <Space>
                    <PlusOutlined />
                    <span className="create-button__text">สร้างเส้นทาง</span>
                  </Space>
                </Button>
              </Space>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </div>
    )}
    </div>
  );

}

export default RouteShipCreate;
