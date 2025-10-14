import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getThanhTichAll, createThanhTich, updateThanhTich, deleteThanhTich } from "../../services/ThanhTichService";
import { getTaiKhoanAll } from "../../services/TaiKhoanService";
import { getThanhVienById } from "../../services/ThanhVienService"; // New service import
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserInfoSidebar from "../../components/user_info_sidebar/UserInfoSidebar";
import MainFunctionsSidebar from "../../components/main_functions_sidebar/MainFunctionsSidebar";

const AchievementPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get thanhvien_id from URL
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [member, setMember] = useState(null); // New state for member data
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [taiKhoans, setTaiKhoans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    tieude: "",
    mota: "",
    ngay: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(data);
    setIsAdmin(parsedUser.phanquyen === "Admin");
    setCurrentUser(parsedUser.id);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [ttRes, tkRes, tvRes] = await Promise.all([
        getThanhTichAll(),
        getTaiKhoanAll(),
        getThanhVienById(id), // Fetch member data
      ]);
      // Filter achievements by thanhvien_id from URL
      const filtered = ttRes.data.filter(tt => tt.thanhvien_id === id);
      setAchievements(filtered);
      setFilteredAchievements(filtered);
      setTaiKhoans(tkRes.data);
      setMember(tvRes.data); // Set member data
      // console.log(member);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu thành tích hoặc thông tin thành viên!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredAchievements(achievements);
    } else {
      const filtered = achievements.filter((achievement, index) =>
        (index + 1).toString().includes(query) ||
        achievement.tieude.toLowerCase().includes(query) ||
        (achievement.ngay && formatDate(achievement.ngay).toLowerCase().includes(query))
      );
      setFilteredAchievements(filtered);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.tieude.trim()) {
      errors.tieude = "Tiêu đề không được để trống";
    } else if (formData.tieude.length > 255) {
      errors.tieude = "Tiêu đề không được vượt quá 255 ký tự";
    }

    if (!formData.ngay) {
      errors.ngay = "Ngày không được để trống";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    const gmt7Offset = 7 * 60 * 60 * 1000; // GMT+7 in milliseconds
    const vietnamTime = new Date(date.getTime() + gmt7Offset);
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
    const gmt7Offset = 7 * 60 * 60 * 1000;
    const vietnamTime = new Date(date.getTime() + gmt7Offset);
    const day = String(vietnamTime.getUTCDate()).padStart(2, '0');
    const month = String(vietnamTime.getUTCMonth() + 1).padStart(2, '0');
    const year = vietnamTime.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleOpenAddModal = () => {
    setFormErrors({});
    setFormData({
      tieude: "",
      mota: "",
      ngay: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (achievement) => {
    setFormErrors({});
    setCurrentAchievement(achievement);
    setFormData({
      tieude: achievement.tieude || "",
      mota: achievement.mota || "",
      ngay: achievement.ngay ? formatDateForInput(achievement.ngay) : "",
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleOpenDetailModal = (achievement) => {
    setCurrentAchievement(achievement);
    setShowDetailModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSubmit = {
        ...formData,
        taikhoan_id: currentUser,
        thanhvien_id: parseInt(id), // Use URL id
      };
      await createThanhTich(dataToSubmit);
      await fetchData();
      setShowAddModal(false);
      setSuccessMessage("Thêm thành tích thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi thêm thành tích:", err);
      setError("Không thể thêm thành tích!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateThanhTich(currentAchievement.id, formData);
      await fetchData();
      setShowEditModal(false);
      setSuccessMessage("Sửa thành tích thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi sửa thành tích:", err);
      setError("Không thể sửa thành tích!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteThanhTich(deleteId);
      await fetchData();
      setShowDeleteModal(false);
      setSuccessMessage("Xóa thành tích thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setError("Không thể xóa thành tích!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getTaiKhoanName = (taikhoanId) => {
    const tk = taiKhoans.find(t => t.id === taikhoanId);
    return tk ? tk.tendangnhap : "Không rõ";
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
    <div className="achievement-container vh-100 vw-100">
      <Navbar activePage="achievement" />

      <div className="container-fluid mt-4 px-4">
        <div className="row">
          <div className="col-md-3 mb-4">
            <UserInfoSidebar />
            <MainFunctionsSidebar activePage="achievement" />
          </div>

          <div className="col-md-9">
            {/* Member Info Section */}
            <div className="member-info-card p-3 mb-4 shadow-sm rounded-4 bg-white d-flex align-items-center">
              <img
                src={member?.anh_url || "https://via.placeholder.com/80"}
                alt="Ảnh đại diện"
                className="member-avatar rounded-circle me-3"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div>
                <h5 className="fw-bold text-primary mb-1">
                  <i className="bi bi-person-circle me-2"></i>
                  {member?.hoten || "Thành viên không xác định"}
                </h5>
                <p className="text-muted mb-0">Thành tích của {member?.hoten || "thành viên này"}</p>
              </div>
            </div>

            <div className="achievement-info-card p-4 shadow-sm rounded-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-trophy me-2"></i>
                  Danh sách thành tích
                </h5>
                <div className="d-flex align-items-center gap-3">
                  <div className="search-container">
                    <i className="bi bi-search search-icon"></i>
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Tìm kiếm thành tích..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                  {isAdmin && (
                    <button className="btn btn-add-achievement" onClick={handleOpenAddModal}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Thêm
                    </button>
                  )}
                </div>
              </div>

              {showSuccessAlert && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {successMessage}
                  <button type="button" className="btn-close" onClick={() => setShowSuccessAlert(false)}></button>
                </div>
              )}

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
              )}

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-header">
                    <tr>
                      <th style={{ width: "10%" }}>STT</th>
                      <th style={{ width: "50%" }}>Tiêu đề</th>
                      <th style={{ width: "25%" }}>Ngày</th>
                      {isAdmin && <th style={{ width: "15%" }} className="text-center">Thao tác</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAchievements.map((achievement, index) => (
                      <tr key={achievement.id} onClick={() => handleOpenDetailModal(achievement)} style={{ cursor: 'pointer' }}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{achievement.tieude}</td>
                        <td>{achievement.ngay ? formatDate(achievement.ngay) : <span className="text-muted fst-italic">Chưa có</span>}</td>
                        {isAdmin && (
                          <td className="text-center" onClick={(e) => e.stopPropagation()}>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleOpenEditModal(achievement)}>
                              <i className="bi bi-pencil-square"></i> Sửa
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleOpenDeleteModal(achievement.id)}>
                              <i className="bi bi-trash"></i> Xóa
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {(showAddModal || showEditModal) && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {showAddModal ? (
                    <>
                      <i className="bi bi-trophy me-2"></i> Thêm thành tích mới
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trophy-fill me-2"></i> Chỉnh sửa thành tích
                    </>
                  )}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}></button>
              </div>
              <form onSubmit={showAddModal ? handleSubmitAdd : handleSubmitEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-card-text me-1"></i>
                      Tiêu đề <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.tieude ? 'is-invalid' : ''}`}
                      value={formData.tieude}
                      onChange={(e) => handleInputChange('tieude', e.target.value)}
                      placeholder="Nhập tiêu đề..."
                      maxLength={255}
                    />
                    {formErrors.tieude && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>{formErrors.tieude}
                      </div>
                    )}
                    <small className="text-muted">{formData.tieude.length}/255 ký tự</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-text-paragraph me-1"></i>
                      Mô tả
                    </label>
                    <textarea
                      className="form-control"
                      value={formData.mota}
                      onChange={(e) => handleInputChange('mota', e.target.value)}
                      placeholder="Nhập mô tả..."
                      rows={4}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-calendar-date me-1"></i>
                      Ngày <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${formErrors.ngay ? 'is-invalid' : ''}`}
                      value={formData.ngay}
                      onChange={(e) => handleInputChange('ngay', e.target.value)}
                      placeholder="Chọn ngày..."
                    />
                    {formErrors.ngay && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>{formErrors.ngay}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  >
                    <i className="bi bi-x-circle me-1"></i>Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-1"></i>{showAddModal ? "Thêm" : "Chỉnh sửa"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi tiết */}
      {showDetailModal && currentAchievement && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowDetailModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-info-circle me-2"></i>Chi tiết thành tích
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="detail-box">
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-card-text me-2"></i>Tiêu đề:</div>
                    <div className="info-value">{currentAchievement.tieude}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-text-paragraph me-2"></i>Mô tả:</div>
                    <div className="info-value">{currentAchievement.mota || <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-calendar-date me-2"></i>Ngày:</div>
                    <div className="info-value">{currentAchievement.ngay ? formatDate(currentAchievement.ngay) : <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-person me-2"></i>Tài khoản tạo:</div>
                    <div className="info-value">{getTaiKhoanName(currentAchievement.taikhoan_id)}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-clock-history me-2"></i>Thời điểm tạo:</div>
                    <div className="info-value">{formatDateTime(currentAchievement.thoidiemtao)}</div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowDetailModal(false)}>
                  <i className="bi bi-check-circle me-1"></i>OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xóa */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowDeleteModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Xác nhận xóa</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">Bạn có chắc chắn muốn xóa thành tích này?</p>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  <i className="bi bi-x-circle me-1"></i>Hủy
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  <i className="bi bi-check-circle me-1"></i>Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementPage;