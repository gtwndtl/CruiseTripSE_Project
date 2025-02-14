import { DatePicker, Form, message } from "antd";
import { useEffect, useState, useContext } from "react";
import { idBookActivity } from "../index";
import dayjs from "dayjs";
import "../bookActivity.css";
import { ActivityInterface } from "../../../../interfaces/IActivity";
import { GetActivitys } from "../../../../service/https/activity";
import { GetBookActivityById, UpdateBookActivity } from "../../../../service/https/bookActivity";
import { BookActivityInterface } from "../../../../interfaces/IBookActivity";

export default function BookActivityUpdate({ onCancel, onUpdate }: { onCancel: () => void; onUpdate: (updatedData: BookActivityInterface) => void }) {
    const BookActivityId = useContext(idBookActivity);
    const [BookActivity, setBookActivity] = useState<BookActivityInterface>({});
    const [rDate, setRDate] = useState<any>(dayjs());
    const [Activity, setActivitys] = useState<ActivityInterface[]>([]);
    const [input, setInput] = useState({} as BookActivityInterface);

    // Fetch activity data
    async function getBookActivity() {
        const data = await GetBookActivityById(Number(BookActivityId));
        setBookActivity(data);
        setInput(data);
        if (data.Date) setRDate(dayjs(data.Date));
    }

    // Fetch all activities
    useEffect(() => {
        fetchActivitys();
        getBookActivity();
    }, []);

    const fetchActivitys = async () => {
        try {
            const res = await GetActivitys();
            if (res) setActivitys(res);
        } catch (error) {
            console.error("Failed to fetch activities", error);
        }
    };

    // Handle input changes
    const handleInput = (e: any) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // Handle date change
    const handleDateChange = (date: dayjs.Dayjs | null) => {
        setRDate(date);
    };

    // Submit updated data
    const handleSubmit = async () => {
        const updatedValues: BookActivityInterface = {
            ...input,
            ID: Number(BookActivityId),
            Date: rDate ? new Date(rDate.toISOString()) : new Date(),
        };

        console.log("Data to be updated:", updatedValues);

        try {
            const res = await UpdateBookActivity(updatedValues);
            console.log("API Response:", res);

            // ตรวจสอบผลลัพธ์ที่ส่งกลับ
            if (res?.status === true) {
                console.log("Update successful:", res);
                message.success(res.message || "อัปเดตข้อมูลสำเร็จ");
                onUpdate(updatedValues);
                onCancel();
            } else {
                console.error("Update failed:", res?.message || "Unknown error");
                message.error(`ไม่สามารถอัปเดตข้อมูลได้: ${res?.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error occurred during update:", error);
            message.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
        }
    };

    return (
        <>
            <div className="book-activity-update-form-box">
                <div className="updatePopup-top">
                    <label>เเก้ไขข้อมูล</label>
                </div>
                <Form>
                    <label>เลือกกิจกรรม</label>
                    <div className="book-activity-input">
                        <select name="ActivityID" onChange={handleInput} value={input.ActivityID || ""} required>
                            <option value="" disabled hidden>
                                {BookActivity.Activity?.Name || "เลือกกิจกรรม"}
                            </option>
                            {Activity.map((item) => (
                                <option key={item.ID} value={item.ID}>
                                    {item.Name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <label>เลือกวัน</label>
                    <div className="book-activity-input">
                        <DatePicker value={rDate} onChange={handleDateChange} format="YYYY-MM-DD" />
                    </div>

                    <label>เลือกเวลา</label>
                    <div className="book-activity-input">
                        <select name="Time" onChange={handleInput} value={input.Time || ""} required>
                            <option value="" disabled hidden>
                                เลือกเวลา
                            </option>
                            <option value="8.00-10.00">8.00-10.00</option>
                            <option value="10.00-12.00">10.00-12.00</option>
                            <option value="12.00-14.00">12.00-14.00</option>
                            <option value="14.00-16.00">14.00-16.00</option>
                            <option value="16.00-18.00">16.00-18.00</option>
                            <option value="18.00-20.00">18.00-20.00</option>
                            <option value="20.00-22.00">20.00-22.00</option>
                        </select>
                    </div>

                    <label>ระบุจำนวนคน</label>
                    <div className="book-activity-input">
                        <input
                            type="number"
                            min={1}
                            max={10}
                            name="Particnum"
                            value={input.Particnum || ""}
                            onChange={handleInput}
                        />
                    </div>

                    <label>กรอกเบอร์โทร</label>
                    <div className="book-activity-input">
                        <input
                            type="text"
                            name="PhoneNumber"
                            value={input.PhoneNumber || ""}
                            onChange={handleInput}
                        />
                    </div>

                    <label>ระบุความเห็น</label>
                    <div className="book-activity-input">
                        <textarea name="Comment" value={input.Comment || ""} onChange={handleInput} />
                    </div>

                    <div className="book-activity-button">
                        <button className="cancel-button" onClick={onCancel} type="button">
                            ยกเลิก
                        </button>
                        <button className="update-button" onClick={handleSubmit} type="button">
                            ยืนยัน
                        </button>
                    </div>
                </Form>
            </div>
        </>
    );
}
