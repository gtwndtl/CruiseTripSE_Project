import axios from "axios";
import { BookingCabinInterface } from "../../interfaces/IBookingCabin";
import { CabinInterface } from "../../interfaces/ICabin";
const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

// BookingCabin
async function ListBookingCabins() {
    return await axios
        .get(`${apiUrl}/bookingcabins`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetBookingCabinByID(id: string) {
    return await axios
        .get(`${apiUrl}/bookingcabin/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetBookingCabinByBookingTripID(id: string | null) {
    return await axios
        .get(`${apiUrl}/bookingcabins/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function UpdateBookingCabinByID(id: string, data: BookingCabinInterface) {
    return await axios
        .patch(`${apiUrl}/bookingcabin/${id}`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function CreateBookingCabin(data: BookingCabinInterface) {
    return await axios
        .post(`${apiUrl}/bookingcabin`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

// CabinType
async function ListCabinTypes() {
    return await axios
        .get(`${apiUrl}/cabintypes`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetCabinTypeByID(id: string) {
    return await axios
        .get(`${apiUrl}/cabintype/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

// Cabin
async function ListCabins() {
    return await axios
        .get(`${apiUrl}/cabins`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetCabinByID(id: string) {
    return await axios
        .get(`${apiUrl}/cabin/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetCabinByTypeID(id: string) {
    return await axios
        .get(`${apiUrl}/cabins/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function UpdateCabinByID(id: string, data: CabinInterface) {
    return await axios
        .post(`${apiUrl}/cabin/${id}`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

export {
    // BookingCabin
    ListBookingCabins,
    GetBookingCabinByID,
    GetBookingCabinByBookingTripID,
    UpdateBookingCabinByID,
    CreateBookingCabin,
    // CabinType
    ListCabinTypes,
    GetCabinTypeByID,
    // Cabin
    ListCabins,
    GetCabinByID,
    GetCabinByTypeID,
    UpdateCabinByID,
}