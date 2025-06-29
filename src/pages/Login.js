import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await authLogin(form.email, form.password);
      toast.success("Login berhasil!");

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/dashboard/home");
        } else if (user.role === "user" || user.role === "mahasiswa") {
          navigate("/dashboard/krs");
        } else {
          navigate("/unauthorized");
        }
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Login gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="bg-white p-8 border-4 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] w-full max-w-sm">
        <h2 className="text-3xl font-black mb-6 text-center text-black">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-bold mb-1 text-black">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border-2 border-black px-3 py-2 rounded-md text-black bg-white"
              placeholder="Masukkan email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-bold mb-1 text-black">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border-2 border-black px-3 py-2 rounded-md text-black bg-white"
              placeholder="Masukkan password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-yellow-300 border-2 border-black text-black font-bold py-2 rounded-md shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition flex justify-center items-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <ToastContainer position="top-center" autoClose={3000} />

        <div className="text-center mt-4">
          <p className="text-sm text-black">
            Belum punya akun?{" "}
            <Link to="/register" className="text-blue-800 font-bold underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    
  );
};

export default Login;
