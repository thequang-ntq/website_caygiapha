import axios from "axios";

const API_URL = "http://localhost:8080/quanhe_vochong"; // URL backend CodeIgniter

export const getQuanHeVoChongAll = () => axios.get(API_URL);

export const getQuanHeVoChongById = (id) => axios.get(`${API_URL}/${id}`);

export const createQuanHeVoChong = (data) => axios.post(API_URL, data);

export const updateQuanHeVoChong = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteQuanHeVoChong = (id) => axios.delete(`${API_URL}/${id}`);