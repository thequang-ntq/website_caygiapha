import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { updateTaiKhoan } from "../../services/TaiKhoanService";

const Navbar = ({ activePage = "home" }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [error, setError] = useState("");

  // --- Hiển thị popup xác nhận đăng xuất ---
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // --- Xác nhận đăng xuất ---
  const confirmLogout = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const accountId = parsedUser.id;

        if (!accountId) {
          throw new Error("Không tìm thấy ID tài khoản trong dữ liệu người dùng");
        }

        // Update danghoatdong to false
        await updateTaiKhoan(accountId, { danghoatdong: 0 });
      }

      // Clear localStorage and navigate to login
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đăng xuất:", err);
      let errorMessage = "Không thể cập nhật trạng thái đăng xuất. Vẫn đăng xuất?";
      
      // Handle specific error cases
      if (err.response?.status === 404) {
        errorMessage = "Tài khoản không tồn tại. Vẫn đăng xuất?";
      } else if (err.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ. Vẫn đăng xuất?";
      } else if (err.response?.status === 500) {
        errorMessage = "Lỗi máy chủ. Vẫn đăng xuất?";
      }

      setError(errorMessage);
      setTimeout(() => {
        // Proceed with logout even if API fails
        localStorage.removeItem("user");
        navigate("/login");
        setError(""); // Clear error after navigation
      }, 2000);
    }
  };

  // --- Hủy đăng xuất ---
  const cancelLogout = () => {
    setShowLogoutModal(false);
    setError("");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-3 shadow-sm">
        <button
          className="btn btn-outline-light navbar-brand fw-bold fs-4 text-primary"
          onClick={() => navigate("/home")}
        >
          Cây gia phả
        </button>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link ${
                  activePage === "home" ? "active" : ""
                }`}
                onClick={() => navigate("/home")}
              >
                Trang chủ
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link ${
                  activePage === "family" ? "active" : ""
                }`}
                onClick={() => navigate("/family")}
              >
                Dòng họ
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link ${
                  activePage === "profile" ? "active" : ""
                }`}
                onClick={() => navigate("/profile")}
              >
                Thông tin cá nhân
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-danger fw-semibold"
                onClick={handleLogoutClick}
              >
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Modal xác nhận đăng xuất */}
      {showLogoutModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={cancelLogout}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Xác nhận đăng xuất</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelLogout}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">Bạn có chắc chắn muốn đăng xuất?</p>
                {error && (
                  <div className="alert alert-danger alert-sm mt-2" role="alert">
                    {error}
                  </div>
                )}
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelLogout}
                >
                  Không
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmLogout}
                >
                  Có
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;