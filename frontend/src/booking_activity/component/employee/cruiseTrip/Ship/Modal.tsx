import React, { useState } from "react";
import Input from "../Input";
import toast from "react-hot-toast";
import { ShipInterface } from "../../../../interfaces/IShip";
import { CreateShip, UpdateShip } from "../../../../service/https/cruiseTrip/ship";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
    onDelete?: () => void;
    title: string;
    type?: "delete" | "create" | "edit";
    ship?: ShipInterface | null;
    shipName?: string;
    fetchShips?: () => void;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    title,
    type = "create",
    ship,
    shipName,
    fetchShips,
}) => {
    const [name, setName] = useState(ship?.Name || "");

    const handleSubmit = async () => {
        if (type === "create") {
            if (!name) {
                toast.error("Please enter a name.");
                return;
            }
            const data: ShipInterface = { Name: name };
            const createShipPromise = new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        await CreateShip(data);
                        resolve("Ship created successfully!");
                    } catch {
                        reject("Failed to create ship.");
                    }
                }, 1000);
            });

            toast.promise(createShipPromise, {
                loading: "Creating ship...",
                success: "Ship created successfully!",
                error: "Failed to create ship.",
            });

            try {
                await createShipPromise;
                setName("");
                onClose();
                if (fetchShips) {
                    fetchShips(); // Call fetch Ship if it is defined
                }
            } catch (error) {
                console.error("Error creating ship:", error);
            }
        } else if (type === "edit" && ship && onSave) {
            if (!name) {
                toast.error("Please enter a name.");
                return;
            }
            const data: ShipInterface = { ID: ship.ID, Name: name };
            const editShipPromise = new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        await UpdateShip(data);
                        resolve("Ship updated successfully!");
                    } catch {
                        reject("Failed to update ship.");
                    }
                }, 1000);
            });

            toast.promise(editShipPromise, {
                loading: "Updating ship...",
                success: "ship updated successfully!",
                error: "Failed to update ship.",
            });

            try {
                await editShipPromise;
                setName("");
                onClose();
                if (fetchShips) {
                    fetchShips(); // Call fetchShips if it is defined
                }
            } catch (error) {
                console.error("Error update ship:", error);
            }
        } else if (type === "delete" && onDelete) {
            try {
                await onDelete();
                onClose();
            } catch (error) {
                console.error("Error deleting ship:", error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/4 flex flex-col justify-center ">
                <h2 className="text-xl font-bold mb-4 text-black flex justify-center ">{title}</h2>
                {type !== "delete" ? (
                    <>
                        <p className="flex flex-col justify-center items-center">
                            <label className="text-black  text-lg">Name</label>
                            <Input placeholder="Enter Name here" value={name} onChange={(e) => setName(e.target.value)} />
                        </p>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="bg-rose-500 text-black px-4 py-2 rounded-lg hover:bg-rose-600 hover:text-white"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green text-black px-4 py-2 rounded-lg hover:bg-hover hover:text-white"
                                onClick={handleSubmit}
                            >
                                {type === "create" ? "Save" : "Update"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-black flex justify-center ">Are you sure you want to delete "{shipName}"?</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                className="bg-rose-500 text-black px-4 py-2 rounded-lg hover:bg-rose-600 hover:text-white"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green text-black px-4 py-2 rounded-lg hover:bg-green hover:text-white"
                                onClick={handleSubmit}
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;
