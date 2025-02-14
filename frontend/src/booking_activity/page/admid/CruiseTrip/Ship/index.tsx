import React, { useState, useEffect } from "react";
import Modal from "../../../../component/employee/cruiseTrip/Ship/Modal";
import SideBar from "../../../../component/employee/cruiseTrip/SideBar";
import Navbar from "../../../../component/employee/cruiseTrip/Navbar";
import { GrAddCircle } from "react-icons/gr";
import toast, { Toaster } from "react-hot-toast";
import { ShipInterface } from "../../../../interfaces/IShip";
import { DeleteShipsByID, GetShips, UpdateShip } from "../../../../service/https/cruiseTrip/ship";
import ShipTable from "../../../../component/employee/cruiseTrip/Ship/ShipTable";

// Utility for modal management
const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    return { isOpen, openModal, closeModal };
};

const Ship: React.FC = () => {
    // Modal state hooks
    const createModal = useModal();
    const editModal = useModal();
    const deleteModal = useModal();

    // State for ship management
    const [ships, setShips] = useState<ShipInterface[]>([]);
    const [shipToDelete, setShipToDelete] = useState<number | null>(null);
    const [shipNameToDelete, setShipNameToDelete] = useState<string>("");
    const [shipToEdit, setShipToEdit] = useState<ShipInterface | null>(null);

    // Fetch ship
    const fetchShips = async () => {
        try {
            const res = await GetShips();
            if (res) setShips(res);
        } catch (error) {
            console.error("Failed to fetch Ship", error);
        }
    };

    // Handle delete ship
    const handleDelete = async () => {
        if (shipToDelete !== null) {
            const deleteShipPromise = new Promise((resolve, reject) => {
                DeleteShipsByID(shipToDelete)
                    .then(() => {
                        resolve("Ship deleted successfully.");
                    })
                    .catch(() => {
                        reject("Failed to delete ship.");
                    });
            });

            toast.promise(deleteShipPromise, {
                loading: "Deleting...",
                success: <b>Ship "{shipNameToDelete}" has been deleted successfully.</b>,
                error: <b>Failed to delete ship.</b>,
            });

            try {
                await deleteShipPromise;
                fetchShips();
            } finally {
                deleteModal.closeModal();
            }
        }
    };

    // Handle update ship
    const handleEdit = async () => {
        if (shipToEdit !== null) {
            const updateShipPromise = new Promise((resolve, reject) => {
                UpdateShip(shipToEdit)
                    .then(() => {
                        resolve("Ship update successfully.");
                    })
                    .catch(() => {
                        reject("Failed to update ship.");
                    });
            });

            toast.promise(updateShipPromise, {
                loading: "Updating...",
                success: <b>Ship "{shipNameToDelete}" has been deleted successfully.</b>,
                error: <b>Failed to delete ship.</b>,
            });

            try {
                await updateShipPromise;
                fetchShips();
            } finally {
                deleteModal.closeModal();
            }
        }
    };

    // Open modals with selected ship
    const openEditModal = (ship: ShipInterface) => {
        setShipToEdit(ship);
        editModal.openModal();
    };

    const openDeleteModal = (id: number, name: string) => {
        setShipToDelete(id);
        setShipNameToDelete(name);
        deleteModal.openModal();
    };

    // Initial data fetching
    useEffect(() => {
        fetchShips();
    }, []);

    return (
        <div className="flex flex-col md:flex-row">
            <SideBar />
            <div className="bg-white w-full">
                <Navbar title="จัดการเรือ" />
                <div className="navbar bg-forth h-[76px] flex items-center">
                    <div className="ml-auto mr-4 md:mr-14 mt-2">
                        <button
                            className="text-white font-sans font-medium text-m px-5 py-3 flex items-center bg-gray rounded-full hover:bg-green shadow-md hover:shadow-lg"
                            onClick={createModal.openModal}
                        >
                            <GrAddCircle className="w-[24px] h-auto cursor-pointer text-green mr-2" />
                            <span>Create</span>
                        </button>
                    </div>
                </div>
                <div className="text-white bg-white overflow-auto h-[520px] scrollable-div flex justify-center">
                    <div className="max-w-full w-full md:w-[700px] h-[490px] bg-gray rounded-xl mt-6 p-4">
                        <ShipTable ships={ships} onEdit={openEditModal} onDelete={openDeleteModal} />
                        <Toaster />
                    </div>
                </div>

                {/* Modals */}
                <Modal
                    isOpen={createModal.isOpen}
                    onClose={createModal.closeModal}
                    title="Create Ship"
                    fetchShips={fetchShips}
                />
                <Modal
                    isOpen={editModal.isOpen}
                    onClose={editModal.closeModal}
                    title="Edit Ship"
                    type="edit"
                    ship={shipToEdit}
                    fetchShips={fetchShips}
                    onSave={handleEdit} // Pass the update handler
                />
                <Modal
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.closeModal}
                    title="Confirm Delete"
                    type="delete"
                    shipName={shipNameToDelete}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default Ship;
