// components/ClassForm.tsx
import React from 'react';
import Label from '../../cruiseTrip/Label';
import Input from '../../cruiseTrip/Input';

interface ActivityForm {
    activityName: string;
    setActivityName: React.Dispatch<React.SetStateAction<string>>;
}

const ActivityForm: React.FC<ActivityForm> = ({
    activityName,
    setActivityName,
}) => (
    <div className="flex flex-col items-start ml-[40px]">
        <Label text="Name" />
        <Input placeholder="Enter Name here" value={activityName} onChange={(e) => setActivityName(e.target.value)} />
    </div>
);

export default ActivityForm;