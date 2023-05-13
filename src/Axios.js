import axios from "axios";
import * as dot from "dotenv"
dot.config()
const instance = axios.create({
    baseURL: process.env.BACKEND,
})

export default instance