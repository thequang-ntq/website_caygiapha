import axios from "axios";

const API_URL = "http://localhost:8080/anh"; // URL backend CodeIgniter

export const getAnhAll = () => axios.get(API_URL);

export const getAnhById = (id) => axios.get(`${API_URL}/${id}`);

export const createAnh = (data) => axios.post(API_URL, data);

export const updateAnh = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteAnh = (id) => axios.delete(`${API_URL}/${id}`);