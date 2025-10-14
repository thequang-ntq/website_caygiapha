import axios from "axios";

const API_URL = "http://localhost:8080/caygiapha";

export const getCayGiaPha = () => axios.get(API_URL);