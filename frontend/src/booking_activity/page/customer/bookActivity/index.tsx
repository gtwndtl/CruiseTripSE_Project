import { Link, useNavigate } from "react-router-dom"
import { Popconfirm, message } from "antd"
import { useEffect, useState, createContext } from "react"
import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Scrollbar } from "swiper/modules";
import "./bookActivity.css"
// import "swiper/css";
// import 'swiper/css/scrollbar';
import { ActivityInterface } from "../../../interfaces/IActivity"
import { BookActivityInterface } from "../../../interfaces/IBookActivity"
import { DeleteBookActivityByID, GetAllBookActivityByCustomerId } from "../../../service/https/bookActivity"
import { GetActivitys } from "../../../service/https/activity";
import BookActivityUpdate from "./EditBookActivity";
import ship1 from "../../../assets/ship1.jpg"

export const idBookActivity = createContext(0);

export default function BookActivity() {
  const [messageApi, contextHolder] = message.useMessage();
  const [updateClick, setupdateClick] = useState(false);
  const [BookActivity, setBookActivity] = useState<BookActivityInterface[]>([])
  const [Activitys, setActivitys] = useState<ActivityInterface[]>([])
  const [BookActivityID, setBookActivityID] = useState(0);
  // const CustomerID = localStorage.getItem("CustomerID");
  const CustomerID = 1
  let navigate = useNavigate();
  
  async function GetBookActivitys() {
    setBookActivity(await GetAllBookActivityByCustomerId(Number(CustomerID)))
  }

 

  const fetchActivitys = async () => {
    try {
      const res = await GetActivitys();
      if (res) {
        console.log("Activities data:", res); // ตรวจสอบข้อมูล
        setActivitys(res);
      }
    } catch (error) {
      console.error("Failed to fetch activities", error);
    }
  };
  
  

  async function DeleteBookActivity(id: number | undefined) {
    let res = await DeleteBookActivityByID(id);
    if (!res.status) {
      messageApi.open({
        type: "success",
        content: "ลบการจองเเล้ว",
      });
      setTimeout(function () {
        GetBookActivitys();
      }, 100);
    }
  }

  const cancel = () => {
    message.error('Click on No');
  };

  useEffect(() => {
    GetBookActivitys();
    fetchActivitys(); // เพิ่มการเรียกใช้งานฟังก์ชัน
  }, []);

  const handleCancel = () => {
    setupdateClick(!updateClick);
  }

  return (
    <>
      <idBookActivity.Provider value={BookActivityID}>
        <div className="book-activity-bg" style={{ backgroundImage: `url(${ship1})` }}>
          {contextHolder}
          <div className="book-activity-display">
            <div className="book-activity-item-box">
            <Swiper
  slidesPerView={4} // กำหนดจำนวนคอลัมน์ที่ต้องการแสดง
  spaceBetween={20} // ระยะห่างระหว่างคอลัมน์
  modules={[Scrollbar, A11y]} // ใช้โมดูล Scrollbar และ Accessibility
  scrollbar={{ draggable: true }} // Scrollbar ที่ลากได้
>
  {Activitys.map((item) => {
    const base64String = item.ActivityImg || "";
    const imageSrc = base64String.startsWith("data:image/")
      ? base64String
      : `data:image/jpeg;base64,${base64String}`;

    return (
      <SwiperSlide key={item.ID}>
        <div
          className="book-activity-item"
          onClick={() => {
            if (item.ID !== undefined) {
              navigate("bookActivityCreate", { state: item.ID });
            }
          }}
        >
          <img src={imageSrc} alt="ActivityImg" />
          <label>{item.Name || "ไม่มีชื่อกิจกรรม"}</label>
        </div>
      </SwiperSlide>
    );
  })}
</Swiper>


            </div>
          </div>
          <div className="book-activity-list-box">
              <div className="book-activity-list-box-top">
                <h1>จองกิจกรรม</h1>
                <Link to="bookActivityCreate">
                  <button className="activity-button">
                    <FontAwesomeIcon icon={faPlus} className="icon"/>
                    <label>เพิ่มการจองกิจกรรม</label>
                  </button>
                </Link>
              </div>
              <div className="card-box">
                <div className="card">
                {BookActivity.map((item) => {
                  const base64String = item.Activity?.ActivityImg || "";
                  const imageSrc = base64String.startsWith("data:image/")
                      ? base64String
                      : `data:image/jpeg;base64,${base64String}`;

                  return (
                    <div key={item.ID} className="information">
                        <img
                          src={imageSrc}
                          alt="ActivityImg"
                        />
                        <div><label>กิจกรรม :</label> {item.Activity?.Name}</div>
                        <div><label>วันที่ :</label> {new Date(item.Date!).toLocaleDateString()}</div>
                        <div><label>เวลา :</label> {item.Time}</div>
                        <div><label>จำนวนคน :</label> {item.Particnum}</div>
                        <div><label>เบอร์โทร :</label> {item.PhoneNumber}</div>
                        <div><label>หมายเหตุ :</label> {item.Comment}</div>
                        <div className="button">
                          <button className="submit-button" 
                            onClick={() => {
                              if(item.ID !== undefined){
                                setupdateClick(!updateClick);
                                setBookActivityID(item.ID);
                              }
                            }}>
                            <FontAwesomeIcon icon={faPenToSquare} className="icon"/>
                            <label>เเก้ไข</label>
                          </button>
                          {updateClick && 
                            <div className="updatePopup">
                              <div className="update-form">
                              <BookActivityUpdate
                                onCancel={handleCancel}
                                onUpdate={(updatedActivity: BookActivityInterface) => {
                                  // อัปเดต State ของ BookActivity
                                  setBookActivity((prev) =>
                                    prev.map((activity) =>
                                      activity.ID === updatedActivity.ID ? updatedActivity : activity
                                    )
                                  );
                                  setupdateClick(false); // ปิดฟอร์ม
                                }}
                              />

                              </div>
                            </div>}
                            <Popconfirm
                              title="ลบการจอง"
                              description="คุณต้องการที่จะลบรายการนี้ใช่มั้ย"
                              onConfirm={() => DeleteBookActivity(item.ID)}
                              onCancel={cancel} // เรียกฟังก์ชัน cancel ได้ถูกต้อง
                              okText="Yes"
                              cancelText="No"
                            >

                            <button className="delete-button">
                              <FontAwesomeIcon icon={faTrashCan} className="icon" />
                              <label>ลบ</label>
                            </button>
                          </Popconfirm>
                        </div>
                    </div>
                  );
                })}

                </div>
              </div>
          </div>
        </div>
      </idBookActivity.Provider>
    </>
  )
}