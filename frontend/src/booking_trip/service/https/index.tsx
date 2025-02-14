import axios from "axios";
import { BookingTripInterface } from "../../interfaces/IBookingTrip";
import { GuestInterface } from "../../interfaces/IGuest";
import { GuestSignInInterface } from "../../interfaces/IGuestSignIn";
// import { GuestSignInInterface } from "../../interfaces/IGusetSignin";
const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

// BookingTrip
async function ListBookingTrips() {
  return await axios
    .get(`${apiUrl}/bookingtrips`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetBookingTripByID(id: string) {
  return await axios
    .get(`${apiUrl}/bookingtrip/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetBookingTripByGuestID(id: string | null) {
  return await axios
    .get(`${apiUrl}/bookingtrips/guest/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetBookingTripByCustomerID(id: string | null) {
  return await axios
    .get(`${apiUrl}/bookingtrips/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateBookingTripByID(id: string, data: BookingTripInterface) {
  return await axios
    .patch(`${apiUrl}/bookingtrip/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateBookingTrip(data: BookingTripInterface) {
  console.log("Booking:", data);

  return await axios
    .post(`${apiUrl}/bookingtrip`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Guest
async function GuestSignIn(data: GuestSignInInterface) {
  return await axios
    .post(`${apiUrl}/guest-signin`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function ListGuests() {
  return await axios
    .get(`${apiUrl}/guests`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetGuestByID(id: string) {
  return await axios
    .get(`${apiUrl}/guest/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateGuestByID(id: string, data: GuestInterface) {
  return await axios
    .patch(`${apiUrl}/guest/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateGuest(data: GuestInterface) {
  return await axios
    .post(`${apiUrl}/guests`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
export {
  // BookingTrip
  ListBookingTrips,
  GetBookingTripByID,
  GetBookingTripByGuestID,
  GetBookingTripByCustomerID,
  UpdateBookingTripByID,
  CreateBookingTrip,
  // Guest
  GuestSignIn,
  ListGuests,
  GetGuestByID,
  UpdateGuestByID,
  CreateGuest,
};
