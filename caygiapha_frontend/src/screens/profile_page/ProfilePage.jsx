import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getTaiKhoanById, updateTaiKhoan } from "../../services/TaiKhoanService";
import { getThanhVienById } from "../../services/ThanhVienService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserInfoSidebar from "../../components/user_info_sidebar/UserInfoSidebar";
import MainFunctionsSidebar from "../../components/main_functions_sidebar/MainFunctionsSidebar";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [taiKhoan, setTaiKhoan] = useState(null);
  const [thanhVien, setThanhVien] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Form đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    matkhaucu: "",
    matkhaumoi: "",
    xacnhanmatkhau: "",
  });

  // --- Lấy dữ liệu profile ---
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(data);
    fetchProfile(parsedUser.id, parsedUser.thanhvien_id);
  }, [navigate]);

  const fetchProfile = async (taikhoanId, thanhvienId) => {
    try {
      // Lấy thông tin tài khoản
      const tkRes = await getTaiKhoanById(taikhoanId);
      setTaiKhoan(tkRes.data);

      // Lấy thông tin thành viên
      const tvRes = await getThanhVienById(thanhvienId);
      setThanhVien(tvRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu thông tin cá nhân!");
    } finally {
      setLoading(false);
    }
  };

  // --- Validate form đổi mật khẩu ---
  const validatePasswordForm = () => {
    const errors = {};

    // Mật khẩu cũ
    if (!passwordForm.matkhaucu.trim()) {
      errors.matkhaucu = "Mật khẩu cũ không được để trống";
    } else if (passwordForm.matkhaucu.length > 255) {
      errors.matkhaucu = "Mật khẩu cũ không được vượt quá 255 ký tự";
    } else if (passwordForm.matkhaucu !== taiKhoan.matkhau) {
      errors.matkhaucu = "Mật khẩu cũ không đúng";
    }

    // Mật khẩu mới
    if (!passwordForm.matkhaumoi.trim()) {
      errors.matkhaumoi = "Mật khẩu mới không được để trống";
    } else if (passwordForm.matkhaumoi.length > 255) {
      errors.matkhaumoi = "Mật khẩu mới không được vượt quá 255 ký tự";
    } else if (passwordForm.matkhaumoi === passwordForm.matkhaucu) {
      errors.matkhaumoi = "Mật khẩu mới phải khác mật khẩu cũ";
    }

    // Xác nhận mật khẩu
    if (!passwordForm.xacnhanmatkhau.trim()) {
      errors.xacnhanmatkhau = "Xác nhận mật khẩu không được để trống";
    } else if (passwordForm.xacnhanmatkhau.length > 255) {
      errors.xacnhanmatkhau = "Xác nhận mật khẩu không được vượt quá 255 ký tự";
    } else if (passwordForm.xacnhanmatkhau !== passwordForm.matkhaumoi) {
      errors.xacnhanmatkhau = "Xác nhận mật khẩu không khớp với mật khẩu mới";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Xử lý thay đổi input ---
  const handlePasswordInputChange = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  // --- Xử lý mở/đóng modal ---
  const handleOpenPasswordModal = () => {
    setFormErrors({});
    setPasswordForm({
      matkhaucu: "",
      matkhaumoi: "",
      xacnhanmatkhau: "",
    });
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setFormErrors({});
    setPasswordForm({
      matkhaucu: "",
      matkhaumoi: "",
      xacnhanmatkhau: "",
    });
  };

  // --- Xử lý submit đổi mật khẩu ---
  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    try {
      // Cập nhật mật khẩu
      const updateData = {
        ...taiKhoan,
        matkhau: passwordForm.matkhaumoi,
      };
      
      await updateTaiKhoan(taiKhoan.id, updateData);
      
      // Cập nhật localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({ ...userData, matkhau: passwordForm.matkhaumoi }));
      
      // Reload thông tin
      await fetchProfile(taiKhoan.id, taiKhoan.thanhvien_id);
      
      handleClosePasswordModal();

      // Hiển thị thông báo thành công
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (err) {
      console.error("Lỗi khi đổi mật khẩu:", err);
      setError("Không thể đổi mật khẩu!");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // --- Đang tải ---
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 vw-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container vh-100 vw-100">
      {/* Navbar */}
      <Navbar activePage="profile" />

      {/* Nội dung chính */}
      <div className="container-fluid mt-4 px-4">
        <div className="row">
          {/* Cột trái */}
          <div className="col-md-3 mb-4">
            <UserInfoSidebar />
            <MainFunctionsSidebar activePage="profile" />
          </div>

          {/* Cột phải */}
          <div className="col-md-9">
            <div className="profile-info-card p-4 shadow-sm rounded-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-person-circle me-2"></i>
                    Thông tin cá nhân
                </h5>
              </div>

              {/* Thông báo thành công */}
              {showSuccessAlert && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Đổi mật khẩu thành công!
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSuccessAlert(false)}
                  ></button>
                </div>
              )}

              {/* Thông báo lỗi */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}

              {/* Thông tin cá nhân */}
              {taiKhoan && thanhVien ? (
                <div className="profile-detail-box">
                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-person-badge me-2"></i>
                      Tên đăng nhập:
                    </div>
                    <div className="info-value">{taiKhoan.tendangnhap}</div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-key-fill me-2"></i>
                      Mật khẩu:
                    </div>
                    <div className="info-value">••••••••</div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-envelope-fill me-2"></i>
                      Email:
                    </div>
                    <div className="info-value">
                      {taiKhoan.email || <span className="text-muted fst-italic">Chưa cập nhật</span>}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-shield-check me-2"></i>
                      Quyền:
                    </div>
                    <div className="info-value">
                      <span className={`badge ${taiKhoan.phanquyen === 'Admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {taiKhoan.phanquyen}
                      </span>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-gender-ambiguous me-2"></i>
                      Giới tính:
                    </div>
                    <div className="info-value">
                      {thanhVien.gioitinh || <span className="text-muted fst-italic">Chưa cập nhật</span>}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-telephone-fill me-2"></i>
                      Số điện thoại:
                    </div>
                    <div className="info-value">
                      {thanhVien.sdt || <span className="text-muted fst-italic">Chưa cập nhật</span>}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-calendar-event me-2"></i>
                      Ngày sinh:
                    </div>
                    <div className="info-value">
                      {thanhVien.ngaysinh ? (
                        (() => {
                          const d = new Date(thanhVien.ngaysinh);
                          const day = d.getDate().toString().padStart(2, '0');
                          const month = (d.getMonth() + 1).toString().padStart(2, '0');
                          const year = d.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()
                      ) : (
                        <span className="text-muted fst-italic">Chưa cập nhật</span>
                      )}
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <button
                      className="btn btn-change-password"
                      onClick={handleOpenPasswordModal}
                    >
                      <i className="bi bi-shield-lock me-2"></i>
                      Đổi mật khẩu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-inbox" style={{ fontSize: "48px" }}></i>
                  <p className="mt-3">Chưa có thông tin cá nhân</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      {showPasswordModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleClosePasswordModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-shield-lock me-2"></i>
                  Đổi mật khẩu
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClosePasswordModal}
                ></button>
              </div>
              <form onSubmit={handleSubmitPassword}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-key me-1"></i>
                      Mật khẩu cũ <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.matkhaucu ? 'is-invalid' : ''}`}
                      value={passwordForm.matkhaucu}
                      onChange={(e) => handlePasswordInputChange('matkhaucu', e.target.value)}
                      placeholder="Nhập mật khẩu cũ..."
                      maxLength={255}
                    />
                    {formErrors.matkhaucu && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {formErrors.matkhaucu}
                      </div>
                    )}
                    <small className="text-muted">
                      {passwordForm.matkhaucu.length}/255 ký tự
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-key-fill me-1"></i>
                      Mật khẩu mới <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.matkhaumoi ? 'is-invalid' : ''}`}
                      value={passwordForm.matkhaumoi}
                      onChange={(e) => handlePasswordInputChange('matkhaumoi', e.target.value)}
                      placeholder="Nhập mật khẩu mới..."
                      maxLength={255}
                    />
                    {formErrors.matkhaumoi && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {formErrors.matkhaumoi}
                      </div>
                    )}
                    <small className="text-muted">
                      {passwordForm.matkhaumoi.length}/255 ký tự
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-check2-circle me-1"></i>
                      Xác nhận mật khẩu mới <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.xacnhanmatkhau ? 'is-invalid' : ''}`}
                      value={passwordForm.xacnhanmatkhau}
                      onChange={(e) => handlePasswordInputChange('xacnhanmatkhau', e.target.value)}
                      placeholder="Nhập lại mật khẩu mới..."
                      maxLength={255}
                    />
                    {formErrors.xacnhanmatkhau && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {formErrors.xacnhanmatkhau}
                      </div>
                    )}
                    <small className="text-muted">
                      {passwordForm.xacnhanmatkhau.length}/255 ký tự
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClosePasswordModal}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-1"></i>
                    Xác nhận đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;