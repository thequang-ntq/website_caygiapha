import axios from "axios";

const API_URL = "http://localhost:8080/tinnhan"; // URL backend CodeIgniter

export const getTinNhanAll = () => axios.get(API_URL);

export const getTinNhanById = (id) => axios.get(`${API_URL}/${id}`);

export const createTinNhan = (data) => axios.post(API_URL, data);

export const updateTinNhan = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteTinNhan = (id) => axios.delete(`${API_URL}/${id}`);