import React, { useState, useEffect } from "react";
import { GrAddCircle } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import SideBar from "../../../component/employee/cruiseTrip/SideBar";
import Navbar from "../../../component/employee/cruiseTrip/Navbar";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { DeleteCruiseTripByID, GetCruiseTrips } from "../../../service/https/cruiseTrip";
import { FaMapMarkerAlt, FaCalendarAlt, FaShip } from "react-icons/fa";
import { SlPeople } from "react-icons/sl";
import { MdDescription } from "react-icons/md";
import { AiFillDollarCircle } from "react-icons/ai";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Ship {
    ID: number;
    Name: string;
}

interface Routes {
    ID: number;
    Name: string;
}

interface CruiseTrip {
    ID: number;
    CruiseTripName: string;
    Deets: string;
    StartDate: Date;
    EndDate: Date;
    Routes: Routes;
    PlanImg: string;
    PlanPrice: number;
    ParticNum: number;
    Ship: Ship;
}

const CruiseTrip: React.FC = () => {
    const [cruiseTrips, setCruiseTrips] = useState<CruiseTrip[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cruiseTripToDelete, setCruiseTripToDelete] = useState<number | null>(null);
    const [cruiseTripNameToDelete, setCruiseTripNameToDelete] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCruiseTrips();
    }, []);

    const fetchCruiseTrips = async () => {
        try {
            const res = await GetCruiseTrips();
            if (res) {
                setCruiseTrips(res);
            }
        } catch (error) {
            console.error("Failed to fetch cruise trips", error);
        }
    };

    const handleEditClick = (id: number) => {
        navigate(`/cruiseTrip/edit/${id}`);
    };

    const handleDeleteClick = (id: number, cruiseTripName: string) => {
        setCruiseTripToDelete(id);
        setCruiseTripNameToDelete(cruiseTripName);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (cruiseTripToDelete !== null) {
            const deleteCruiseTripPromise = new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        await DeleteCruiseTripByID(cruiseTripToDelete);
                        resolve("Cruise trip deleted");
                        setCruiseTrips(cruiseTrips.filter((cls) => cls.ID !== cruiseTripToDelete));
                    } catch (error) {
                        reject(error);
                    }
                }, 1000);
            });

            toast.promise(deleteCruiseTripPromise, {
                loading: "Deleting...",
                success: <b>Cruise trip "{cruiseTripNameToDelete}" has been deleted successfully.</b>,
                error: <b>Failed to delete cruise trip.</b>,
            });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="flex">
            <SideBar />
            <div className="bg-white w-full h-screen flex flex-col">
                <Navbar title="จัดการทริปเรือ" />
                <div className="navbar bg-white h-[76px] flex items-center">
                    <div className="ml-auto mr-14">
                        <Link to="/cruiseTrip/create">
                            <button className="text-white mt-6 font-sans font-medium text-m px-5 py-3 flex items-center bg-gray rounded-full hover:bg-green shadow-md hover:shadow-lg">
                                <GrAddCircle className="w-[24px] h-auto cursor-pointer text-green mr-2" />
                                <span>Create</span>
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {cruiseTrips.map((cls) => {
                        const base64String = cls.PlanImg || "";
                        const imageSrc = base64String.startsWith("data:image/")
                            ? base64String
                            : `data:image/jpeg;base64,${base64String}`;

                        return (
                            <div
                                key={cls.ID}
                                className="bg-gray ml-14 w-[500px] h-[510px] rounded-3xl relative mb-7 mr-7 overflow-hidden"
                            >
                                <div className="flex ml-6 pt-6 h-auto">
                                    <div className="flex flex-col items-start relative">
                                        <img
                                            src={imageSrc}
                                            alt={cls.CruiseTripName}
                                            className="w-[454px] h-[280px] rounded-3xl object-cover"
                                        />
                                        <div className="absolute top-0 left-0 p-4">
                                            <h1 className="text-white mb-2 text-[38px]">{cls.CruiseTripName}</h1>
                                        </div>
                                        <div className="flex items-center">
                                            <MdDescription className="text-white text-[20px] mt-2 font" />
                                            <span className="text-white text-[16px] ml-2 mt-2 font-bold"> Descripton:</span>
                                            <span className="text-white text-[20px] ml-2 mt-2"> {cls.Deets}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="text-white text-[20px]" />
                                            <span className="text-white text-[20px] ml-2 font-bold">Sailing Date: </span>
                                            <span className="text-white text-[20px] ml-2">
                                                {dayjs.tz(cls.StartDate, "Asia/Bangkok").format(" D MMM YYYY")} - {dayjs.tz(cls.EndDate, "Asia/Bangkok").format("D MMM YYYY")}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="text-white text-[20px]" />
                                            <span className="text-white text-[20px] ml-2 font-bold">Roundtrip:</span>
                                            <span className="text-white text-[20px] ml-2 ">{cls.Routes.Name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <SlPeople className="text-white text-[20px]" />
                                            <span className="text-white text-[20px] ml-2 font-bold">No. of Attendees:</span>
                                            <span className="text-white text-[20px] ml-2">{cls.ParticNum || "N/A"} people</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaShip className="text-white text-[20px]" />
                                            <span className="text-white text-[20px] ml-2 font-bold"> Ship:</span>
                                            <span className="text-white text-[20px] ml-2 ">{cls.Ship.Name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <AiFillDollarCircle className="text-white text-[20px]" />
                                            <span className="text-white text-[20px] ml-2 font-bold"> Price:</span>
                                            <span className="text-white text-[20px] ml-2 ">{cls.PlanPrice.toLocaleString('en-US')} baht</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="absolute top-8 right-20 bg-gray py-2 px-2 rounded-xl hover:bg-green"
                                    onClick={() => handleEditClick(cls.ID)}
                                >
                                    <MdEdit className="w-[24px] h-auto cursor-pointer text-black hover:text-white" />
                                </button>
                                <button
                                    className="absolute top-8 right-8 bg-gray py-2 px-2 rounded-xl hover:bg-rose-600"
                                    onClick={() => handleDeleteClick(cls.ID, cls.CruiseTripName)}
                                >
                                    <MdDeleteForever className="w-[24px] h-auto cursor-pointer text-black hover:text-white" />
                                </button>
                            </div>
                        );
                    })}
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-gray p-6 rounded-lg shadow-lg text-white border border-green">
                            <h2 className="text-lg">Confirm Deletion</h2>
                            <p className="mt-2">Are you sure you want to delete the cruise trip "{cruiseTripNameToDelete}"?</p>
                            <div className="mt-4 flex justify-end">
                                <button className="bg-rose-500 text-white px-4 py-2 rounded-md mr-2" onClick={confirmDelete}>
                                    Delete
                                </button>
                                <button className="bg-green text-white px-4 py-2 rounded-md" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <Toaster />
            </div>
        </div>
    );
};

export default CruiseTrip;
