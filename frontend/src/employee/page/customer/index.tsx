  import { useState, useEffect } from "react";
  import { Space, Table, Button, Col, Row, Divider, Modal, message, Typography, Avatar, Input,} from "antd";
  import { EditOutlined, PlusOutlined, DeleteOutlined, InfoOutlined } from "@ant-design/icons";
  import type { ColumnsType } from "antd/es/table";
  import { GetUsers, GetUsersById, DeleteUsersById,} from "../../../services/https/index";
  import { CustomerInterface } from "../../../interfaces/ICustomer";
  import { useNavigate, Link } from "react-router-dom";
  import dayjs from "dayjs";
  const { Title } = Typography;

  const styles = {
    container: {
      width: '80%',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#FFFFFF',
      border: '2px solid #003366',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
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
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: '50%',
    }
  };

  function Customers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<CustomerInterface[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<CustomerInterface[]>([]);
    const [searchText, setSearchText] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const [openView, setOpenView] = useState(false);
    const [data, setdata] = useState<CustomerInterface | null>(null);

    const columns: ColumnsType<CustomerInterface> = [
      {
        title: "",
        dataIndex: "picture",
        key: "picture",
        render: (picture) => <Avatar src={picture} style={styles.avatar} />,
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
        render: (record) => <>{record?.gender?.gender}</>,
      },
      {
        title: "เบอร์โทร",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "",
        render: (record) => (
          <Space>
          <Button
            shape="circle"
            style={{
              border: '1px solid #000000',  // Black border
              backgroundColor: '#ffffff',   // White background
              fontFamily: 'Kanit, sans-serif',
            }}
            type="primary"
            icon={<InfoOutlined style={{ color: '#000000' }} />}  // Black icon color
            onClick={() => handleView(record.ID)}
          >
          </Button>
          <Button
            onClick={() => navigate(`/customer/edit/${record.ID}`)}
            style={{
              border: '2px solid #003366',
              backgroundColor: '#003366',
              color: '#ffffff',
              fontFamily: 'Kanit, sans-serif',
            }}
            type="primary"
            icon={<EditOutlined />}
            size={"large"}
          />
            
              <Button
                style={{
                  border: '2px solid #FF0000',
                  backgroundColor: '#FF0000',
                  color: '#ffffff',
                  fontFamily: 'Kanit, sans-serif',
                }}
                icon={<DeleteOutlined />}
                size={"large"}
                onClick={() => handleDelete(record.ID)}
                danger
              >   
              </Button>
            
          </Space>
        ),
      },
    ];

    const handleView = async (ID: number) => {
      try {
        setdata(null);
        const res = await GetUsersById(ID);
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

    const handleDelete = (ID: number) => {
      Modal.confirm({
        style: { marginTop: 150 },
        title: 'Do you want to delete this account?',
        content: '',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'No, Cancel',
        onOk: async () => {
          const res = await DeleteUsersById(ID);
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
      const filteredData = users.filter((user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(value) ||
        `${user.email}`.toLowerCase().includes(value) ||
        `${user.phone}`.includes(value)
      );
      setFilteredUsers(filteredData);
    };

    const getUsers = async () => {
      const res = await GetUsers();
      if (res.status === 200) {
        setUsers(res.data);
        setFilteredUsers(res.data);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    };

    

    useEffect(() => {
      getUsers();
    }, []);

    return (
      <div>
        {contextHolder}
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={1} style={styles.headerTitle}>Customer</Title>
            </Col>
            <Col style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}>
              <Space>
                <Link to="/customer/create">
                  <Button type="primary" icon={<PlusOutlined />}>
                    สร้างข้อมูล
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
          <Row>
            <Col>
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
    title=<h2>รายละเอียดผู้ใช้</h2>
    open={openView}
    onCancel= {() => setOpenView(false)}
    footer={null}
    bodyStyle={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
          }}
        >
          {data && (
            <div style={{  marginRight: '40px' }}>
              <Avatar src={data.picture} style={{ width: 100, height: 100, borderRadius: '50%' }} />
              <p><strong>ชื่อ:</strong> {data.first_name} {data.last_name}</p>
              <p><strong>อีเมล:</strong> {data.email}</p>
              <p><strong>เบอร์โทร:</strong> {data.phone}</p>
              <p><strong>อายุ:</strong> {data.age}</p>
              <p><strong>เพศ:</strong> {data.gender?.gender}</p>
              <p><strong>วันเกิด:</strong> {dayjs(data.birthday).format('DD/MM/YYYY')}</p>
            </div>
          )}
        </Modal>

        <div style={styles.table}>
          <Table
            rowKey="ID"
            columns={columns}
            dataSource={filteredUsers}
            style={{ width: "100%", maxWidth: 1200, display: 'flex', flexDirection: 'column',}}
          />
        </div>
      </div>
    );
  }

  export default Customers;
