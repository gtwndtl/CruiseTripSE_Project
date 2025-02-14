import React, { useState, useEffect } from "react";
import { GrAddCircle } from "react-icons/gr";
import toast, { Toaster } from "react-hot-toast";
import SideBar from "../../../component/employee/cruiseTrip/SideBar";
import Navbar from "../../../component/employee/cruiseTrip/Navbar";
import Modal from "../../../component/employee/activity/CreateActivity/Modal";
import ActivityTable from "../../../component/employee/activity/activityTable";
import { ActivityInterface } from "../../../interfaces/IActivity";
import { DeleteActivitysByID, GetActivitys, UpdateActivity } from "../../../service/https/activity";
import { Link } from "react-router-dom";

// Utility for modal management
const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    return { isOpen, openModal, closeModal };
};

const Activity: React.FC = () => {
    // Modal state hooks
    const createModal = useModal();
    const editModal = useModal();
    const deleteModal = useModal();

    // State for activity management
    const [activitys, setActivitys] = useState<ActivityInterface[]>([]);
    const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
    const [activityNameToDelete, setActivityNameToDelete] = useState<string>("");
    const [activityToEdit, setActivityToEdit] = useState<ActivityInterface | null>(null);

    // Fetch activity
    const fetchActivitys = async () => {
        try {
            const res = await GetActivitys();
            if (res) setActivitys(res);
        } catch (error) {
            console.error("Failed to fetch Activity", error);
        }
    };

    // Handle delete activity
    const handleDelete = async () => {
        if (activityToDelete !== null) {
            const deleteActivityPromise = new Promise((resolve, reject) => {
                DeleteActivitysByID(activityToDelete)
                    .then(() => {
                        resolve("Activity deleted successfully.");
                    })
                    .catch(() => {
                        reject("Failed to delete activity.");
                    });
            });

            toast.promise(deleteActivityPromise, {
                loading: "Deleting...",
                success: <b>Activity "{activityToDelete}" has been deleted successfully.</b>,
                error: <b>Failed to delete activity.</b>,
            });

            try {
                await deleteActivityPromise;
                fetchActivitys();
            } finally {
                deleteModal.closeModal();
            }
        }
    };

    // Handle update ship
    const handleEdit = async () => {
        if (activityToEdit !== null) {
            const updateActivityPromise = new Promise((resolve, reject) => {
                UpdateActivity(activityToEdit)
                    .then(() => {
                        resolve("Activity update successfully.");
                    })
                    .catch(() => {
                        reject("Failed to update activity.");
                    });
            });

            toast.promise(updateActivityPromise, {
                loading: "Updating...",
                success: <b>Activity "{activityToDelete}" has been updated successfully.</b>,
                error: <b>Failed to update activity.</b>,
            });

            try {
                await updateActivityPromise;
                fetchActivitys();
            } finally {
                deleteModal.closeModal();
            }
        }
    };

    // Open modals with selected ship
    const openEditModal = (activity: ActivityInterface) => {
        setActivityToEdit(activity);
        editModal.openModal();
    };

    const openDeleteModal = (id: number, name: string) => {
        setActivityToDelete(id);
        setActivityNameToDelete(name);
        deleteModal.openModal();
    };

    // Initial data fetching
    useEffect(() => {
        fetchActivitys();
    }, []);

    return (
        <div className="flex flex-col md:flex-row">
            <SideBar />
            <div className="bg-white w-full">
                <Navbar title="จัดการกิจกรรม" />
                <div className="navbar bg-forth h-[76px] flex items-center">
                    <div className="ml-auto mr-4 md:mr-14 mt-2">
                        <Link to="/activity/create">
                            <button className="text-white mt-6 font-sans font-medium text-m px-5 py-3 flex items-center bg-gray rounded-full hover:bg-green shadow-md hover:shadow-lg">
                                <GrAddCircle className="w-[24px] h-auto cursor-pointer text-green mr-2" />
                                <span>Create</span>
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="text-white bg-white overflow-auto h-[520px] scrollable-div flex justify-center">
                    <div className="max-w-full w-full md:w-[700px] h-[490px] bg-gray rounded-xl mt-6 p-4">
                        <ActivityTable activitys={activitys} onEdit={openEditModal} onDelete={openDeleteModal} />
                        <Toaster />
                    </div>
                </div>

                {/* Modals
                <Modal
                    isOpen={createModal.isOpen}
                    onClose={createModal.closeModal}
                    title="Create Activity"
                    fetchActivitys={fetchActivitys}
                />
                <Modal
                    isOpen={editModal.isOpen}
                    onClose={editModal.closeModal}
                    title="Edit Activity"
                    type="edit"
                    activity={activityToEdit}
                    fetchActivitys={fetchActivitys}
                    onSave={handleEdit} // Pass the update handler
                /> */}
                <Modal
                    visible={deleteModal.isOpen}
                    onCancel={deleteModal.closeModal}
                    title="Confirm Delete"
                    
                    onOk={handleDelete}
                >
                     <p>Are you sure you want to delete "{activityNameToDelete}"?</p>
                </Modal>
            </div>
        </div>
    );
};

export default Activity;
