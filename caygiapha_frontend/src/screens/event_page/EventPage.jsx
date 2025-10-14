import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getSuKienAll, createSuKien, updateSuKien, deleteSuKien } from "../../services/SuKienService";
import { getTaiKhoanAll } from "../../services/TaiKhoanService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserInfoSidebar from "../../components/user_info_sidebar/UserInfoSidebar";
import MainFunctionsSidebar from "../../components/main_functions_sidebar/MainFunctionsSidebar";

const EventPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [taiKhoans, setTaiKhoans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentEvent, setCurrentEvent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    tieude: "",
    mota: "",
    ngay: "",
    lap: "Không",
    thoigianlap: "",
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
      const skRes = await getSuKienAll();
      setEvents(skRes.data);
      setFilteredEvents(skRes.data);

      const tkRes = await getTaiKhoanAll();
      setTaiKhoans(tkRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu sự kiện!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.tieude.toLowerCase().includes(query) ||
        (event.mota && event.mota.toLowerCase().includes(query)) ||
        event.ngay.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.tieude.trim()) {
      errors.tieude = "Tiêu đề không được để trống";
    } else if (formData.tieude.length > 200) {
      errors.tieude = "Tiêu đề không được vượt quá 200 ký tự";
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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
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
      lap: "Không",
      thoigianlap: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (event) => {
    setFormErrors({});
    setCurrentEvent(event);
    setFormData({
      tieude: event.tieude || "",
      mota: event.mota || "",
      ngay: event.ngay ? formatDateForInput(event.ngay) : "",
      lap: event.lap || "Không",
      thoigianlap: event.thoigianlap || "",
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleOpenDetailModal = (event) => {
    setCurrentEvent(event);
    setShowDetailModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSubmit = {
        ...formData,
        taikhoan_id: currentUser,
      };
      await createSuKien(dataToSubmit);
      await fetchData();
      setShowAddModal(false);
      setSuccessMessage("Thêm sự kiện thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi thêm sự kiện:", err);
      setError("Không thể thêm sự kiện!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateSuKien(currentEvent.id, formData);
      await fetchData();
      setShowEditModal(false);
      setSuccessMessage("Sửa sự kiện thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi sửa sự kiện:", err);
      setError("Không thể sửa sự kiện!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteSuKien(deleteId);
      await fetchData();
      setShowDeleteModal(false);
      setSuccessMessage("Xóa sự kiện thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setError("Không thể xóa sự kiện!");
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
    <div className="event-container vh-100 vw-100">
      <Navbar activePage="event" />

      <div className="container-fluid mt-4 px-4">
        <div className="row">
          <div className="col-md-3 mb-4">
            <UserInfoSidebar />
            <MainFunctionsSidebar activePage="event" />
          </div>

          <div className="col-md-9">
            <div className="event-info-card p-4 shadow-sm rounded-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-calendar-event me-2"></i>
                  Danh sách sự kiện
                </h5>
                <div className="d-flex align-items-center gap-3">
                  <div className="search-container">
                    <i className="bi bi-search search-icon"></i>
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Tìm kiếm sự kiện..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                  {isAdmin && (
                    <button className="btn btn-add-event" onClick={handleOpenAddModal}>
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
                      <th style={{ width: "30%" }}>Tiêu đề</th>
                      <th style={{ width: "40%" }}>Mô tả</th>
                      <th style={{ width: "15%" }}>Ngày</th>
                      {isAdmin && <th style={{ width: "15%" }} className="text-center">Thao tác</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr key={event.id} onClick={() => handleOpenDetailModal(event)} style={{ cursor: 'pointer' }}>
                        <td className="fw-semibold">{event.tieude}</td>
                        <td>{event.mota || <span className="text-muted fst-italic">Chưa có</span>}</td>
                        <td>{event.ngay ? formatDate(event.ngay) : <span className="text-muted fst-italic">Chưa có</span>}</td>
                        {isAdmin && (
                          <td className="text-center" onClick={(e) => e.stopPropagation()}>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleOpenEditModal(event)}>
                              <i className="bi bi-pencil-square"></i> Sửa
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleOpenDeleteModal(event.id)}>
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
                      <i className="bi bi-calendar-plus me-2"></i> Thêm sự kiện mới
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calendar-check me-2"></i> Chỉnh sửa sự kiện
                    </>
                  )}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}></button>
              </div>
              <form onSubmit={showAddModal ? handleSubmitAdd : handleSubmitEdit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                        maxLength={200}
                      />
                      {formErrors.tieude && (
                        <div className="invalid-feedback d-block">
                          <i className="bi bi-exclamation-circle me-1"></i>{formErrors.tieude}
                        </div>
                      )}
                      <small className="text-muted">{formData.tieude.length}/200 ký tự</small>
                    </div>
                    <div className="col-md-6 mb-3">
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
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-arrow-repeat me-1"></i>
                        Lặp
                      </label>
                      <select
                        className="form-select"
                        value={formData.lap}
                        onChange={(e) => handleInputChange('lap', e.target.value)}
                      >
                        <option value="Không">Không</option>
                        <option value="Theo năm">Theo năm</option>
                        <option value="Theo tháng">Theo tháng</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-clock me-1"></i>
                        Thời gian lặp
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.thoigianlap}
                        onChange={(e) => handleInputChange('thoigianlap', e.target.value)}
                        placeholder="Nhập thời gian lặp..."
                        min="0"
                      />
                    </div>
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
      {showDetailModal && currentEvent && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowDetailModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-info-circle me-2"></i>Chi tiết sự kiện
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="detail-box">
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-card-text me-2"></i>Tiêu đề:</div>
                    <div className="info-value">{currentEvent.tieude}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-text-paragraph me-2"></i>Mô tả:</div>
                    <div className="info-value">{currentEvent.mota || <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-calendar-date me-2"></i>Ngày:</div>
                    <div className="info-value">{currentEvent.ngay ? formatDate(currentEvent.ngay) : <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-arrow-repeat me-2"></i>Lặp:</div>
                    <div className="info-value">{currentEvent.lap}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-clock me-2"></i>Thời gian lặp:</div>
                    <div className="info-value">{currentEvent.thoigianlap || <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-person me-2"></i>Tài khoản tạo:</div>
                    <div className="info-value">{getTaiKhoanName(currentEvent.taikhoan_id)}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-clock-history me-2"></i>Thời điểm tạo:</div>
                    <div className="info-value">{formatDateTime(currentEvent.thoidiemtao)}</div>
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
                <p className="mb-0">Bạn có chắc chắn muốn xóa sự kiện này?</p>
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

export default EventPage;