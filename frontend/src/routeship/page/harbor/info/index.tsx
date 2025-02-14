import { useState, useEffect } from "react";
import { Space, Table, Col, Row, Divider, Modal, message, Typography, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetHarbors, DeleteHarborsById, GetHarborsById, UpdateHarborsById } from "../../../service/http";
import { HarborsInterface } from "../../../interface/Harbor";
import { useNavigate  } from "react-router-dom";
const { Title } = Typography;
import Loader from "../../../../components/third-party/Loader";
import './index.css';

const styles = {
  headerTitle: {
    fontSize: "36px",
    fontFamily: "Kanit, sans-serif",
  },
  table: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

function Harbor() {
  const navigate = useNavigate();
  const [harbor, setHarbors] = useState<HarborsInterface[]>([]);
  const [filteredHarbors, setFilteredHarbors] = useState<HarborsInterface[]>([]); // Store filtered harbors
  const [searchText, setSearchText] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingHarbor, setEditingHarbor] = useState<HarborsInterface | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);

  const columns: ColumnsType<HarborsInterface> = [
    {
      title: "ท่าเรือ",
      dataIndex: "harbor_name",
      key: "harbor_name",
    },
    {
      title: "ประเทศ",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "",
      render: (record) => (
        <Space style={{ justifyContent: "flex-end", width: "100%" }}>
            <button className="Btn-edit" onClick={() => openEditModal(record.ID)}>Edit
            <svg className="svg-edit" viewBox="0 0 512 512">
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
          </button>
          <button className="delete-Button" onClick={() => openDeleteModal(record)}>
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

  const openEditModal = async (id: number) => {
    const res = await GetHarborsById(id);
    if (res.status === 200) {
      setEditingHarbor(res.data);
      form.setFieldsValue(res.data);
      setEditModalVisible(true);
    } else {
      messageApi.error("Failed to fetch harbor details.");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const res = await UpdateHarborsById(editingHarbor?.ID!, values);
      if (res.status === 200) {
        messageApi.success("Updated successfully!");
        setEditModalVisible(false);
        getHarbors();
      } else {
        messageApi.error("Update failed.");
      }
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  };

  const openDeleteModal = (id: number) => {
    Modal.confirm({
      style: { marginTop: 150 },
      title: "Do you want to delete this harbor?",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        const res = await DeleteHarborsById(id);
        if (res) {
          messageApi.success("Deleted successfully!");
          getHarbors();
        } else {
          messageApi.error("Failed to delete.");
        }
      },
    });
  };

  const getHarbors = async () => {
    const res = await GetHarbors();
    if (res.status === 200) {
      setHarbors(res.data);
      setFilteredHarbors(res.data); // Initially set filtered harbors to all fetched data
    } else {
      messageApi.error(res.data.error);
    }
  };

  // Handle search for harbor name and country
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = harbor.filter((harbor) =>
        `${harbor.harbor_name}`.toLowerCase().includes(value) ||
        `${harbor.country}`.toLowerCase().includes(value)
    );
    setFilteredHarbors(filtered);
  };

  useEffect(() => {
    setIsLoading(true);
    getHarbors();
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
      <Row justify="space-between" align="middle">
        <Col span={12}>
        <Space>
              <button type="button" className="employee-create-button" onClick={() => navigate(`/admin/harbor/create`)}>
                  <span className="employee-create-button__text">Harbor</span>
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
          </Space>
        </Col>
        <Col style={{ marginRight: 20, display: "flex", alignItems: "center" }}>
        <Title level={1} style={styles.headerTitle}>
            Harbor
          </Title>
        </Col>
      </Row>
      {/* Search Form */}
      <Row>
        <Col span={18}></Col>
        <Col style={{ marginLeft: 58, display: 'flex', alignItems: 'center' }}>
          <Input
            placeholder="ค้นหาด้วย ชื่อท่าเรือ, ประเทศ"
            value={searchText}
            onChange={handleSearch}
            style={{ width: "300px" }}
          />
        </Col>  
      </Row>

      <Divider />

      <div style={styles.table}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={filteredHarbors} // Show filtered data
          style={{ width: "100%", maxWidth: 900, display: "flex", marginLeft: "10", flexDirection: "column" }}
        />
      </div>

      <Modal
        title="Edit Harbor"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdate}
        okText="Save"
        style={{ top: 200 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="harbor_name" label="Harbor Name" rules={[{ required: true, message: "Please enter harbor name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country" rules={[{ required: true, message: "Please enter country" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
      )}
    </div>
  );
}

export default Harbor;
