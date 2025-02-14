import React from "react";
import Label from "../../cruiseTrip/Label";
import Input from "../../cruiseTrip/Input";

interface FormProps {
    cruiseTripName: string;
    setCruiseTripName: (value: string) => void;
}

const Form: React.FC<FormProps> = ({
    cruiseTripName,
    setCruiseTripName,
}) => {
    return (
        <div className="flex-1 pt-7">
            <div className="flex flex-col items-start ml-[40px]">
                <Label text="Name" />
                <Input placeholder="Enter Name here" value={cruiseTripName} onChange={(e) => setCruiseTripName(e.target.value)} />
            </div>
        </div>
    );
};

export default Form;
