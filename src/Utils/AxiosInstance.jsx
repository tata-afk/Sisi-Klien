import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://octa-backend.mekanikace.cloud", // alamat json-server
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;