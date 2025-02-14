import React from "react";
import { ShipInterface } from "../../../../interfaces/IShip";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

interface ShipTableProps {
    ships: ShipInterface[];
    onEdit: (ship: ShipInterface) => void;
    onDelete: (id: number, name: string) => void;
}

const ShipTable: React.FC<ShipTableProps> = ({ ships, onEdit, onDelete }) => {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="text-left">
                    <th className="border-b p-2 w-1/6"></th>
                    <th className="border-b p-2 w-1/2">Name</th>
                    <th className="border-b p-2 w-1/3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {ships.map((ship, index) => (
                    <tr key={ship.ID}>
                        <td className="border-b p-2 text-center">{index + 1}</td>
                        <td className="border-b p-2">{ship.Name}</td>
                        <td className="border-b p-2">
                            <div className="space-x-6 flex items-center">
                            <button onClick={() => onEdit(ship)}>
                                <FiEdit className="text-green w-6 h-auto" />
                            </button>
                            <button
                                
                                onClick={() => onDelete(ship.ID!, ship.Name ?? "Unnamed Ship")}
                            >
                                <RiDeleteBin6Line className=" text-rose-600 w-7 h-auto "/>
                            </button>
                            </div>
                            
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ShipTable;
