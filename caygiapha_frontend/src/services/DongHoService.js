import axios from "axios";

const API_URL = "http://localhost:8080/dongho"; // URL backend CodeIgniter

export const getDongHoAll = () => axios.get(API_URL);

export const getDongHoById = (id) => axios.get(`${API_URL}/${id}`);

export const createDongHo = (data) => axios.post(API_URL, data);

export const updateDongHo = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteDongHo = (id) => axios.delete(`${API_URL}/${id}`);
