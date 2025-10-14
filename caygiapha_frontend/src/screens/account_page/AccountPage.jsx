import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getTaiKhoanAll, createTaiKhoan, updateTaiKhoan, deleteTaiKhoan } from "../../services/TaiKhoanService";
import { getThanhVienAll } from "../../services/ThanhVienService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserInfoSidebar from "../../components/user_info_sidebar/UserInfoSidebar";
import MainFunctionsSidebar from "../../components/main_functions_sidebar/MainFunctionsSidebar";

const AccountPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [thanhViens, setThanhViens] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    tendangnhap: "",
    matkhau: "",
    email: "",
    phanquyen: "User",
    thanhvien_id: null,
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
      const tkRes = await getTaiKhoanAll();
      setAccounts(tkRes.data);
      setFilteredAccounts(tkRes.data); // Initialize filtered accounts
      
      const tvRes = await getThanhVienAll();
      setThanhViens(tvRes.data);
      
      if (tvRes.data && tvRes.data.length > 0) {
        setFormData(prev => ({ ...prev, thanhvien_id: tvRes.data[0].id }));
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredAccounts(accounts); // Reset to original list if search is empty
    } else {
      const filtered = accounts.filter(account =>
        account.tendangnhap.toLowerCase().includes(query) ||
        (account.email && account.email.toLowerCase().includes(query)) ||
        account.phanquyen.toLowerCase().includes(query)
      );
      setFilteredAccounts(filtered);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.tendangnhap.trim()) {
      errors.tendangnhap = "Tên đăng nhập không được để trống";
    } else if (formData.tendangnhap.length > 200) {
      errors.tendangnhap = "Tên đăng nhập không được vượt quá 200 ký tự";
    }
    
    if (!formData.matkhau.trim()) {
      errors.matkhau = "Mật khẩu không được để trống";
    } else if (formData.matkhau.length > 255) {
      errors.matkhau = "Mật khẩu không được vượt quá 255 ký tự";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email không được để trống";
    } else if (formData.email.length > 150) {
      errors.email = "Email không được vượt quá 150 ký tự";
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

  const handleOpenAddModal = () => {
    setFormErrors({});
    setFormData({
      tendangnhap: "",
      matkhau: "",
      email: "",
      phanquyen: "User",
      thanhvien_id: thanhViens.length > 0 ? thanhViens[0].id : null,
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (account) => {
    setFormErrors({});
    setCurrentAccount(account);
    setFormData({
      tendangnhap: account.tendangnhap || "",
      matkhau: account.matkhau || "",
      email: account.email || "",
      phanquyen: account.phanquyen || "User",
      thanhvien_id: account.thanhvien_id || (thanhViens.length > 0 ? thanhViens[0].id : null),
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleOpenDetailModal = (account) => {
    setCurrentAccount(account);
    setShowDetailModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createTaiKhoan(formData);
      await fetchData();
      setShowAddModal(false);
      setSuccessMessage("Thêm thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi thêm tài khoản:", err);
      setError("Không thể thêm tài khoản!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateTaiKhoan(currentAccount.id, formData);
      await fetchData();
      setShowEditModal(false);
      setSuccessMessage("Sửa thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi sửa tài khoản:", err);
      setError("Không thể sửa tài khoản!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteTaiKhoan(deleteId);
      await fetchData();
      setShowDeleteModal(false);
      setSuccessMessage("Xóa thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setError("Không thể xóa tài khoản!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getThanhVienName = (thanhvienId) => {
    const tv = thanhViens.find(t => t.id === thanhvienId);
    return tv ? tv.hoten : "Không rõ";
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
    <div className="account-container vh-100 vw-100">
      <Navbar activePage="account" />

      <div className="container-fluid mt-4 px-4">
        <div className="row">
          <div className="col-md-3 mb-4">
            <UserInfoSidebar />
            <MainFunctionsSidebar activePage="account" />
          </div>

          <div className="col-md-9">
            <div className="account-info-card p-4 shadow-sm rounded-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-person-lines-fill me-2"></i>
                    Danh sách tài khoản
                </h5>
                <div className="d-flex align-items-center gap-3">
                  <div className="search-container">
                    <i className="bi bi-search search-icon"></i>
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Tìm kiếm tài khoản..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                  {isAdmin && (
                    <button className="btn btn-add-account" onClick={handleOpenAddModal}>
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
                      <th style={{ width: "25%" }}>Tên đăng nhập</th>
                      <th style={{ width: "20%" }}>Mật khẩu</th>
                      <th style={{ width: "25%" }}>Email</th>
                      <th style={{ width: "15%" }} className="text-center">Quyền</th>
                      {isAdmin && <th style={{ width: "15%" }} className="text-center">Thao tác</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account) => (
                      <tr key={account.id} onClick={() => handleOpenDetailModal(account)} style={{ cursor: 'pointer' }}>
                        <td className="fw-semibold">{account.tendangnhap}</td>
                        <td>••••••••</td>
                        <td>{account.email || <span className="text-muted fst-italic">Chưa có</span>}</td>
                        <td className="text-center">
                          <span className={`badge ${account.phanquyen === 'Admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {account.phanquyen}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="text-center" onClick={(e) => e.stopPropagation()}>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleOpenEditModal(account)}>
                              <i className="bi bi-pencil-square"></i> Sửa
                            </button>
                            {account.id !== currentUser && (
                              <button className="btn btn-sm btn-danger" onClick={() => handleOpenDeleteModal(account.id)}>
                                <i className="bi bi-trash"></i> Xóa
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
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {showAddModal ? (
                    <>
                      <i className="bi bi-person-plus me-2"></i> Thêm tài khoản mới
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-exclamation me-2"></i> Chỉnh sửa tài khoản
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
                        <i className="bi bi-person me-1"></i>
                        Tên đăng nhập <span className="text-danger">*</span>
                      </label>
                      <input type="text" className={`form-control ${formErrors.tendangnhap ? 'is-invalid' : ''}`}
                        value={formData.tendangnhap} onChange={(e) => handleInputChange('tendangnhap', e.target.value)}
                        placeholder="Nhập tên đăng nhập..." maxLength={200} />
                      {formErrors.tendangnhap && (
                        <div className="invalid-feedback d-block">
                          <i className="bi bi-exclamation-circle me-1"></i>{formErrors.tendangnhap}
                        </div>
                      )}
                      <small className="text-muted">{formData.tendangnhap.length}/200 ký tự</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-key me-1"></i>
                        Mật khẩu <span className="text-danger">*</span>
                      </label>
                      <input type="password" className={`form-control ${formErrors.matkhau ? 'is-invalid' : ''}`}
                        value={formData.matkhau} onChange={(e) => handleInputChange('matkhau', e.target.value)}
                        placeholder="Nhập mật khẩu..." maxLength={255} />
                      {formErrors.matkhau && (
                        <div className="invalid-feedback d-block">
                          <i className="bi bi-exclamation-circle me-1"></i>{formErrors.matkhau}
                        </div>
                      )}
                      <small className="text-muted">{formData.matkhau.length}/255 ký tự</small>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-envelope me-1"></i>
                      Email <span className="text-danger">*</span>
                    </label>
                    <input type="email" className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Nhập email..." maxLength={150} />
                    {formErrors.email && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>{formErrors.email}
                      </div>
                    )}
                    <small className="text-muted">{formData.email.length}/150 ký tự</small>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-shield me-1"></i>
                        Quyền
                      </label>
                      <select className="form-select" value={formData.phanquyen}
                        onChange={(e) => handleInputChange('phanquyen', e.target.value)}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-people me-1"></i>
                        Thành viên
                      </label>
                      <select className="form-select" value={formData.thanhvien_id}
                        onChange={(e) => handleInputChange('thanhvien_id', parseInt(e.target.value))}>
                        {thanhViens.map(tv => (
                          <option key={tv.id} value={tv.id}>{tv.hoten}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary"
                    onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
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
      {showDetailModal && currentAccount && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowDetailModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-info-circle me-2"></i>Chi tiết tài khoản
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="detail-box">
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-person me-2"></i>Tên đăng nhập:</div>
                    <div className="info-value">{currentAccount.tendangnhap}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-key me-2"></i>Mật khẩu:</div>
                    <div className="info-value">••••••••</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-envelope me-2"></i>Email:</div>
                    <div className="info-value">{currentAccount.email || <span className="text-muted">Chưa có</span>}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-shield me-2"></i>Quyền:</div>
                    <div className="info-value">
                      <span className={`badge ${currentAccount.phanquyen === 'Admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {currentAccount.phanquyen}
                      </span>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-people me-2"></i>Tên thành viên:</div>
                    <div className="info-value">{getThanhVienName(currentAccount.thanhvien_id)}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-clock me-2"></i>Thời điểm tạo:</div>
                    <div className="info-value">{formatDateTime(currentAccount.thoidiemtao)}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label"><i className="bi bi-box-arrow-in-right me-2"></i>Lần đăng nhập cuối:</div>
                    <div className="info-value">
                      {currentAccount.landangnhapcuoi ? formatDateTime(currentAccount.landangnhapcuoi) : <span className="text-muted">Chưa đăng nhập</span>}
                    </div>
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
                <p className="mb-0">Bạn có chắc chắn muốn xóa tài khoản này?</p>
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

export default AccountPage;