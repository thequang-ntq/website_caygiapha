import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getDongHoAll, updateDongHo } from "../../services/DongHoService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserInfoSidebar from "../../components/user_info_sidebar/UserInfoSidebar";
import MainFunctionsSidebar from "../../components/main_functions_sidebar/MainFunctionsSidebar";

const FamilyPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dongHo, setDongHo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  // Form cập nhật (Sửa)
  const [formData, setFormData] = useState({
    ten: "",
    quequan: "",
    tenchinhanh: "",
    ghichu: "",
  });

  // --- Lấy dữ liệu dòng họ ---
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }
    if (data) {
      const parsedUser = JSON.parse(data);
      setIsAdmin(parsedUser.phanquyen === "Admin");
    }

    fetchDongHo();
  }, [navigate]);

  const fetchDongHo = async () => {
    try {
      const res = await getDongHoAll();
      // Lấy dòng họ đầu tiên (hoặc có thể lọc theo điều kiện)
      if (res.data && res.data.length > 0) {
        setDongHo(res.data[0]);
        setFormData({
          ten: res.data[0].ten || "",
          quequan: res.data[0].quequan || "",
          tenchinhanh: res.data[0].tenchinhanh || "",
          ghichu: res.data[0].ghichu || "",
        });
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu dòng họ!");
    } finally {
      setLoading(false);
    }
  };

  // --- Validate form ---
  const validateForm = () => {
    const errors = {};

    // Tên dòng họ: bắt buộc, tối đa 50 ký tự
    if (!formData.ten.trim()) {
      errors.ten = "Tên dòng họ không được để trống";
    } else if (formData.ten.length > 50) {
      errors.ten = "Tên dòng họ không được vượt quá 50 ký tự";
    }

    // Quê quán: bắt buộc, tối đa 255 ký tự
    if (!formData.quequan.trim()) {
      errors.quequan = "Quê quán không được để trống";
    } else if (formData.quequan.length > 255) {
      errors.quequan = "Quê quán không được vượt quá 255 ký tự";
    }

    // Tên chi nhánh: không bắt buộc, tối đa 255 ký tự
    if (formData.tenchinhanh && formData.tenchinhanh.length > 255) {
      errors.tenchinhanh = "Tên chi nhánh không được vượt quá 255 ký tự";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Xử lý thay đổi input ---
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Xóa lỗi của field khi user bắt đầu sửa
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  // --- Xử lý mở modal sửa ---
  const handleOpenEditModal = () => {
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormErrors({});
  };

  // --- Xử lý submit form ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate trước khi submit
    if (!validateForm()) {
      return;
    }

    try {
      await updateDongHo(dongHo.id, formData);
      await fetchDongHo();
      handleCloseEditModal();
      
      // Hiển thị thông báo thành công
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (err) {
      console.error("Lỗi khi cập nhật dữ liệu:", err);
      setError("Không thể cập nhật dữ liệu!");
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
    <div className="family-container vh-100 vw-100">
      {/* Navbar */}
      <Navbar activePage="family" />

      {/* Nội dung chính */}
      <div className="container-fluid mt-4 px-4">
        <div className="row">
          {/* Cột trái */}
          <div className="col-md-3 mb-4">
            <UserInfoSidebar />
            <MainFunctionsSidebar activePage="family" />
          </div>

          {/* Cột phải */}
          <div className="col-md-9">
            <div className="family-info-card p-4 shadow-sm rounded-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-info-circle-fill me-2"></i>
                    Thông tin dòng họ
                </h5>
              </div>

              {/* Thông báo thành công */}
              {showSuccessAlert && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Cập nhật thông tin dòng họ thành công!
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

              {/* Bảng dòng họ và nút Sửa */}
              {dongHo ? (
                <div className="family-detail-box">
                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-house-door-fill me-2"></i>
                      Tên dòng họ:
                    </div>
                    <div className="info-value">{dongHo.ten}</div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      Quê quán:
                    </div>
                    <div className="info-value">
                      {dongHo.quequan}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-people-fill me-2"></i>
                      Tên chi nhánh:
                    </div>
                    <div className="info-value">
                      {dongHo.tenchinhanh || <span className="text-muted fst-italic">Chưa cập nhật</span>}
                    </div>
                  </div>

                  <div className="info-row-full">
                    <div className="info-label">
                      <i className="bi bi-journal-text me-2"></i>
                      Ghi chú:
                    </div>
                    <div className="info-value-full">
                      {dongHo.ghichu || <span className="text-muted fst-italic">Chưa có ghi chú</span>}
                    </div>
                  </div>

                  {/* Hiện nút Sửa nếu là Admin */}
                  {isAdmin && (
                    <>
                      <div className="text-center mt-4">
                        <button
                          className="btn btn-edit-family"
                          onClick={handleOpenEditModal}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                          Sửa dòng họ
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-inbox" style={{ fontSize: "48px" }}></i>
                  <p className="mt-3">Chưa có thông tin dòng họ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal sửa thông tin */}
      {showEditModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseEditModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-square me-2"></i>
                  Chỉnh sửa thông tin dòng họ
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseEditModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-house-door me-1"></i>
                        Tên dòng họ <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.ten ? 'is-invalid' : ''}`}
                        value={formData.ten}
                        onChange={(e) => handleInputChange('ten', e.target.value)}
                        placeholder="Nhập tên dòng họ"
                        maxLength={50}
                      />
                      {formErrors.ten && (
                        <div className="invalid-feedback d-block">
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {formErrors.ten}
                        </div>
                      )}
                      <small className="text-muted">
                        {formData.ten.length}/50 ký tự
                      </small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-geo-alt me-1"></i>
                        Quê quán <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.quequan ? 'is-invalid' : ''}`}
                        value={formData.quequan}
                        onChange={(e) => handleInputChange('quequan', e.target.value)}
                        placeholder="Nhập quê quán"
                        maxLength={255}
                      />
                      {formErrors.quequan && (
                        <div className="invalid-feedback d-block">
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {formErrors.quequan}
                        </div>
                      )}
                      <small className="text-muted">
                        {formData.quequan.length}/255 ký tự
                      </small>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-people me-1"></i>
                      Tên chi nhánh
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.tenchinhanh ? 'is-invalid' : ''}`}
                      value={formData.tenchinhanh}
                      onChange={(e) => handleInputChange('tenchinhanh', e.target.value)}
                      placeholder="Nhập tên chi nhánh"
                      maxLength={255}
                    />
                    {formErrors.tenchinhanh && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {formErrors.tenchinhanh}
                      </div>
                    )}
                    <small className="text-muted">
                      {formData.tenchinhanh.length}/255 ký tự
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-journal-text me-1"></i>
                      Ghi chú
                    </label>
                    <textarea
                      className="form-control"
                      rows="5"
                      value={formData.ghichu}
                      onChange={(e) => handleInputChange('ghichu', e.target.value)}
                      placeholder="Nhập ghi chú về dòng họ"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseEditModal}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-1"></i>
                    Cập nhật
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

export default FamilyPage;