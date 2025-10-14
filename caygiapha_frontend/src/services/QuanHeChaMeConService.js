import axios from "axios";

const API_URL = "http://localhost:8080/quanhe_chamecon"; // URL backend CodeIgniter

export const getQuanHeChaMeConAll = () => axios.get(API_URL);

export const getQuanHeChaMeConById = (id) => axios.get(`${API_URL}/${id}`);

export const createQuanHeChaMeCon = (data) => axios.post(API_URL, data);

export const updateQuanHeChaMeCon = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteQuanHeChaMeCon = (id) => axios.delete(`${API_URL}/${id}`);