// src/Utils/Apis/MatakuliahApi.js
import axios from "../../Utils/AxiosInstance";

// Ambil semua matakuliah
export const getAllMatakuliah = () => axios.get("/matakuliah");

// Ambil satu matakuliah
export const getMatakuliah = (id) => axios.get(`/matakuliah/${id}`);

// Tambah matakuliah
export const storeMatakuliah = (data) => axios.post("/matakuliah", data);

// Update matakuliah
export const updateMatakuliah = (id, data) => axios.put(`/matakuliah/${id}`, data);

// Hapus matakuliah
export const deleteMatakuliah = (id) => axios.delete(`/matakuliah/${id}`);
