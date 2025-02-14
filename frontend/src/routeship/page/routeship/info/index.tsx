import { useState, useEffect } from "react";
import { Table, Col, Row, Divider, message, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetHarborRoutes, GetRoutesById } from "../../../service/http";
import { Harbor_RoutesInterface } from "../../../interface/Harbor_Route";
import { useParams } from "react-router-dom";
import { RoutesInterface } from "../../../interface/Route";
const { Title } = Typography;

import Loader from "../../../../components/third-party/Loader";
import "./index.css";

function RouteShipInfo() {
  const [routes, setRoutes] = useState<Harbor_RoutesInterface[]>([]);
  const [name, setName] = useState<RoutesInterface | null>(null);
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(true);

  const columns: ColumnsType<Harbor_RoutesInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "ท่าเรือ",
      key: "harbor_id",
      render: (item) => Object.values(item.harbor?.harbor_name),
    },
    {
      title: "ประเทศ",
      key: "harbor_id",
      render: (item) => Object.values(item.harbor?.country),
    },
  ];

  const getHarborRoutes = async () => {
    const res = await GetHarborRoutes();
    if (res.status === 200) {
      // Filter routes by route_id matching the id from the URL
      const filteredRoutes = res.data.filter((route: Harbor_RoutesInterface) => route.route_id === parseInt(id));
      setRoutes(filteredRoutes); // Set filtered data
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getRouteById = async () => {
    const res = await GetRoutesById(id); // Fetch route by ID
    if (res.status === 200) {
        setName(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };
  useEffect(() => {
    setIsLoading(true);
    getHarborRoutes(); // Fetch and filter routes when component mounts
    getRouteById();
    setIsLoading(false);
  }, [id]); // Run useEffect when id changes

  return (
    <div>
      {isLoading ? (
        <div className="spinner-review-container">
          <Loader />
        </div>
      ) : (
    <div className="admin-page" style={{ padding: "20px" }}>
    <div>
      {contextHolder}
      <Row justify="space-between">
        <Col>
          <Title>
            {name?.route_name ?` ${name.route_name}` : ''}
          </Title>
        </Col>
      </Row>

      <Divider />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={routes} // Display filtered routes
          style={{ width: "100%", maxWidth: 1200, display: 'flex', flexDirection: 'column' }}
        />
      </div>
    </div>
    </div>
      )}
    </div>
    
  );
}

export default RouteShipInfo;
