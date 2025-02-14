import { useState, useEffect } from "react";
import { Space, Table, Col, Row, Divider, Modal, message, Typography, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetRoutes, DeleteHarborRoutesById } from "../../../service/http";
import { RoutesInterface } from "../../../interface/Route";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

import Loader from "../../../../components/third-party/Loader";
import "./index.css";

function RouteShip() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<RoutesInterface[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<RoutesInterface[]>([]); // State to hold filtered routes
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const [isLoading, setIsLoading] = useState(true);

  const columns: ColumnsType<RoutesInterface> = [
    {
      title: "เส้นทาง",
      dataIndex: "route_name",
      key: "route_name",
    },
    {
      title: "สภาพอากาศ",
      key: "weather",
      render: (item) => Object.values(item.weather?.weather),
    },
    {
      title: "",
      render: (record) => (
        <Space>
          <button 
          className="setting-btn"
          onClick={() => navigate(`/admin/routeship/info/${record.ID}`)}
          >
          <span className="bar bar1"></span>
          <span className="bar bar2"></span>
          <span className="bar bar1"></span>
          <span className="setting-tooltip">Info</span>
        </button>
        <button className="delete-Button" onClick={() => handleDelete(record.ID)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 50 59"
            className="delete-bin"
          >
            <path
              fill="#B5BAC1"
              d="M0 7.5C0 5.01472 2.01472 3 4.5 3H45.5C47.9853 3 50 5.01472 50 7.5V7.5C50 8.32843 49.3284 9 48.5 9H1.5C0.671571 9 0 8.32843 0 7.5V7.5Z"
            ></path>
            <path
              fill="#B5BAC1"
              d="M17 3C17 1.34315 18.3431 0 20 0H29.3125C30.9694 0 32.3125 1.34315 32.3125 3V3H17V3Z"
            ></path>
            <path
              fill="#B5BAC1"
              d="M2.18565 18.0974C2.08466 15.821 3.903 13.9202 6.18172 13.9202H43.8189C46.0976 13.9202 47.916 15.821 47.815 18.0975L46.1699 55.1775C46.0751 57.3155 44.314 59.0002 42.1739 59.0002H7.8268C5.68661 59.0002 3.92559 57.3155 3.83073 55.1775L2.18565 18.0974ZM18.0003 49.5402C16.6196 49.5402 15.5003 48.4209 15.5003 47.0402V24.9602C15.5003 23.5795 16.6196 22.4602 18.0003 22.4602C19.381 22.4602 20.5003 23.5795 20.5003 24.9602V47.0402C20.5003 48.4209 19.381 49.5402 18.0003 49.5402ZM29.5003 47.0402C29.5003 48.4209 30.6196 49.5402 32.0003 49.5402C33.381 49.5402 34.5003 48.4209 34.5003 47.0402V24.9602C34.5003 23.5795 33.381 22.4602 32.0003 22.4602C30.6196 22.4602 29.5003 23.5795 29.5003 24.9602V47.0402Z"
              clip-rule="evenodd"
              fill-rule="evenodd"
            ></path>
            <path fill="#B5BAC1" d="M2 13H48L47.6742 21.28H2.32031L2 13Z"></path>
          </svg>
          <span className="delete-tooltip">Delete</span>
        </button>         
        </Space>
      ),
    },
  ];

  const handleDelete = (id: number) => {
    Modal.confirm({
      style: { marginTop: 150 },
      title: 'Do you want to delete this Route?',
      content: '',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: async () => {
        const res = await DeleteHarborRoutesById(id);
        if (res) {
          messageApi.open({
            type: "success",
            content: "ลบข้อมูลสำเร็จ",
          });
          getRoutes();
        } else {
          messageApi.open({
            type: "error",
            content: "เกิดข้อผิดพลาด !",
          });
        }
      }
    });
  };

  const getRoutes = async () => {
    const res = await GetRoutes();
    if (res.status === 200) {
      setRoutes(res.data);
      setFilteredRoutes(res.data); // Initially set filtered routes to all fetched routes
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  // Handle search and filter routes in real-time
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchText(searchTerm);
    const filtered = routes.filter((route) =>
      `${route.route_name}`.toLowerCase().includes(searchTerm)
    );
    setFilteredRoutes(filtered);
  };

  useEffect(() => {
    setIsLoading(true);
    getRoutes();
    setIsLoading(false);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="spinner-review-container">
          <Loader />
        </div>
      ) : (
    <div className="admin-page" style={{ padding: "20px" }}>
      {contextHolder}
      <Row justify="space-between">
        <Col span={12}>
        <button type="button" className="employee-create-button" onClick={() => navigate(`/admin/routeship/create`)}>
                  <span className="employee-create-button__text">Route</span>
                  <span className="employee-create-button__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke="currentColor"
                      height="24"
                      fill="none"
                      className="svg"
                    >
                      <line y2="19" y1="5" x2="12" x1="12"></line>
                      <line y2="12" y1="12" x2="19" x1="5"></line>
                    </svg>
                  </span>
                </button>
        </Col>
        <Col style={{ marginRight: 20, display: 'flex', alignItems: 'center'  }}>
          <Title level={1} style={{ fontSize: '36px', fontFamily: 'Kanit, sans-serif'}}>
            Route Ship
          </Title>
        </Col>
      </Row>
      <Row>
      <Col span={20}>
          <button className="harbor-button" onClick={() => navigate(`/admin/harbor`)}>
            <svg className="svgIcon" viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg>
            Harbor
          </button>
      </Col>
      <Col style={{ marginLeft: 1, display: 'flex', alignItems: 'center' }}>
          <Input
            placeholder="ค้นหาเส้นทาง"
            value={searchText}
            onChange={handleSearch} // Use onChange instead of onSearch
            style={{ width: "300px" }}
          />
        </Col>
      </Row>

      <Divider />

      {/* Search bar for filtering routes */}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={filteredRoutes} // Show filtered routes
          style={{ width: "100%", maxWidth: 1200, display: 'flex', flexDirection: 'column' }}
        />
      </div>
    </div>
      )}
    </div>
  );
}

export default RouteShip;
