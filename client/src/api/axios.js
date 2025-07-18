import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
  withCredentials: true, // if needed for cookies
});
export default instance;
