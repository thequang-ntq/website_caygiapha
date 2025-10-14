import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getThanhVienById } from "../../services/ThanhVienService";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserInfoSidebar from "../../components/user_info_sidebar/UserInfoSidebar";
import MainFunctionsSidebar from "../../components/main_functions_sidebar/MainFunctionsSidebar";

const DetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [thanhVien, setThanhVien] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }

    fetchThanhVien();
  }, [id, navigate]);

  const fetchThanhVien = async () => {
    try {
      const tvRes = await getThanhVienById(id);
      setThanhVien(tvRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu thành viên!");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    // Chuyển sang GMT+7
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    const day = String(vietnamTime.getUTCDate()).padStart(2, '0');
    const month = String(vietnamTime.getUTCMonth() + 1).padStart(2, '0');
    const year = vietnamTime.getUTCFullYear();
    const hours = String(vietnamTime.getUTCHours()).padStart(2, '0');
    const minutes = String(vietnamTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(vietnamTime.getUTCSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
    <div className="detail-container vh-100 vw-100">
      <Navbar activePage="detail" />

      <div className="container-fluid mt-4 px-4">
        <div className="row">
          <div className="col-md-3 mb-4">
            <UserInfoSidebar />
            <MainFunctionsSidebar activePage="detail" />
          </div>

          <div className="col-md-9">
            <div className="detail-info-card p-4 shadow-sm rounded-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-file-person-fill me-2"></i>
                    Chi tiết thành viên
                </h5>
                <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Quay lại
                </button>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
              )}

              {thanhVien ? (
                <div className="detail-detail-box">
                  {/* Ảnh ở trên cùng */}
                  <div className="text-center mb-4">
                    {thanhVien.anh_url ? (
                      <img src={thanhVien.anh_url} alt={thanhVien.hoten} className="member-avatar-large" />
                    ) : (
                      <div className="no-avatar">
                        <i className="bi bi-person-circle"></i>
                        <p className="mt-2 text-muted">Chưa có ảnh</p>
                      </div>
                    )}
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-person-fill me-2"></i>
                      Họ tên:
                    </div>
                    <div className="info-value fw-bold fs-5">{thanhVien.hoten}</div>
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
                      <i className="bi bi-calendar-event me-2"></i>
                      Ngày sinh:
                    </div>
                    <div className="info-value">{formatDate(thanhVien.ngaysinh)}</div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      Nơi sinh:
                    </div>
                    <div className="info-value">
                      {thanhVien.noisinh || <span className="text-muted fst-italic">Chưa cập nhật</span>}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-house-door-fill me-2"></i>
                      Địa chỉ:
                    </div>
                    <div className="info-value">
                      {thanhVien.diachi || <span className="text-muted fst-italic">Chưa cập nhật</span>}
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

                  <div className="info-row-full">
                    <div className="info-label">
                      <i className="bi bi-journal-text me-2"></i>
                      Tiểu sử:
                    </div>
                    <div className="info-value-full">
                      {thanhVien.tieusu || <span className="text-muted fst-italic">Chưa có tiểu sử</span>}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-heart-pulse me-2"></i>
                      Tình trạng:
                    </div>
                    <div className="info-value">
                      <span className={`badge ${thanhVien.tinhtrang === 'Còn sống' ? 'bg-success' : 'bg-secondary'}`}>
                        {thanhVien.tinhtrang}
                      </span>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-clock me-2"></i>
                      Thời điểm tạo:
                    </div>
                    <div className="info-value">{formatDateTime(thanhVien.thoidiemtao)}</div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <i className="bi bi-clock-history me-2"></i>
                      Thời điểm cập nhật:
                    </div>
                    <div className="info-value">{formatDateTime(thanhVien.thoidiemcapnhat)}</div>
                  </div>

                  <div className="text-center mt-4">
                    <div className="d-flex gap-3 justify-content-center">
                      <button
                        className="btn btn-relationship"
                        onClick={() => navigate(`/relationship/${id}`)}
                      >
                        <i className="bi bi-diagram-3 me-2"></i>
                        Quan hệ
                      </button>
                      <button
                        className="btn btn-achievement"
                        onClick={() => navigate(`/achievement/${id}`)}
                      >
                        <i className="bi bi-trophy me-2"></i>
                        Thành tích
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-inbox" style={{ fontSize: "48px" }}></i>
                  <p className="mt-3">Không tìm thấy thông tin thành viên</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;