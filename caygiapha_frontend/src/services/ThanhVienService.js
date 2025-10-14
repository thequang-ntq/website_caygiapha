import axios from "axios";

const API_URL = "http://localhost:8080/thanhvien"; // URL backend CodeIgniter

export const getThanhVienAll = () => axios.get(API_URL);

export const getThanhVienById = (id) => axios.get(`${API_URL}/${id}`);

export const createThanhVien = (data) => axios.post(API_URL, data);

export const updateThanhVien = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteThanhVien = (id) => axios.delete(`${API_URL}/${id}`);