import React, { useState } from "react";
import Button from "../../../components/atoms/Button";
import { ToastContainer } from "react-toastify";
import {
  toastSuccess,
  toastError,
} from "../../../Utils/Helpers/ToastHelpers";
import {
  confirmDelete,
  confirmUpdate,
} from "../../../Utils/Helpers/SwalHelpers";
import { useMatakuliah } from "../../../Utils/hooks/useMatakuliah";
import ModalMatakuliah from "./ModalMatakuliah";

const Matakuliah = () => {
  const [form, setForm] = useState({ id: "", kode: "", nama: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    matakuliahQuery,
    tambahMatakuliah,
    ubahMatakuliah,
    hapusMatakuliah,
  } = useMatakuliah();

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const resetForm = () => {
    setForm({ id: "", kode: "", nama: "" });
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.kode || !form.nama) {
      toastError("Kode dan Nama wajib diisi");
      return;
    }

    try {
      if (isEdit) {
        confirmUpdate(async () => {
          await ubahMatakuliah.mutateAsync({
            id: form.id,
            data: { kode: form.kode, nama: form.nama },
          });
          toastSuccess("Berhasil diperbarui");
          resetForm();
        });
      } else {
        await tambahMatakuliah.mutateAsync({ kode: form.kode, nama: form.nama });
        toastSuccess("Berhasil ditambahkan");
        resetForm();
      }
    } catch {
      toastError("Gagal menyimpan data");
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await hapusMatakuliah.mutateAsync(id);
        toastSuccess("Berhasil dihapus");
      } catch {
        toastError("Gagal menghapus data");
      }
    });
  };

  const totalData = matakuliahQuery.data || [];
  const totalPages = Math.ceil(totalData.length / itemsPerPage);
  const paginatedData = totalData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-black">📘 Daftar Matakuliah</h2>
        <Button
          className="bg-green-300 text-black font-bold border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          + Tambah Matakuliah
        </Button>
      </div>

      {matakuliahQuery.isLoading ? (
        <p className="text-gray-700 font-semibold">Loading...</p>
      ) : matakuliahQuery.isError ? (
        <p className="text-red-600 font-semibold">Gagal memuat data</p>
      ) : (
        <>
          <ul className="space-y-3">
            {paginatedData.map((mk) => (
              <li
                key={mk.id}
                className="flex justify-between items-center p-4 border-2 border-black bg-yellow-200 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                <span className="text-black font-bold">
                  {mk.kode} - {mk.nama}
                </span>
                <div className="space-x-2">
                  <Button
                    className="bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    onClick={() => {
                      setForm(mk);
                      setIsEdit(true);
                      setIsModalOpen(true);
                    }}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    className="bg-red-400 hover:bg-red-500 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    onClick={() => handleDelete(mk.id)}
                  >
                    🗑️ Hapus
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-end items-center mt-4 gap-2">
            <button
              className="px-4 py-2 bg-gray-300 border border-black disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white border border-black shadow">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 border border-black disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      <ModalMatakuliah
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Matakuliah;
