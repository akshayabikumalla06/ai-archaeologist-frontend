
import axios from "axios";

const api = axios.create({
    baseURL: "https://ai-archaeologist-backend.onrender.com/api"
});

export default api;
