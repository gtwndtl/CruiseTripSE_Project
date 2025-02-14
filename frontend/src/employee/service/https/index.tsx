import { EmployeesInterface } from "../../interface/Employee";

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

async function GetEmployees() {
    return await axios
      .get(`${apiUrl}/employees`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function GetEmployeesById(id: number) {
    return await axios
      .get(`${apiUrl}/employee/${id}`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function UpdateEmployeesById(id: number, data: EmployeesInterface) {
    return await axios
      .put(`${apiUrl}/employee/${id}`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function DeleteEmployeesById(id: number) {
  
    return await axios
      .delete(`${apiUrl}/employee/${id}`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  async function CreateEmployee(data: EmployeesInterface) {
  
    return await axios
      .post(`${apiUrl}/signupEm`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }

async function GetRole() {
  return await axios
    .get(`${apiUrl}/roles`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetStatus() {
    return await axios
      .get(`${apiUrl}/status`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
}

export {

    GetRole,
    GetStatus,
    
    GetEmployees,
    GetEmployeesById,
    UpdateEmployeesById,
    DeleteEmployeesById,
    CreateEmployee,
};