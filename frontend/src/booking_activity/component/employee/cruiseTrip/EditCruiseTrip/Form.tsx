import React from "react";
import Label from "../Label";
import Input from "../Input";
import Select from "../Select";
import Textarea from "../Textarea";
import DateTimePicker from "../DateTimePicker";
import { RoutesInterface } from "../../../../interfaces/IRoute";
import { ShipInterface } from "../../../../interfaces/IShip";

interface FormProps {
    cruiseTripName: string;
    setCruiseTripName: (value: string) => void;
    routes: RoutesInterface[];
    selectedRoutes: number | undefined;
    setSelectedRoute: (value: number | undefined) => void;
    ships: ShipInterface[];
    selectedShip: number | undefined;
    setSelectedShip: (value: number | undefined) => void;
    planPrice: number | undefined; // เพิ่มฟิลด์สำหรับ PlanPrice
    setPlanPrice: React.Dispatch<React.SetStateAction<number | undefined>>; // เพิ่ม Setter สำหรับ PlanPrice
    description: string;
    setDescription: (value: string) => void;
    startDate: Date | null;
    setStartDate: (date: Date | null) => void;
    endDate: Date | null;
    setEndDate: (date: Date | null) => void;
    particNum: number | undefined;
    setParticNum: (value: number | undefined) => void;
}

const Form: React.FC<FormProps> = ({
    cruiseTripName,
    setCruiseTripName,
    routes,
    selectedRoutes,
    setSelectedRoute,
    ships,
    selectedShip,
    setSelectedShip,
    planPrice,
    setPlanPrice,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    particNum,
    setParticNum,
}) => {
    return (
        <div className="flex-1 pt-7">
            <div className="flex flex-col items-start ml-[40px]">
                <Label text="Name" />
                <Input placeholder="Enter Name here" value={cruiseTripName} onChange={(e) => setCruiseTripName(e.target.value)} />
                <Select
                    options={ships.map((ship) => ({
                        value: ship.ID?.toString() || "",
                        label: ship.Name || "Unnamed",
                    }))}
                    value={selectedShip?.toString() || ""}
                    onChange={(value) => setSelectedShip(value ? Number(value) : undefined)}
                    label="Ship"
                />
                <Label text="Description" />
                <Textarea placeholder="Write description here" value={description} onChange={(e) => setDescription(e.target.value)} />
                <Select
                    options={routes.map((route) => ({
                        value: route.ID?.toString() || "",
                        label: route.Name || "Unnamed",
                    }))}
                    value={selectedRoutes?.toString() || ""}
                    onChange={(value) => setSelectedRoute(value ? Number(value) : undefined)}
                    label="Route"
                />
                <Label text="Plan Price" />
                <Input
                    placeholder="Enter Plan Price here"
                    value={planPrice?.toString() || ""}
                    onChange={(e) => setPlanPrice(Number(e.target.value) || undefined)}
                />
                <DateTimePicker
                    selectedDate={startDate || new Date()}
                    onChange={(date) => setStartDate(date)}
                    label="Start Date and Time:"
                />
                <DateTimePicker selectedDate={endDate || new Date()} onChange={(date) => setEndDate(date)} label="End Date and Time:" />
                <Label text="No. of Attendees" />
                <Input
                    placeholder="Enter Number of Attendees here"
                    value={particNum?.toString() || ""}
                    onChange={(e) => setParticNum(Number(e.target.value) || undefined)}
                />
            </div>
        </div>
    );
};

export default Form;
