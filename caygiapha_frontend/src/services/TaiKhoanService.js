import axios from "axios";

const API_URL = "http://localhost:8080/taikhoan"; // URL backend CodeIgniter

export const getTaiKhoanAll = () => axios.get(API_URL);

export const getTaiKhoanById = (id) => axios.get(`${API_URL}/${id}`);

export const createTaiKhoan = (data) => axios.post(API_URL, data);

export const updateTaiKhoan = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteTaiKhoan = (id) => axios.delete(`${API_URL}/${id}`);