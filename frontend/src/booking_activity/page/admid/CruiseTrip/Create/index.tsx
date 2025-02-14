import React, { useState, useEffect } from "react";
import Navbar from "../../../../component/employee/cruiseTrip/Navbar";
import SideBar from "../../../../component/employee/cruiseTrip/SideBar";
import Dropzone from "../../../../component/employee/cruiseTrip/Dropzone";
import ConfirmModal from "../../../../component/employee/cruiseTrip/CreateCruiseTrip/ConfirmModal";
import { FaRegSave } from "react-icons/fa";
import { RoutesInterface } from "../../../../interfaces/IRoute";
import { ShipInterface } from "../../../../interfaces/IShip";
import { CruiseTripInterface } from "../../../../interfaces/ICruiseTrip";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { CreateCruiseTrip } from "../../../../service/https/cruiseTrip";
import { GetShips } from "../../../../service/https/cruiseTrip/ship";
import { GetRoutes } from "../../../../service/https/cruiseTrip/route";
import imageCompression from "browser-image-compression";
import CruiseTripForm from "../../../../component/employee/cruiseTrip/CreateCruiseTrip/CruiseTripForm";

const CruiseTripCreate: React.FC = () => {
    const [cruiseTripName, setCruiseTripName] = useState<string>("");
    const [routes, setRoutes] = useState<RoutesInterface[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<number | undefined>(undefined);
    const [selectedShip, setSelectedShip] = useState<number | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [description, setDescription] = useState<string>("");
    const [planImg, setPlanImg] = useState<File | null>(null);
    const [planPicURL, setPlanPicURL] = useState<string>("");
    const [planPrice, setPlanPrice] = useState<number | undefined>(undefined);
    const [particNum, setParticNum] = useState<number | undefined>(undefined);
    const [ships, setShips] = useState<ShipInterface[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchShips = async () => {
        try {
            const res = await GetShips();
            if (res) {
                setShips(res);
            } else {
                console.error("Failed to fetch ship");
            }
        } catch (error) {
            console.error("Failed to fetch Ships", error);
        }
    };

    const fetchRoutes = async () => {
        try {
            const res = await GetRoutes();
            if (res) {
                setRoutes(res);
            } else {
                console.error("Failed to fetch routes");
            }
        } catch (error) {
            console.error("Failed to fetch Routes", error);
        }
    };

    const handleSave = async () => {
        setConfirmLoading(true);
        const errors: string[] = [];

        if (!cruiseTripName) errors.push("Please enter the trip name.");
        if (!planImg) errors.push("Please upload a trip picture.");
        if (!selectedShip) errors.push("Please select a ship.");
        if (!description) errors.push("Please enter a description.");
        if (!selectedRoute) errors.push("Please select a route.");
        if (!planPrice) errors.push("Please enter the price.");
        if (!startDate) errors.push("Please select a start date.");
        if (!endDate) errors.push("Please select an end date.");
        if (particNum === undefined) errors.push("Please enter the number of attendees.");

        if (startDate && endDate) {
            // const startDay = startDate.getDate();
            // const startMonth = startDate.getMonth();
            const startYear = startDate.getFullYear();

            // const endDay = endDate.getDate();
            // const endMonth = endDate.getMonth();
            const endYear = endDate.getFullYear();

            if (startYear !== endYear) {
                errors.push("Start date and end date must be on the same day.");
            } else {
                const startTime = startDate.getTime();
                const endTime = endDate.getTime();

                if (startTime >= endTime) {
                    errors.push("Start time must be earlier than end time.");
                }
            }
        }

        if (errors.length > 0) {
            errors.forEach((error, index) => {
                setTimeout(() => {
                    toast.error(error);
                }, index * 1000);
            });
            setConfirmLoading(false);
            return;
        }

        try {
            // const adminID = localStorage.getItem("id");
            // const adminIDNumber = adminID ? Number(adminID) : 1;
            const adminIDNumber = 1;
            const newTrip: CruiseTripInterface = {
                CruiseTripName: cruiseTripName,
                Deets: description,
                PlanImg: planImg ? await getBase64(planImg) : planPicURL,
                ParticNum: particNum,
                PlanPrice: planPrice,
                StartDate: startDate ? startDate.toISOString() : undefined,
                EndDate: endDate ? endDate.toISOString() : undefined,
                ShipID: selectedShip,
                EmployeesID: adminIDNumber,
                RoutesID: selectedRoute,
            };
            console.log("Payload sent to API:", JSON.stringify(newTrip, null, 2));


            console.log("Creating cruise trip with data:", newTrip);

            const res = await CreateCruiseTrip(newTrip);
            if (res) {
                setTimeout(() => {
                    toast.success("CruiseTrip created successfully!");
                }, 1000);
                navigate("/cruiseTrip");
            } else {
                toast.error("Failed to create cruise trip.");
            }
        } catch (error) {
            console.error("Error creating cruise trip:", error);
            toast.error("Failed to create cruise trip.");
        } finally {
            setConfirmLoading(false);
            setModalVisible(false);
        }
    };

    const showConfirmModal = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const options = {
                maxSizeMB: 0.9,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };
            try {
                const compressedFile = await imageCompression(file, options);
                setPlanImg(compressedFile);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPlanPicURL(reader.result as string);
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error("Error compressing file:", error);
            }
        }
    };

    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    useEffect(() => {
        fetchShips();
        fetchRoutes();
    }, []);

    useEffect(() => {
        if (routes.length > 0) {
            if (selectedRoute === undefined) {
                setSelectedRoute(routes[0].ID);
            }
        }
    }, [routes, selectedRoute]);

    useEffect(() => {
        if (ships.length > 0) {
            if (selectedShip === undefined) {
                setSelectedShip(ships[0].ID);
            }
        }
    }, [ships, selectedShip]);

    return (
        <div className="flex">
            <SideBar />
            <div className="bg-white w-full">
                <Navbar title="Cruise trip" />
                <div>
                    <div className="navbar bg-white h-[76px] flex items-center">
                        <h1 className="text-3xl text-black ml-14 mt-2">สร้างทริป</h1>
                        <button
                            className="text-white font-sans font-medium text-m px-5 py-3 flex items-center bg-gray rounded-full hover:bg-green ml-auto mr-14 shadow-md hover:shadow-lg"
                            onClick={showConfirmModal}
                        >
                            <FaRegSave className="w-[24px] h-auto cursor-pointer text-green mr-2" />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center">
                    <div className="bg-gray mt-5 w-[1000px] h-[480px] rounded-3xl overflow-auto scrollable-div flex justify-center">
                        <div className="flex flex-row items-start m-8">
                            <Dropzone onDrop={handleDrop} planPicURL={planPicURL} />
                            <CruiseTripForm
                                cruiseTripName={cruiseTripName}
                                setCruiseTripName={setCruiseTripName}
                                selectedShip={selectedShip}
                                setSelectedShip={setSelectedShip}
                                description={description}
                                setDescription={setDescription}
                                selectedRoutes={selectedRoute}
                                setSelectedRoute={setSelectedRoute}
                                planPrice={planPrice}
                                setPlanPrice={setPlanPrice}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                particNum={particNum}
                                setParticNum={setParticNum}
                                routes={routes}
                                ships={ships}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal visible={modalVisible} onOk={handleSave} onCancel={handleCancel} confirmLoading={confirmLoading} />
            <Toaster />
        </div>
    );
};

export default CruiseTripCreate;
