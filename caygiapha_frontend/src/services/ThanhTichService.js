import axios from "axios";

const API_URL = "http://localhost:8080/thanhtich"; // URL backend CodeIgniter

export const getThanhTichAll = () => axios.get(API_URL);

export const getThanhTichById = (id) => axios.get(`${API_URL}/${id}`);

export const createThanhTich = (data) => axios.post(API_URL, data);

export const updateThanhTich = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteThanhTich = (id) => axios.delete(`${API_URL}/${id}`);