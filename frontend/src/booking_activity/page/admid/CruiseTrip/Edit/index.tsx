import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../../component/employee/cruiseTrip/Navbar";
import SideBar from "../../../../component/employee/cruiseTrip/SideBar";
import Dropzone from "../../../../component/employee/cruiseTrip/Dropzone";
import Form from "../../../../component/employee/cruiseTrip/EditCruiseTrip/Form";
import Modal from "../../../../component/employee/cruiseTrip/EditCruiseTrip/Modal";
import { FaRegSave } from "react-icons/fa";
import { RoutesInterface } from "../../../../interfaces/IRoute";
import { ShipInterface } from "../../../../interfaces/IShip";
import { CruiseTripInterface } from "../../../../interfaces/ICruiseTrip";
import toast, { Toaster } from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { GetCruiseTripById, UpdateCruiseTrip } from "../../../../service/https/cruiseTrip";
import { GetShips } from "../../../../service/https/cruiseTrip/ship";
import { GetRoutes } from "../../../../service/https/cruiseTrip/route";

const EditCruiseTrip: React.FC = () => {
    const { cruiseTripID } = useParams<{ cruiseTripID: string }>();
    const navigate = useNavigate();
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

    const fetchShips = useCallback(async () => {
        try {
            const res = await GetShips();
            if (res) setShips(res);
        } catch (error) {
            console.error("Failed to fetch Ship", error);
        }
    }, []);

    const fetchRoutes = useCallback(async () => {
        try {
            const res = await GetRoutes();
            if (res) setRoutes(res);
        } catch (error) {
            console.error("Failed to fetch Routes", error);
        }
    }, []);

    const fetchCruiseTripDetails = useCallback(async () => {
        try {
            if (!cruiseTripID) return;
            const res = await GetCruiseTripById(Number(cruiseTripID));
            if (res) {
                setCruiseTripName(res.CruiseTripName || "");
                setSelectedRoute(res.RouteID);
                setSelectedShip(res.ShipID);
                setPlanPrice(res.PlanPrice || undefined);
                setStartDate(res.StartDate ? new Date(res.StartDate) : null);
                setEndDate(res.EndDate ? new Date(res.EndDate) : null);
                setDescription(res.Deets || "");
                setPlanPicURL(res.PlanImg || "");
                setParticNum(res.ParticNum || undefined);
            }
        } catch (error) {
            console.error("Failed to fetch ship details", error);
        }
    }, [cruiseTripID]);

    const handleSave = async () => {
        setConfirmLoading(true);

        const delayedUpdateClass = new Promise<boolean>((resolve, reject) => {
            const updateCruiseTripAsync = async () => {
                try {
                    // const adminID = localStorage.getItem("id");
                    // const adminIDNumber = adminID ? Number(adminID) : 1;
                    const adminIDNumber = 1;
                    const updateTrip: CruiseTripInterface = {
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
                    console.log("Payload sent to API:", JSON.stringify(updateTrip, null, 2));

                    const res = await UpdateCruiseTrip(updateTrip);
                    if (res) {
                        resolve(true);
                    } else {
                        reject(new Error("Failed to update cruisetrip."));
                    }
                } catch (error) {
                    reject(error);
                }
            };

            updateCruiseTripAsync();
        });

        toast.promise(delayedUpdateClass, {
            loading: "Updating cruise trip...",
            success: "Cruise trip updated successfully!",
            error: "Failed to update cruise trip.",
        });

        try {
            await delayedUpdateClass;
            navigate("/cruiseTrip");
        } catch (error) {
            console.error("Error updating cruise trip:", error);
        } finally {
            setConfirmLoading(false);
            setModalVisible(false);
        }
    };

    const showConfirmModal = () => setModalVisible(true);
    const handleCancel = () => setModalVisible(false);

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
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    useEffect(() => {
        fetchShips();
        fetchRoutes();
        fetchCruiseTripDetails();
    }, [fetchShips, fetchRoutes, fetchCruiseTripDetails]);

    useEffect(() => {
        if (routes.length > 0 && selectedRoute === undefined) {
            setSelectedRoute(routes[0].ID);
        }
    }, [routes, selectedRoute]);

    useEffect(() => {
        if (ships.length > 0 && selectedShip === undefined) {
            setSelectedShip(ships[0].ID);
        }
    }, [ships, selectedShip]);

    return (
        <div className="flex">
            <SideBar />
            <div className="bg-white w-full">
                <Navbar title="CruiseTrip" />
                <div className="navbar bg-white h-[76px] flex items-center">
                    <h1 className="text-3xl text-black ml-14 mt-5">แก้ไขทริปเรือ</h1>
                    <button
                        className={`text-white font-sans font-medium text-m px-5 py-3 flex items-center bg-gray rounded-full hover:bg-hover ml-auto mr-14 shadow-md hover:shadow-lg ${
                            confirmLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={showConfirmModal}
                        disabled={confirmLoading}
                    >
                        <FaRegSave className="w-[24px] h-auto cursor-pointer text-green mr-2" />
                        <span>Save</span>
                    </button>
                </div>
                <div className="flex flex-wrap justify-center">
                    <div className="bg-gray mt-5 w-[1000px] h-[480px] rounded-3xl overflow-auto scrollable-div flex justify-center">
                        <div className="flex  ">
                            <div className="pt-10"><Dropzone onDrop={handleDrop} planPicURL={planPicURL} /></div>
                            
                            <Form
                                cruiseTripName={cruiseTripName}
                                setCruiseTripName={setCruiseTripName}
                                routes={routes}
                                selectedRoutes={selectedRoute}
                                setSelectedRoute={setSelectedRoute}
                                ships={ships}
                                selectedShip={selectedShip}
                                setSelectedShip={setSelectedShip}
                                planPrice={planPrice}
                                setPlanPrice ={setPlanPrice}
                                description={description}
                                setDescription={setDescription}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                particNum={particNum}
                                setParticNum={setParticNum}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Modal title="Confirm Save" visible={modalVisible} onOk={handleSave} onCancel={handleCancel} confirmLoading={confirmLoading}>
                <p>Are you sure you want to Update this cruise trip?</p>
            </Modal>
            <Toaster />
        </div>
    );
};

export default EditCruiseTrip;
