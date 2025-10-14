import axios from "axios";

const API_URL = "http://localhost:8080/sukien"; // URL backend CodeIgniter

export const getSuKienAll = () => axios.get(API_URL);

export const getSuKienById = (id) => axios.get(`${API_URL}/${id}`);

export const createSuKien = (data) => axios.post(API_URL, data);

export const updateSuKien = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteSuKien = (id) => axios.delete(`${API_URL}/${id}`);