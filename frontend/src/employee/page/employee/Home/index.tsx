import { useState, useEffect } from "react";
import { Space, Table, Col, Row, Divider, Modal, message, Typography, Avatar, Input, } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetEmployees, GetEmployeesById, DeleteEmployeesById,} from "../../../service/https";
import { EmployeesInterface } from "../../../interface/Employee";
import { useNavigate } from "react-router-dom";

import Loader from "../../../../components/third-party/Loader";

import dayjs from "dayjs";
const { Title } = Typography;

import "./index.css";

const styles = {
  headerTitle: {
    fontSize: '36px',
    fontFamily: 'Kanit, sans-serif',
  },
  addButton: {
    fontSize: '16px',
    backgroundColor: '#003366',
    color: '#fff',
    border: 'none',
    fontFamily: 'Kanit, sans-serif',
    marginBottom: '20px',
  },
  table: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeesInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<EmployeesInterface[]>([]);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [openView, setOpenView] = useState(false);
  const [data, setdata] = useState<EmployeesInterface| null>(null);
  const [isLoading, setIsLoading] = useState(true);



  const columns: ColumnsType<EmployeesInterface> = [
    {
      title: "",
      dataIndex: "picture",
      key: "picture",
      render: (picture) => <Avatar src={picture} className="avatar" />,
    },
    {
      title: "ชื่อ",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "นามสกุล",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "อายุ",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "เพศ",
      key: "gender",
      render: (item) => Object.values(item.gender?.gender),
    },
    {
      title: "เบอร์โทร",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "ตำแหน่ง",
      key: "role",
      render: (record) => <>{record?.role?.role}</>,
    },
    {
      title: "",
      render: (record) => (
      <Space>
        <button 
          className="setting-btn"
          onClick={() => handleView(record.ID)}
        >
          <span className="bar bar1"></span>
          <span className="bar bar2"></span>
          <span className="bar bar1"></span>
          <span className="setting-tooltip">Info</span>
        </button>
        <button className="Btn-edit" onClick={() => navigate(`/admin/employee/edit/${record.ID}`)}>Edit
            <svg className="svg-edit" viewBox="0 0 512 512">
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
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

  const handleView = async (id: number) => {
    try {
      const res = await GetEmployeesById(id);
      if (res.status === 200) {
        setdata(res.data);
        setOpenView(true);
      } else {
        message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      style: { marginTop: 150 },
      title: 'Do you want to delete this account?',
      content: '',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: async () => {
        const res = await DeleteEmployeesById(id);
        if (res) {
          messageApi.open({
            type: "success",
            content: "ลบข้อมูลสำเร็จ",
          });
          getUsers();
        } else {
          messageApi.open({
            type: "error",
            content: "เกิดข้อผิดพลาด !",
          });
        }
      }
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = employees.filter((user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(value) ||
      `${user.email}`.toLowerCase().includes(value) ||
      `${user.phone}`.includes(value)
    );
    setFilteredUsers(filteredData);
  };

  const getUsers = async () => {
    const res = await GetEmployees();
    if (res.status === 200) {
      setEmployees(res.data);
      setFilteredUsers(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getUsers();
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
            <Col span={10}>
            <Space>
              <button type="button" className="employee-create-button" onClick={() => navigate(`/admin/employee/create`)}>
                  <span className="employee-create-button__text">Employee</span>
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
            <Col style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}>
            <Title level={1} style={styles.headerTitle}>Employee</Title>
            </Col>
          </Row>
          <Row>
            <Col span={18}></Col>
            <Col style={{ marginLeft: 58, display: 'flex', alignItems: 'center' }}>
              <Input
                placeholder="ค้นหาด้วย ชื่อ, นามสกุล, อีเมล, เบอร์โทร"
                value={searchText}
                onChange={handleSearch}
                style={{ width: "300px" }}
              />
            </Col>  
          </Row>
      <Divider />

      {/* Modal สำหรับแสดงรายละเอียด */}
      <Modal
  title={
    <h2
      style={{
        textAlign: "center",
        fontFamily: "Kanit, sans-serif",
        fontWeight: "bold",
        fontSize: "36px",
        
        marginBottom: 0,
      }}
    >
      More Info
    </h2>
  }
  open={openView}
  onCancel={() => setOpenView(false)}
  footer={null}
  bodyStyle={{
    padding: "20px 40px",
    backgroundColor: "#f2f2f2",
    borderRadius: "8px",
    
    maxWidth: "800px",
    margin: "0 auto",
  }}
  centered
>
  {data && (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "Kanit, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Avatar
          src={data.picture}
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            marginBottom: "10px",
          }}
        />
        <h3 style={{ margin: 0, fontSize: "20px"}}>
          {data.first_name} {data.last_name}
        </h3>
        <p style={{ margin: 0, fontSize: "14px"}}>
          {data.role?.role}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          alignItems: "center",
        }}
      >
        
        <p><strong>อายุ:</strong> {data.age}</p>
        <p><strong>เบอร์โทร:</strong> {data.phone}</p>
        <p><strong>วันเกิด:</strong> {dayjs(data.BirthDay).format("DD/MM/YYYY")}</p>
        <p><strong>เพศ:</strong> {data.gender?.gender}</p>
        <p><strong>อีเมล:</strong> {data.email}</p>
        <p><strong>เงินเดือน:</strong> {data.salary ? `${data.salary.toFixed(2)} บาท` : "ไม่ระบุ"}</p>
        <p><strong>สถานะ:</strong> {data.stat?.stat}</p>
        <p><strong>ที่อยู่:</strong> {data.Address}</p>
      </div>
    </div>
  )}
      </Modal>

      {/* Modal สำหรับแก้ไขข้อมูล */}

      <div style={styles.table}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={filteredUsers}
          style={{ width: "100%", maxWidth: 1800, display: 'flex', flexDirection: 'column',}}
        />
      </div>
    </div>
      )}
    </div>
  );
}

export default Employees;
