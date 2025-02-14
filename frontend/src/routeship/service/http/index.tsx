import { RoutesInterface } from "../../interface/Route";
import { HarborsInterface } from "../../interface/Harbor";
import { Harbor_RoutesInterface } from "../../interface/Harbor_Route";

import axios from "axios";


const apiUrl = "http://localhost:8000";

const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");
const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function GetWeather() {
    return await axios
      .get(`${apiUrl}/weather`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }

async function GetRoutes() {
    return await axios
      .get(`${apiUrl}/routes`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function GetRoutesById(id: number) {
    return await axios
      .get(`${apiUrl}/route/${id}`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function UpdateRoutesById(id: number, data: RoutesInterface) {
    return await axios
      .put(`${apiUrl}/route/${id}`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function DeleteRoutesById(id: number) {
    return await axios
      .delete(`${apiUrl}/route/${id}`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function CreateRoute(data: RoutesInterface) {
    return await axios
      .post(`${apiUrl}/routeCreate`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  
  
  async function GetHarbors() {
    return await axios
      .get(`${apiUrl}/harbors`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function GetHarborsById(id: number) {
    return await axios
      .get(`${apiUrl}/harbor/${id}`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function UpdateHarborsById(id: number, data: HarborsInterface) {
    return await axios
      .put(`${apiUrl}/harbor/${id}`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function DeleteHarborsById(id: number) {
    return await axios
      .delete(`${apiUrl}/harbor/${id}`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function CreateHarbor(data: HarborsInterface) {
    return await axios
      .post(`${apiUrl}/harborCreate`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  
  
  async function GetHarborRoutes() {
    return await axios
      .get(`${apiUrl}/harbor_rs`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function GetHarborRoutesById(id: number) {
    return await axios
      .get(`${apiUrl}/harbor_r/${id}`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function UpdateHarborRoutesById(id: number, data: Harbor_RoutesInterface) {
    return await axios
      .put(`${apiUrl}/harbor_r/${id}`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function DeleteHarborRoutesById(id: number) {
    return await axios
      .delete(`${apiUrl}/harbor_r/${id}`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function CreateHarborRoute(data: Harbor_RoutesInterface) {
    return await axios
      .post(`${apiUrl}/harbor_rCreate`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
export {
    GetWeather,

    GetRoutes,
    GetRoutesById,
    UpdateRoutesById,
    DeleteRoutesById,
    CreateRoute,
  
    GetHarbors,
    GetHarborsById,
    UpdateHarborsById,
    DeleteHarborsById,
    CreateHarbor,
  
    GetHarborRoutes,
    GetHarborRoutesById,
    UpdateHarborRoutesById,
    DeleteHarborRoutesById,
    CreateHarborRoute,
};