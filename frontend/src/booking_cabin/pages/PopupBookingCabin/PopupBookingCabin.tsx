import { useEffect, useState } from 'react';
import { CabinTypeInterface } from '../../interfaces/ICabinType';
import { BookingCabinInterface } from '../../interfaces/IBookingCabin';
import { Button, message } from 'antd';
import './PopupBookingCabin.css';
import { useNavigate } from 'react-router-dom';
import { GetBookingTripByID, GetGuestByID } from '../../../booking_trip/service/https';
import { CreateBookingCabin, GetCabinTypeByID, ListCabins } from '../../service/https';
import { GetCruiseTripById } from '../../../booking_activity/service/https/cruiseTrip';
import { GetUsersById } from '../../../services/https';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PopupBookingCabin(props: any) {
    const { setPopupBookingCabin } = props;

    const [cabintype, setCabinType] = useState<CabinTypeInterface | null>(null);
    // const [bookingtrip, setBookingTrip] = useState<BookingTripInterface | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [note, setNote] = useState("");
    const navigate = useNavigate();

    // ฟังก์ชันปิด Popup
    function closePopupCabin() {
        setPopupBookingCabin(null);
    }

    // ฟังก์ชันดึงข้อมูลผู้จองจาก ID
    async function getGuest() {
        try {
            const guestID = localStorage.getItem("id");
            if (!guestID) {
                message.error('ไม่พบข้อมูลผู้จอง');
                return;
            }

            const res = await GetGuestByID(guestID);
            if (res) {
                console.log(res)
            } else {
                message.error('ไม่พบข้อมูลผู้จอง');
            }
        } catch (error) {
            console.error("Error fetching guest data:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้จอง");
        }
    }

    // ฟังก์ชันดึงข้อมูลผู้จองจาก ID
    async function getCustomer() {
        try {
            const customerID = localStorage.getItem("id");
            console.log("Customer ID:",customerID)
            if (!customerID) {
                message.error('ไม่พบข้อมูลผู้จอง');
                return;
            }

            const res = await GetUsersById(Number(customerID));
            if (res) {
                console.log("customer" + res)
            } else {
                message.error('ไม่พบข้อมูลผู้จอง');
            }
        } catch (error) {
            console.error("Error fetching guest data:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้จอง");
        }
    }

    // ฟังก์ชันดึงข้อมูลประเภทห้องจาก ID
    async function getCabinTypes() {
        try {
            const cabinTypeID = localStorage.getItem("type-id");
            if (!cabinTypeID) {
                message.error('ไม่พบข้อมูลประเภทห้อง');
                return;
            }

            const res = await GetCabinTypeByID(cabinTypeID);
            if (res) {
                setCabinType(res);
            } else {
                message.error('ไม่พบข้อมูลประเภทห้อง');
            }
        } catch (error) {
            console.error("Error fetching cabin type:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูลประเภทห้อง");
        }
    }

    // ฟังก์ชันดึงจำนวนผู้จองจาก BookingTrip
    async function getBookingTrip() {
        try {
            const bookingTripID = localStorage.getItem("booking-trip-id");
            if (!bookingTripID) {
                message.error("ไม่พบ BookingTrip ID");
                return 1;
            }

            const res = await GetBookingTripByID(bookingTripID);
            if (res?.data?.NumberOfGuest) {
                console.log("Number of guest : ", res?.data?.NumberOfGuest)
                return res.data.NumberOfGuest;
            } else {
                message.error("ไม่พบจำนวนผู้จองใน BookingTrip");
                return 1;
            }
        } catch (error) {
            console.error("Error fetching booking trip:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูล BookingTrip");
            return 1;
        }
    }

    // ฟังก์ชันดึงข้อมูลห้องที่ว่างจากฐานข้อมูล
async function getAvailableCabins(selectedCabinTypeID: number, numberOfGuests: number) {
    try {
        // ดึงข้อมูลห้องทั้งหมด
        const response = await ListCabins(); 
        if (!response || !(response.status === 200)) {
            throw new Error('ไม่สามารถดึงข้อมูลห้องได้');
        }

        const cabins = response.data; // ใช้ `.data` หาก API ของคุณมีโครงสร้างแบบนั้น
        if (!cabins || cabins.length === 0) {
            throw new Error('ไม่พบข้อมูลห้องในระบบ');
        }

        // กรองห้องตามเงื่อนไข Capacity และ CabinTypeID
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const availableCabins = cabins.filter((cabin: any) => 
            cabin.StatusID === 7 && // ห้องต้องว่าง (StatusID = 7)
            cabin.Capacity === numberOfGuests && // Capacity ต้องตรงกับจำนวนผู้เข้าพัก
            cabin.CabinTypeID === selectedCabinTypeID // Type ของห้องต้องตรงกับที่เลือก
        );

        return availableCabins; // ส่งคืนห้องที่ว่างตามเงื่อนไข
    } catch (error) {
        console.error("Error fetching available cabins:", error);
        throw error; // ส่งข้อผิดพลาดกลับไปยังจุดที่เรียกใช้งาน
    }
}


    // ฟังก์ชันยืนยันการจองห้อง
    // ฟังก์ชันยืนยันการจองห้อง
async function handleBooking() {
    setIsButtonDisabled(true);

    try {
        const bookingTripID = localStorage.getItem("booking-trip-id");
        if (!bookingTripID) {
            message.error("ไม่พบ BookingTrip ID");
            setIsButtonDisabled(false);
            return;
        }

        const bookingTripRes = await GetBookingTripByID(bookingTripID);
        if (!bookingTripRes?.data) {
            message.error("ไม่สามารถดึงข้อมูล BookingTrip ได้");
            setIsButtonDisabled(false);
            return;
        }

        const { CruiseTripID, NumberOfGuest } = bookingTripRes.data;

        if (!CruiseTripID) {
            message.error("ไม่พบข้อมูล CruiseTrip ที่สัมพันธ์กับ BookingTrip");
            setIsButtonDisabled(false);
            return;
        }

        const cruiseTripRes = await GetCruiseTripById(CruiseTripID);
        if (!cruiseTripRes?.data?.StartDate || !cruiseTripRes?.data?.EndDate) {
            message.error("ไม่สามารถดึงวันที่เริ่มต้นและสิ้นสุดจาก CruiseTrip ได้");
            setIsButtonDisabled(false);
            return;
        }

        const { StartDate, EndDate } = cruiseTripRes.data;

        if (!cabintype?.data?.ID) {
            message.error("ไม่พบข้อมูลประเภทห้องที่เลือก");
            setIsButtonDisabled(false);
            return;
        }

        const availableCabins = await getAvailableCabins(cabintype.data.ID, NumberOfGuest);
        if (!availableCabins || availableCabins.length === 0) {
            message.error("ไม่มีห้องที่ตรงกับเงื่อนไข");
            setIsButtonDisabled(false);
            return;
        }

        // เลือกห้องแบบสุ่มจากห้องที่ผ่านการกรอง
        const randomIndex = Math.floor(Math.random() * availableCabins.length);
        const selectedCabin = availableCabins[randomIndex];

        if (!selectedCabin?.ID) {
            message.error("ไม่สามารถระบุห้องที่ต้องการจองได้");
            setIsButtonDisabled(false);
            return;
        }

        const cabinPrice = cabintype?.data?.CabinPrice || 0;
        const bookingCabinPrice = cabinPrice * NumberOfGuest;
        const bookingTripPrice = bookingTripRes?.data?.BookingTripPrice || 0;

        const data: BookingCabinInterface = {
            CheckIn: StartDate,
            CheckOut: EndDate,
            Note: note,
            BookingCabinPrice: bookingCabinPrice,
            TotalPrice: bookingTripPrice + bookingCabinPrice,
            StatusID: 4,
            BookingTripID: parseInt(bookingTripID),
            CabinID: selectedCabin.ID,
        };

        const res = await CreateBookingCabin(data);
        if (res) {
            message.success("บันทึกข้อมูลสำเร็จ");

            // ส่งข้อมูลไปยังหน้าชำระเงิน
            navigate('/trip-summary', { state: { bookingData: data } });
        } else {
            message.error("เกิดข้อผิดพลาดในการจอง");
        }
    } catch (error) {
        console.error("Error handling booking:", error);
        message.error("เกิดข้อผิดพลาดในการจองห้อง");
    } finally {
        setIsButtonDisabled(false);
    }
}

    

    // ดึงข้อมูลที่จำเป็นเมื่อ component ถูกโหลด
    useEffect(() => {
        getGuest();
        getCustomer();
        getCabinTypes();
        getBookingTrip();
    }, []);

    return (
        <div className="popup-container-cabin" onClick={closePopupCabin}>
            <div className="popup-card-cabin" onClick={(e) => e.stopPropagation()}>
                <div className="detail-box">
                    <span className="title"><h3>ยืนยันการจองห้องพัก</h3></span>
                    <table>
                        <tbody>
                            <tr>
                                <td className="sub-t">ประเภทห้องพัก</td>
                                <td>{cabintype?.data?.TypeName}</td>
                            </tr>
                            <tr>
                                <td className="sub-t">ราคาเริ่มต้น</td>
                                <td>{cabintype?.data?.CabinPrice?.toLocaleString()} บาท</td>
                            </tr>
                            <tr>
                                <td className="sub-t">ขนาดห้องเริ่มต้น</td>
                                <td>{cabintype?.data?.Cabinsize} ตารางฟุต</td>
                            </tr>
                            <tr>
                                <td className='sub-t'>ความต้องการพิเศษ</td>
                                <td><textarea
                                    value={note} // ผูกค่า note กับ textarea
                                    onChange={(e) => setNote(e.target.value)} // อัปเดต note เมื่อมีการกรอกข้อมูล
                                    placeholder="กรุณาระบุความต้องการพิเศษ"
                                    rows={2}
                                    style={{ width: "100%" }}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="btn-box">
                        <Button 
                            className="confirm-btn-cabin"
                            disabled={isButtonDisabled}
                            type="primary"
                            onClick={() => {
                                if (!note.trim()) {
                                    message.error("กรุณากรอกข้อมูลในช่อง ความต้องการพิเศษ");
                                    return;
                                }
                                handleBooking();
                            }}
                        >ยืนยัน</Button>
                        <Button className="cancel-btn-cabin" onClick={closePopupCabin}>ยกเลิก</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupBookingCabin;