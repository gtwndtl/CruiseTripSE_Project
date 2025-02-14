import { ActivityInterface } from "./IActivity";
import { BookingTripInterface } from "./IBookingTrip";
import { CustomerInterface } from "./ICustomer";


export interface BookActivityInterface {
    ID?: number;
    Date?: Date;
    Time?: string;
    Particnum?: number;
    Comment?: string;
    PhoneNumber?: string;
    BookingTripID?: number;
    BookingTrip?: BookingTripInterface
    CustomersID?: number;
    Customer?: CustomerInterface;
    ActivityID?: number;
    Activity?: ActivityInterface; 
}