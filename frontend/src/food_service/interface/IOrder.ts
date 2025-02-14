// import { StatusInterface } from "../../booking_cabin/interface/IStatus";
import { GuestInterface } from "../../booking_trip/interfaces/IGuest";
import { StatsInterface } from "../../employee/interface/Status";
// import { CustomerInterface } from "../../interfaces/ICustomer";

export interface OrderInterface {
  ID?: number;
  OrderDate?: Date;
  TotalAmount?: number;
  
  StatusID?: number;
  Status?: StatsInterface;
  
  GuestID?: number;
  Guest?: GuestInterface;
}
