import React, { useState } from "react";
import Button from "../../../components/atoms/Button";
import TableDosen from "./TableDosen";
import ModalDosen from "./ModalDosen";
import { ToastContainer } from "react-toastify";

import {
  toastSuccess,
  toastError,
} from "../../../Utils/Helpers/ToastHelpers.jsx";
import {
  confirmDelete,
  confirmUpdate,
} from "../../../Utils/Helpers/SwalHelpers.jsx";

import { useDosen } from "../../../Utils/hooks/useDosen.js";

const Dosen = () => {
  const [form, setForm] = useState({ id: "", nidn: "", nama: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 👉 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    dosenQuery,
    tambahDosen,
    ubahDosen,
    hapusDosen,
  } = useDosen();

  const resetForm = () => {
    setForm({ id: "", nidn: "", nama: "" });
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nidn || !form.nama) {
      toastError("NIDN dan Nama wajib diisi");
      return;
    }

    try {
      if (isEdit) {
        confirmUpdate(async () => {
          await ubahDosen.mutateAsync({ id: form.id, data: form });
          toastSuccess("Data berhasil diperbarui");
          resetForm();
        });
      } else {
        await tambahDosen.mutateAsync(form);
        toastSuccess("Data berhasil ditambahkan");
        resetForm();
      }
    } catch {
      toastError("Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await hapusDosen.mutateAsync(id);
        toastSuccess("Data berhasil dihapus");
      } catch {
        toastError("Gagal menghapus data");
      }
    });
  };

  const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
      <div className="flex justify-end gap-2 mt-4">
        <Button
          className="bg-gray-300"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span className="px-3 py-2 bg-white border border-black shadow-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          className="bg-gray-300"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Daftar Dosen</h2>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          + Tambah Dosen
        </Button>
      </div>

      {dosenQuery.isLoading ? (
        <p>Loading...</p>
      ) : dosenQuery.isError ? (
        <p>Gagal memuat data.</p>
      ) : (
        <>
          <TableDosen
            data={dosenQuery.data.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
            onEdit={(d) => {
              setForm(d);
              setIsEdit(true);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
          {renderPagination(dosenQuery.data.length)}
        </>
      )}

      <ModalDosen
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

export default Dosen;
