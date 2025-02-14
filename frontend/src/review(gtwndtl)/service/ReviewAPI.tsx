import axios from "axios";
import { ReviewInterface } from "../interface/Review";

const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function GetReviews() {
  return await axios
    .get(`${apiUrl}/reviews`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetReviewById(id: string) {
  return await axios
    .get(`${apiUrl}/review/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateReview(data: ReviewInterface) {
  return await axios
    .post(`${apiUrl}/review`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateReviewById(id: string, data: ReviewInterface) {
  return await axios
    .put(`${apiUrl}/review/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteReviewById(id: string) {
  return await axios
    .delete(`${apiUrl}/review/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetReviewTypes() {
  return await axios
    .get(`${apiUrl}/reviewtypes`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

//ชั่วคราว

async function GetBookingTripById(id: number) {
  return await axios
    .get(`${apiUrl}/bookingtrip/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetCruiseTripById(id: number) {
  return await axios
    .get(`${apiUrl}/cruisetrip/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetAllCruiseTrip() {
  return await axios
    .get(`${apiUrl}/allcruisetrips`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetBookingTrip() {
  return await axios
    .get(`${apiUrl}/bookingtrips`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetBookingCabin() {
  return await axios
    .get(`${apiUrl}/bookngcabins`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetCabinTypes() {
  return await axios
    .get(`${apiUrl}/cabintypes`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetReviews,
  GetReviewById,
  CreateReview,
  UpdateReviewById,
  DeleteReviewById,
  GetReviewTypes,



  //ชั่วคราว
  GetBookingTripById,
  GetCruiseTripById,
  GetAllCruiseTrip,
  GetBookingTrip,
  GetBookingCabin,
  GetCabinTypes,
};
