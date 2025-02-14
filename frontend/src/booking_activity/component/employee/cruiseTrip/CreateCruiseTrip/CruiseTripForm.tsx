// components/ClassForm.tsx
import React from 'react';
import Label from '../Label';
import Input from '../Input';
import Select from '../Select';
import Textarea from '../Textarea';
import DateTimePicker from '../DateTimePicker';
import { ShipInterface } from '../../../../interfaces/IShip';
import { RoutesInterface } from '../../../../interfaces/IRoute';

interface CruiseTripForm {
    cruiseTripName: string;
    setCruiseTripName: React.Dispatch<React.SetStateAction<string>>;
    selectedShip: number | undefined;
    setSelectedShip: React.Dispatch<React.SetStateAction<number | undefined>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    selectedRoutes: number | undefined;
    setSelectedRoute: React.Dispatch<React.SetStateAction<number | undefined>>;
    planPrice: number | undefined; // เพิ่มฟิลด์สำหรับ PlanPrice
    setPlanPrice: React.Dispatch<React.SetStateAction<number | undefined>>; // เพิ่ม Setter สำหรับ PlanPrice
    startDate: Date | null;
    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
    endDate: Date | null;
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
    particNum: number | undefined;
    setParticNum: React.Dispatch<React.SetStateAction<number | undefined>>;
    routes: RoutesInterface[];
    ships: ShipInterface[];
}

const CruiseTripForm: React.FC<CruiseTripForm> = ({
    cruiseTripName,
    setCruiseTripName,
    selectedShip,
    setSelectedShip,
    description,
    setDescription,
    selectedRoutes,
    setSelectedRoute,
    planPrice, // รับค่าของ PlanPrice
    setPlanPrice, // รับ Setter ของ PlanPrice
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    particNum,
    setParticNum,
    routes,
    ships
}) => (
    <div className="flex flex-col items-start ml-[40px]">
        <Label text="Name" />
        <Input placeholder="Enter Name here" value={cruiseTripName} onChange={(e) => setCruiseTripName(e.target.value)} />
        <Select
            options={ships.map((type) => ({
                value: type.ID?.toString() || "",
                label: type.Name || "Unnamed",
            }))}
            value={selectedShip?.toString() || ""}
            onChange={(value) => setSelectedShip(value ? Number(value) : undefined)}
            label="Ship"
        />
        <Label text="Description" />
        <Textarea
            placeholder="Write description here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
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
        <DateTimePicker
            selectedDate={endDate || new Date()}
            onChange={(date) => setEndDate(date)}
            label="End Date and Time:"
        />
        <Label text="No. of Attendees" />
        <Input
            placeholder="Enter Number of Attendees here"
            value={particNum?.toString() || ""}
            onChange={(e) => setParticNum(Number(e.target.value) || undefined)}
        />
    </div>
);

export default CruiseTripForm;