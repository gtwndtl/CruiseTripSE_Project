import axios from "axios";
import { CruiseTripInterface } from "../../../interfaces/ICruiseTrip";
import { ShipInterface } from "../../../interfaces/IShip";

const apiUrl = "http://localhost:8000"; 
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

// CruiseTrip APIs
async function GetCruiseTrips() {
  return await axios
    .get(`${apiUrl}/cruisetrips`, requestOptions)
    .then((res) => res.data) 
    .catch((e) => e.response);
}

async function GetCruiseTripById(id: number | undefined) {
  return await axios
    .get(`${apiUrl}/cruisetrip/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function CreateCruiseTrip(data: CruiseTripInterface) {
  return await axios
    .post(`${apiUrl}/cruisetrips`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function UpdateCruiseTrip(data: CruiseTripInterface) {
  return await axios
    .patch(`${apiUrl}/cruisetrips`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function DeleteCruiseTripByID(id: number | undefined) {
  return await axios
    .delete(`${apiUrl}/cruisetrips/${id}`, requestOptions)
    .then((res) => res.data) 
    .catch((e) => e.response);
}

async function GetShips() {
    return await axios
      .get(`${apiUrl}/ships`, requestOptions)
      .then((res) => res.data)
      .catch((e) => e.response);
  }
  
  async function GetShipById(id: number | undefined) {
    return await axios
      .get(`${apiUrl}/ship/${id}`, requestOptions)
      .then((res) => res.data)
      .catch((e) => e.response);
  }
  
  async function CreateShip(data: ShipInterface) {
    return await axios
      .post(`${apiUrl}/ships`, data, requestOptions)
      .then((res) => res.data)
      .catch((e) => e.response);
  }
  
  async function UpdateShip(data: ShipInterface) {
    return await axios
      .patch(`${apiUrl}/ships`, data, requestOptions)
      .then((res) => res.data)
      .catch((e) => e.response);
  }
  
  async function DeleteShipById(id: number | undefined) {
    return await axios
      .delete(`${apiUrl}/ships/${id}`, requestOptions)
      .then((res) => res.data)
      .catch((e) => e.response);
  }

export { 
  GetCruiseTrips, 
  GetCruiseTripById, 
  CreateCruiseTrip, 
  UpdateCruiseTrip, 
  DeleteCruiseTripByID, 
  GetShips,
  GetShipById,
  CreateShip,
  UpdateShip,
  DeleteShipById,

};