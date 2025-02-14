import { Link, useLocation, useNavigate } from "react-router-dom";
import { DatePicker, Form } from "antd";
import { useEffect, useState } from "react";
import ship1 from "../../../../assets/ship1.jpg";
import dayjs from "dayjs";
import "../bookActivity.css";
import { BookActivityInterface } from "../../../../interfaces/IBookActivity";
import { CreateBookActivity } from "../../../../service/https/bookActivity";
import { ActivityInterface } from "../../../../interfaces/IActivity";
import { GetActivityById, GetActivitys } from "../../../../service/https/activity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BookActivityCreate() {
    let navigate = useNavigate();
    const { state } = useLocation();
    const [rDate, setRDate] = useState<any>(dayjs());
    const [Activity, setActivity] = useState<ActivityInterface>();
    const [AllActivity, setAllActivity] = useState<ActivityInterface[]>([]);
    const [input, setInput] = useState({} as BookActivityInterface);

    async function getActivity() {
        setAllActivity(await GetActivitys());
        if (state !== null) {
            setActivity(await GetActivityById(state));
        }
    }

    const handleDateChange = (date: dayjs.Dayjs | null, dateString: string | string[]) => {
        setRDate(date);
    };

    const handleInput = (e: any) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
        console.log(input);
    };

    const handleSubmit = async () => {
        input.Activity = input.Activity === undefined ? state : input.Activity;
        let createValues: BookActivityInterface = {
            Date: new Date(rDate),
            Time: input.Time,
            Particnum: Number(input.Particnum),
            Comment: input.Comment,
            PhoneNumber: input.PhoneNumber,
            BookingTripID: 1,
            ActivityID: Number(input.Activity),
            CustomersID: 1,
        };
        console.log("Creating data:", createValues);

        let res = await CreateBookActivity(createValues);
        if (res.status) {
            toast.success("บันทึกข้อมูลสำเร็จ");
            setTimeout(() => {
                navigate("/bookActivity");
            }, 1000);
        } else {
            toast.error(res.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    useEffect(() => {
        getActivity();
    }, []);

    return (
        <>
            <div className="login-bg" style={{ backgroundImage: `url(${ship1})` }}>
                <ToastContainer />
                <h1>จองกิจกรรม</h1>
                <div className="book-activity-form-box">
                    <Form>
                        <label>เลือกกิจกรรม</label>
                        <div className="book-activity-input">
                            <select name="Activity" onChange={handleInput} required>
                                <option value="none" hidden>
                                    {state !== null ? Activity?.Name : "เลือกกิจกรรม"}
                                </option>
                                {AllActivity.map((item, index) => (
                                    <option key={index} value={item.ID}>
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
                            <select name="Time" onChange={handleInput} required>
                                <option value="none" hidden>
                                    เลือกเวลา
                                </option>
                                <option value="8.00-10.00">{"8.00-10.00"}</option>
                                <option value="10.00-12.00">{"10.00-12.00"}</option>
                                <option value="12.00-14.00">{"12.00-14.00"}</option>
                                <option value="14.00-16.00">{"14.00-16.00"}</option>
                                <option value="16.00-18.00">{"16.00-18.00"}</option>
                                <option value="18.00-20.00">{"18.00-20.00"}</option>
                                <option value="20.00-22.00">{"20.00-22.00"}</option>
                            </select>
                        </div>

                        <label>ระบุจำนวนคน</label>
                        <div className="book-activity-input">
                            <input
                                type="number"
                                name="Particnum"
                                onChange={handleInput}
                            />
                        </div>

                        <label>กรอกเบอร์โทร</label>
                        <div className="book-activity-input">
                            <input
                                type="text"
                                name="PhoneNumber"
                                onChange={handleInput}
                            />
                        </div>

                        <label>ระบุความเห็น</label>
                        <div className="book-activity-input">
                            <input type="textarea" name="Comment" onChange={handleInput} />
                        </div>

                        <div className="book-activity-button">
                            <Link to="/bookActivity">
                                <button className="cancel-button">
                                    <label>ย้อนกลับ</label>
                                </button>
                            </Link>

                            <button className="update-button" type="submit" onClick={handleSubmit}>
                                <label>ยืนยัน</label>
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}
