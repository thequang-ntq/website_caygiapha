import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getThanhVienAll, createThanhVien, updateThanhVien, deleteThanhVien } from "../../services/ThanhVienService";
import { createAnh, updateAnh, getAnhAll } from "../../services/AnhService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserInfoSidebar from "../../components/user_info_sidebar/UserInfoSidebar";
import MainFunctionsSidebar from "../../components/main_functions_sidebar/MainFunctionsSidebar";

const MemberPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserThanhVienId, setCurrentUserThanhVienId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [anhData, setAnhData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentMember, setCurrentMember] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    hoten: "",
    gioitinh: "Khác",
    ngaysinh: "",
    noisinh: "",
    diachi: "",
    sdt: "",
    tieusu: "",
    anh_url: "",
    tinhtrang: "Còn sống",
  });

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(data);
    setIsAdmin(parsedUser.phanquyen === "Admin");
    setCurrentUser(parsedUser.id); // đây là taikhoan.id

    // Thêm dòng này để lấy thanhvien_id của người đang đăng nhập
    setCurrentUserThanhVienId(parsedUser.thanhvien_id);
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [tvRes, anhRes] = await Promise.all([
        getThanhVienAll(),
        getAnhAll(),
      ]);
      setMembers(tvRes.data);
      setFilteredMembers(tvRes.data);
      setAnhData(anhRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu thành viên!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member =>
        member.hoten.toLowerCase().includes(query) ||
        (member.gioitinh && member.gioitinh.toLowerCase().includes(query)) ||
        (member.ngaysinh && formatDate(member.ngaysinh).toLowerCase().includes(query))
      );
      setFilteredMembers(filtered);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.hoten.trim()) {
      errors.hoten = "Họ tên không được để trống";
    } else if (formData.hoten.length > 200) {
      errors.hoten = "Họ tên không được vượt quá 200 ký tự";
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
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
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
    setPreviewImage(null);
    setSelectedFile(null);
    setFormData({
      hoten: "",
      gioitinh: "Khác",
      ngaysinh: "",
      noisinh: "",
      diachi: "",
      sdt: "",
      tieusu: "",
      anh_url: "",
      tinhtrang: "Còn sống",
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (member) => {
    setFormErrors({});
    setCurrentMember(member);
    setPreviewImage(member.anh_url || null);
    setSelectedFile(null);
    setFormData({
      hoten: member.hoten || "",
      gioitinh: member.gioitinh || "Khác",
      ngaysinh: member.ngaysinh ? formatDateForInput(member.ngaysinh) : "",
      noisinh: member.noisinh || "",
      diachi: member.diachi || "",
      sdt: member.sdt || "",
      tieusu: member.tieusu || "",
      anh_url: member.anh_url || "",
      tinhtrang: member.tinhtrang || "Còn sống",
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleOpenDetailModal = (member) => {
    setCurrentMember(member);
    setShowDetailModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let imageUrl = "";
      
      // Simulate image upload (in real app, upload to server)
      if (selectedFile) {
        imageUrl = `/images/${selectedFile.name}`;
      }

      const dataToSubmit = {
        ...formData,
        anh_url: imageUrl || null,
        dongho_id: 1,
      };

      const tvResponse = await createThanhVien(dataToSubmit);
      const newMemberId = tvResponse.data.id;

      // Add image data if image was uploaded
      if (imageUrl) {
        await createAnh({
          thanhvien_id: newMemberId,
          url: imageUrl,
          caption: null,
          taikhoan_id: currentUser,
        });
      }

      await fetchData();
      setShowAddModal(false);
      setSuccessMessage("Thêm thành viên thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi thêm thành viên:", err);
      setError("Không thể thêm thành viên!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let imageUrl = formData.anh_url;

      // If new image selected, update URL
      if (selectedFile) {
        imageUrl = `/images/${selectedFile.name}`;
      }

      const dataToSubmit = {
        ...formData,
        anh_url: imageUrl || null,
      };

      await updateThanhVien(currentMember.id, dataToSubmit);

      // Update image data if image was changed
      if (selectedFile) {
        const existingAnh = anhData.find(a => a.thanhvien_id === currentMember.id);
        if (existingAnh) {
          await updateAnh(existingAnh.id, {
            url: imageUrl,
            taikhoan_id: currentUser,
          });
        } else {
          await createAnh({
            thanhvien_id: currentMember.id,
            url: imageUrl,
            caption: null,
            taikhoan_id: currentUser,
          });
        }
      }

      await fetchData();
      setShowEditModal(false);
      setSuccessMessage("Sửa thành viên thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi sửa thành viên:", err);
      setError("Không thể sửa thành viên!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteThanhVien(deleteId);
      await fetchData();
      setShowDeleteModal(false);
      setSuccessMessage("Xóa thành viên thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setError("Không thể xóa thành viên!");
      setTimeout(() => setError(""), 3000);
    }
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
    <div className="member-container vh-100 vw-100">
      <Navbar activePage="member" />

      <div className="container-fluid mt-4 px-4">
        <div className="row">
          <div className="col-md-3 mb-4">
            <UserInfoSidebar />
            <MainFunctionsSidebar activePage="member" />
          </div>

          <div className="col-md-9">
            <div className="member-info-card p-4 shadow-sm rounded-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-people me-2"></i>
                  Danh sách thành viên
                </h5>
                <div className="d-flex align-items-center gap-3">
                  <div className="search-container">
                    <i className="bi bi-search search-icon"></i>
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Tìm kiếm thành viên..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                  {isAdmin && (
                    <button className="btn btn-add-member" onClick={handleOpenAddModal}>
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
                      <th style={{ width: "40%" }}>Họ tên</th>
                      <th style={{ width: "20%" }}>Giới tính</th>
                      <th style={{ width: "25%" }}>Ngày sinh</th>
                      {isAdmin && <th style={{ width: "15%" }} className="text-center">Thao tác</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member.id} onClick={() => handleOpenDetailModal(member)} style={{ cursor: 'pointer' }}>
                        <td className="fw-semibold">{member.hoten}</td>
                        <td>{member.gioitinh || <span className="text-muted fst-italic">Chưa có</span>}</td>
                        <td>{member.ngaysinh ? formatDate(member.ngaysinh) : <span className="text-muted fst-italic">Chưa có</span>}</td>
                        {isAdmin && (
                          <td className="text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleOpenEditModal(member)}
                            >
                              Sửa
                            </button>

                            {currentUserThanhVienId && member.id !== currentUserThanhVienId && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleOpenDeleteModal(member.id)}
                              >
                                Xóa
                              </button>
                            )}
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
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {showAddModal ? (
                    <>
                      <i className="bi bi-person-plus me-2"></i> Thêm thành viên mới
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-check me-2"></i> Chỉnh sửa thành viên
                    </>
                  )}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}></button>
              </div>
              <form onSubmit={showAddModal ? handleSubmitAdd : handleSubmitEdit}>
                <div className="modal-body">
                  {/* Image Upload */}
                  <div className="mb-3 text-center">
                    <label className="form-label fw-semibold d-block">
                      <i className="bi bi-image me-1"></i>
                      Ảnh đại diện
                    </label>
                    {previewImage && (
                      <div className="mb-3">
                        <img src={previewImage} alt="Preview" className="preview-image" />
                      </div>
                    )}
                    <input
                      type="file"
                      className="d-none"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="imageUpload" className="btn btn-outline-primary">
                      <i className="bi bi-cloud-upload me-2"></i>
                      Tải ảnh lên
                    </label>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-person me-1"></i>
                        Họ tên <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.hoten ? 'is-invalid' : ''}`}
                        value={formData.hoten}
                        onChange={(e) => handleInputChange('hoten', e.target.value)}
                        placeholder="Nhập họ tên..."
                        maxLength={200}
                      />
                      {formErrors.hoten && (
                        <div className="invalid-feedback d-block">
                          <i className="bi bi-exclamation-circle me-1"></i>{formErrors.hoten}
                        </div>
                      )}
                      <small className="text-muted">{formData.hoten.length}/200 ký tự</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-gender-ambiguous me-1"></i>
                        Giới tính
                      </label>
                      <select
                        className="form-select"
                        value={formData.gioitinh}
                        onChange={(e) => handleInputChange('gioitinh', e.target.value)}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-calendar-date me-1"></i>
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.ngaysinh}
                        onChange={(e) => handleInputChange('ngaysinh', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-geo-alt me-1"></i>
                        Nơi sinh
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.noisinh}
                        onChange={(e) => handleInputChange('noisinh', e.target.value)}
                        placeholder="Nhập nơi sinh..."
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-house-door me-1"></i>
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.diachi}
                      onChange={(e) => handleInputChange('diachi', e.target.value)}
                      placeholder="Nhập địa chỉ..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-telephone me-1"></i>
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.sdt}
                      onChange={(e) => handleInputChange('sdt', e.target.value)}
                      placeholder="Nhập số điện thoại..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-journal-text me-1"></i>
                      Tiểu sử
                    </label>
                    <textarea
                      className="form-control"
                      value={formData.tieusu}
                      onChange={(e) => handleInputChange('tieusu', e.target.value)}
                      placeholder="Nhập tiểu sử..."
                      rows={4}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-heart-pulse me-1"></i>
                      Tình trạng
                    </label>
                    <select
                      className="form-select"
                      value={formData.tinhtrang}
                      onChange={(e) => handleInputChange('tinhtrang', e.target.value)}
                    >
                      <option value="Còn sống">Còn sống</option>
                      <option value="Đã mất">Đã mất</option>
                    </select>
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
      {showDetailModal && currentMember && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowDetailModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-info-circle me-2"></i>Chi tiết thành viên
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="detail-box">
                  {currentMember.anh_url && (
                    <div className="text-center mb-4">
                      <img src={currentMember.anh_url} alt={currentMember.hoten} className="detail-image" />
                    </div>
                  )}
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-person me-2"></i>Họ tên:</div>
                    <div className="info-value">{currentMember.hoten}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-gender-ambiguous me-2"></i>Giới tính:</div>
                    <div className="info-value">{currentMember.gioitinh || <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-calendar-date me-2"></i>Ngày sinh:</div>
                    <div className="info-value">{currentMember.ngaysinh ? formatDate(currentMember.ngaysinh) : <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-geo-alt me-2"></i>Nơi sinh:</div>
                    <div className="info-value">{currentMember.noisinh || <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-house-door me-2"></i>Địa chỉ:</div>
                    <div className="info-value">{currentMember.diachi || <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-telephone me-2"></i>Số điện thoại:</div>
                    <div className="info-value">{currentMember.sdt || <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-journal-text me-2"></i>Tiểu sử:</div>
                    <div className="info-value">{currentMember.tieusu || <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-heart-pulse me-2"></i>Tình trạng:</div>
                    <div className="info-value">
                      <span className={`badge ${currentMember.tinhtrang === 'Còn sống' ? 'bg-success' : 'bg-secondary'}`}>
                        {currentMember.tinhtrang}
                      </span>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-clock me-2"></i>Thời điểm tạo:</div>
                    <div className="info-value">{formatDateTime(currentMember.thoidiemtao)}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-clock-history me-2"></i>Thời điểm cập nhật:</div>
                    <div className="info-value">{formatDateTime(currentMember.thoidiemcapnhat)}</div>
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
                <p className="mb-0">Bạn có chắc chắn muốn xóa thành viên này?</p>
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

export default MemberPage;