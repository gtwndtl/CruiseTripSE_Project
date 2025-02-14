import React from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ActivityInterface } from "../../../interfaces/IActivity";

interface ActivityTableProps {
    activitys: ActivityInterface[];
    onEdit: (activity: ActivityInterface) => void;
    onDelete: (id: number, name: string) => void;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ activitys, onEdit, onDelete }) => {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="text-left">
                    <th className="border-b p-2 w-1/12">ID</th>
                    <th className="border-b p-2 w-1/6">Picture</th>
                    <th className="border-b p-2 w-1/3">Name</th>
                    <th className="border-b p-2 w-1/4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {activitys.map((activity, index) => (
                    <tr key={activity.ID}>
                        <td className="border-b p-2 text-center">{index + 1}</td>
                        <td className="border-b p-2">
                            {activity.ActivityImg ? (
                                <img
                                    src={activity.ActivityImg}
                                    
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                            ) : (
                                <span className="text-gray-500">No Image</span>
                            )}
                        </td>
                        <td className="border-b p-2">{activity.Name}</td>
                        <td className="border-b p-2">
                            <div className="space-x-6 flex items-center">
                                <button onClick={() => onEdit(activity)}>
                                    <FiEdit className="text-green w-6 h-auto" />
                                </button>
                                <button
                                    onClick={() => onDelete(activity.ID!, activity.Name ?? "Unnamed Activity")}
                                >
                                    <RiDeleteBin6Line className="text-rose-600 w-7 h-auto" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ActivityTable;
