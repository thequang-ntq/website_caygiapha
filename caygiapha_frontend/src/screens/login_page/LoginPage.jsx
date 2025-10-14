import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getTaiKhoanAll, updateTaiKhoan } from "../../services/TaiKhoanService";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [tendangnhap, setTendangnhap] = useState("");
  const [matkhau, setMatkhau] = useState("");
  const [errorTen, setErrorTen] = useState("");
  const [errorMatkhau, setErrorMatkhau] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrorTen("");
    setErrorMatkhau("");
    setErrorLogin("");

    let hasError = false;

    // Validate inputs
    if (tendangnhap.trim() === "") {
      setErrorTen("Tên đăng nhập không được để trống");
      hasError = true;
    }
    if (matkhau.trim() === "") {
      setErrorMatkhau("Mật khẩu không được để trống");
      hasError = true;
    }
    if (hasError) return;

    try {
      const response = await getTaiKhoanAll();
      const list = response.data;

      if (!Array.isArray(list)) {
        setErrorLogin("Lỗi dữ liệu từ server!");
        return;
      }

      const found = list.find(
        (tk) =>
          tk.tendangnhap?.trim() === tendangnhap.trim() &&
          tk.matkhau?.trim() === matkhau.trim()
      );

      if (!found) {
        setErrorLogin("Tên đăng nhập hoặc mật khẩu chưa đúng!");
      } else {
        // Generate current timestamp in GMT+7 (Vietnam)
        const now = new Date();
        const gmt7Offset = 7 * 60; // GMT+7 in minutes
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000); // Convert to UTC
        const gmt7Time = new Date(utc + (gmt7Offset * 60000)); // Adjust to GMT+7
        const year = gmt7Time.getFullYear();
        const month = String(gmt7Time.getMonth() + 1).padStart(2, '0');
        const day = String(gmt7Time.getDate()).padStart(2, '0');
        const hours = String(gmt7Time.getHours()).padStart(2, '0');
        const minutes = String(gmt7Time.getMinutes()).padStart(2, '0');
        const seconds = String(gmt7Time.getSeconds()).padStart(2, '0');
        const currentTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        try {
          // Update both landangnhapcuoi and danghoatdong
          await updateTaiKhoan(found.id, { 
            landangnhapcuoi: currentTimestamp, 
            danghoatdong: 1  // Use 1 for true in MySQL BOOLEAN
          });
          
          console.log("Cập nhật trạng thái đăng nhập thành công");
        } catch (error) {
          console.error("Lỗi khi cập nhật thời điểm đăng nhập cuối:", error);
          // Don't block login if update fails, just log it
          console.warn("Tiếp tục đăng nhập mặc dù cập nhật thất bại");
        }

        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(found));

        // Navigate to home page
        navigate("/home");
      }
    } catch (error) {
      console.error("Lỗi khi kết nối đến máy chủ:", error);
      setErrorLogin("Không thể kết nối đến máy chủ!");
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100 vw-100">
      <div className="login-card p-5 shadow-lg rounded-4">
        <h2 className="text-center mb-4 fw-bold text-primary">Cây gia phả</h2>

        <form onSubmit={handleLogin}>
          {/* Tên đăng nhập */}
          <div className="form-group mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={tendangnhap}
              onChange={(e) => setTendangnhap(e.target.value)}
              placeholder="Nhập tên đăng nhập..."
            />
            {errorTen && <small className="text-danger">{errorTen}</small>}
          </div>

          {/* Mật khẩu */}
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={matkhau}
              onChange={(e) => setMatkhau(e.target.value)}
              placeholder="Nhập mật khẩu..."
            />
            {errorMatkhau && <small className="text-danger">{errorMatkhau}</small>}
          </div>

          {/* Lỗi chung */}
          {errorLogin && (
            <div className="text-center mb-3">
              <small className="text-danger fw-semibold">{errorLogin}</small>
            </div>
          )}

          {/* Nút đăng nhập */}
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary px-5 py-2 fw-semibold">
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;