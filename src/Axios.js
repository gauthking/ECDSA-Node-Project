import axios from "axios";

const instance = axios.create({
    baseURL: "https://ecdsa-backend1.onrender.com",
})

export default instance