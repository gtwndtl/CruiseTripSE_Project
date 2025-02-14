import { useState, useEffect } from "react";
import { Table, Col, Row, message, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { BookingCabinInterface } from "../interfaces/IBookingCabin";
import { CabinInterface } from "../interfaces/ICabin";
import { CabinTypeInterface } from "../interfaces/ICabinType";
import { BookingTripInterface } from "../../booking_trip/interfaces/IBookingTrip";
import { CruiseTripInterface } from "../../booking_activity/interfaces/ICruiseTrip";
import { StatsInterface } from "../../employee/interface/Status";
import { GetBookingTripByCustomerID, UpdateBookingTripByID } from "../../booking_trip/service/https";
import { GetBookingCabinByBookingTripID, ListCabins, ListCabinTypes, UpdateBookingCabinByID } from "../service/https";
import Header from "../../booking_trip/components/Header";
import { GetStatus } from "../../employee/service/https";
import { GetCruiseTrips } from "../../booking_activity/service/https/cruiseTrip";

function ShowBookingTrips() {
  const [bookingTrips, setBookingTrips] = useState<BookingTripInterface[]>([]);
  const [cruiseTrips, setCruiseTrips] = useState<CruiseTripInterface[]>([]);
  const [bookingStatus, setBookingStatus] = useState<StatsInterface[]>([]);
  const [bookingCabins, setBookingCabins] = useState<BookingCabinInterface[]>([]);
  const [cabins, setCabins] = useState<CabinInterface[]>([]);
  const [cabinTypes, setCabinTypes] = useState<CabinTypeInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<BookingTripInterface> = [
    {
      title: "ลำดับ",
      key: "index",
      render: (_: number, __: BookingTripInterface, index: number) => index + 1,  // เพิ่มคอลัมน์ลำดับที่นี่
    },
    {
      title: "ชื่อทริป",
      dataIndex: "CruiseTripID",
      key: "cruise_trip",
      render: (cruiseTripID: number) => {
        const cruiseTrip = cruiseTrips.find((trip) => trip.ID === cruiseTripID);
        return cruiseTrip ? cruiseTrip.CruiseTripName : "ไม่พบข้อมูล";
      },
    },
    {
      title: "วันที่เดินทาง",
      key: "travel_dates",
      render: (record) => {
        const cruiseTrip = cruiseTrips.find((trip) => trip.ID === record.CruiseTripID);
        return cruiseTrip
          ? `${dayjs(cruiseTrip.StartDate).format("DD/MM/YYYY")} - ${dayjs(
              cruiseTrip.EndDate
            ).format("DD/MM/YYYY")}`
          : "ไม่พบข้อมูล";
      },
    },
    {
      title: "ราคารวม",
      key: "total_price",
      render: (record) => {
        // ค้นหาห้องที่เกี่ยวข้องกับ BookingTrip ปัจจุบัน
        const relatedCabins = bookingCabins.filter(
          (cabin) => cabin.BookingTripID === record.ID
        );
    
        // คำนวณผลรวมของ TotalPrice จากห้องทั้งหมด
        const totalCabinPrice = relatedCabins.reduce((sum, cabin) => sum + (cabin.TotalPrice || 0), 0);
    
        // แสดงผลราคารวมจาก TotalPrice ของห้อง
        return totalCabinPrice.toLocaleString("th-TH", {
          style: "currency",
          currency: "THB",
          minimumFractionDigits: 2,
        });
      },
    },    
    {
      title: "เลขห้อง",
      key: "cabin_number",
      render: (record) => {
        const relatedCabins = bookingCabins.filter(
          (cabin) => cabin.BookingTripID === record.ID
        );
        return relatedCabins.length > 0 ? (
          relatedCabins.map((cabin) => {
            const cabinInfo = cabins.find((c) => c.ID === cabin.CabinID);
            return <div key={cabin.ID}>{cabinInfo?.CabinNumber || "ไม่พบข้อมูล"}</div>;
          })
        ) : (
          "ไม่มีข้อมูลห้อง"
        );
      },
    },
    {
      title: "ประเภทห้อง",
      key: "type_name",
      render: (record) => {
        // ค้นหาห้องที่เกี่ยวข้องกับ BookingTrip ปัจจุบัน
        const relatedCabins = bookingCabins.filter(
          (cabin) => cabin.BookingTripID === record.ID
        );
    
        return relatedCabins.length > 0 ? (
          relatedCabins.map((cabin) => {
            // ค้นหาข้อมูลห้องจาก CabinID ใน BookingCabin
            const cabinInfo = cabins.find((c) => c.ID === cabin.CabinID);
            
            if (cabinInfo) {
              // ค้นหาประเภทห้องจาก CabinTypeID ที่อยู่ใน CabinInfo
              const cabinType = cabinTypes.find((type) => type.ID === cabinInfo.CabinTypeID);
              console.log("cabintype", cabinType)
              return (
                <div key={cabin.ID}>
                  {cabinType ? cabinType.TypeName : "ไม่พบประเภทห้อง"}
                </div>
              );
            }
            return null; // ถ้าไม่พบข้อมูลห้อง
          })
        ) : (
          "ไม่มีข้อมูลห้อง"
        );
      },
    },
    {
      title: "สถานะ",
      dataIndex: "StatusID",
      key: "status",
      render: (id: number) => {
        const status = bookingStatus.find((status) => status.ID === id);
        return status ? status.stat : "ไม่พบข้อมูล";
      },
    },
    {
      title: "",
      render: (record) => {
        if (record.StatusID === 6) {
          return null;
        }
        return (
          <Button
            style={{ backgroundColor: "#133e87" }}
            type="primary"
            onClick={() => handleCancelBooking(record.ID.toString())}
          >
            ยกเลิก
          </Button>
        );
      },
    },
  ];
  

  const getBookingTripByCustomerID = async () => {
    const res = await GetBookingTripByCustomerID(myId);
    if (res.status === 200) {
      setBookingTrips(res.data);
      fetchRelatedCabins(res.data.map((trip: BookingTripInterface) => trip.ID));
    } else {
      setBookingTrips([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const fetchRelatedCabins = async (tripIds: number[]) => {
    const allCabins: BookingCabinInterface[] = [];
    for (const id of tripIds) {
      const res = await GetBookingCabinByBookingTripID(id.toString());
      if (res.status === 200 && res.data) {
        allCabins.push(...res.data);
      }
    }
    setBookingCabins(allCabins);
  };

  const getCruiseTrips = async () => {
    const res = await GetCruiseTrips();
    if (res.status === 200) {
      setCruiseTrips(res.data);
    } else {
      setCruiseTrips([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getBookingStatuses = async () => {
    const res = await GetStatus();
    if (res.status === 200) {
      setBookingStatus(res.data);
    } else {
      setBookingStatus([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getCabins = async () => {
    const res = await ListCabins();
    if (res.status === 200) {
      setCabins(res.data);
    } else {
      setCabins([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getCabinTypes = async () => {
    const res = await ListCabinTypes();
    if (res.status === 200) {
      setCabinTypes(res.data);
    } else {
      setCabinTypes([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const handleCancelBooking = async (bookingID: string) => {
    const bookingTrip = bookingTrips.find((trip) => trip.ID === Number(bookingID));
    if (!bookingTrip) {
      messageApi.open({ type: "error", content: "ไม่พบข้อมูลการจอง" });
      return;
    }

    const updatedTrip = { ...bookingTrip, StatusID: 6 };
    const tripRes = await UpdateBookingTripByID(bookingID, updatedTrip);

    if (tripRes.status === 200) {
      const relatedCabins = bookingCabins.filter((cabin) => cabin.BookingTripID === bookingTrip.ID);
      for (const cabin of relatedCabins) {
        const updatedCabin = { ...cabin, StatusID: 6 };
        await UpdateBookingCabinByID((cabin.ID || "").toString(), updatedCabin);
      }
      messageApi.open({ type: "success", content: "ยกเลิกการจองสำเร็จ" });
      getBookingTripByCustomerID(); // รีเฟรชข้อมูล
    } else {
      messageApi.open({ type: "error", content: tripRes.data.error });
    }
  };

  useEffect(() => {
    getBookingTripByCustomerID();
    getCruiseTrips();
    getBookingStatuses();
    getCabins();
    getCabinTypes();
  }, []);

  return (
    <>
      <Header />
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2 style={{ marginTop: "100px", padding: "20px" }}>ข้อมูลการจอง</h2>
        </Col>
      </Row>
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={bookingTrips}
          style={{ width: "100%", overflow: "none" }}
        />
      </div>
    </>
  );
}

export default ShowBookingTrips;