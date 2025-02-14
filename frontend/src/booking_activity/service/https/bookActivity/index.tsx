import axios from "axios";
import { BookActivityInterface } from "../../../interfaces/IBookActivity";
import { ActivityInterface } from "../../../interfaces/IActivity";

const apiUrl = "http://localhost:3036";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

// BookActivity APIs
async function GetBookActivitys() {
  return await axios
    .get(`${apiUrl}/bookactivities`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function GetAllBookActivityByCustomerId(id: number | undefined) {
  return await axios
    .get(`${apiUrl}/bookActivity/byCustomerId/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function GetBookActivityById(id: number | undefined) {
  return await axios
    .get(`${apiUrl}/bookactivity/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function CreateBookActivity(data: BookActivityInterface) {
  return await axios
    .post(`${apiUrl}/bookactivities`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function UpdateBookActivity(id: string, data:BookActivityInterface) {
  return await axios
    .patch(`${apiUrl}/bookactivities/${id}`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function DeleteBookActivityByID(id: number | undefined) {
  return await axios
    .delete(`${apiUrl}/bookactivities/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}


// Activity APIs
async function GetActivities() {
  return await axios
    .get(`${apiUrl}/activities`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function GetActivityById(id: number | undefined) {
  return await axios
    .get(`${apiUrl}/activity/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function CreateActivity(data: ActivityInterface) {
  return await axios
    .post(`${apiUrl}/activities`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function UpdateActivity(id: string, data: ActivityInterface) {
  return await axios
      .post(`${apiUrl}/activities/${id}`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
}

async function DeleteActivityById(id: number | undefined) {
  return await axios
    .delete(`${apiUrl}/activities/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}



export {
  GetBookActivitys,
  GetAllBookActivityByCustomerId,
  GetBookActivityById,
  CreateBookActivity,
  UpdateBookActivity,
  DeleteBookActivityByID,
  GetActivities, 
  GetActivityById, 
  CreateActivity, 
  UpdateActivity, 
  DeleteActivityById,
};