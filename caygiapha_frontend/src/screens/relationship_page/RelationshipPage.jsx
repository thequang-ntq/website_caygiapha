import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getQuanHeVoChongAll, createQuanHeVoChong, updateQuanHeVoChong, deleteQuanHeVoChong } from "../../services/QuanHeVoChongService";
import { getQuanHeChaMeConAll, createQuanHeChaMeCon, updateQuanHeChaMeCon, deleteQuanHeChaMeCon } from "../../services/QuanHeChaMeConService";
import { getThanhVienAll, getThanhVienById } from "../../services/ThanhVienService";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserInfoSidebar from "../../components/user_info_sidebar/UserInfoSidebar";
import MainFunctionsSidebar from "../../components/main_functions_sidebar/MainFunctionsSidebar";

const RelationshipPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [member, setMember] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [filteredRelationships, setFilteredRelationships] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentRelationship, setCurrentRelationship] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [relationshipType, setRelationshipType] = useState("chamecon");

  const [formData, setFormData] = useState({
    // Cha mẹ - con
    cha_id: "",
    me_id: "",
    con_id: "",
    loaiquanhe: "Ruột thịt",
    ghichu_cmc: "",
    // Vợ chồng
    thanhvien1_id: "",
    thanhvien2_id: "",
    ngaybatdau: "",
    ngayketthuc: "",
    tinhtrang: "Khác",
    ghichu_vc: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(data);
    setIsAdmin(parsedUser.phanquyen === "Admin");
    fetchData();
  }, [navigate, id]);

  const fetchData = async () => {
    try {
      const [vcRes, cmcRes, tvAllRes, tvRes] = await Promise.all([
        getQuanHeVoChongAll(),
        getQuanHeChaMeConAll(),
        getThanhVienAll(),
        getThanhVienById(id),
      ]);

      setAllMembers(tvAllRes.data);
      setMember(tvRes.data);

      // Lọc quan hệ cha mẹ - con
      const cmcFiltered = cmcRes.data.filter(
        (cmc) => cmc.cha_id === (id) || cmc.me_id === (id) || cmc.con_id === (id)
      );

      // Lọc quan hệ vợ chồng
      const vcFiltered = vcRes.data.filter(
        (vc) => vc.thanhvien1_id === (id) || vc.thanhvien2_id === (id)
      );

      // Gộp và format dữ liệu
      const allRelationships = [
        ...cmcFiltered.map((cmc) => ({ ...cmc, type: "chamecon" })),
        ...vcFiltered.map((vc) => ({ ...vc, type: "vochong" })),
      ];

      setRelationships(allRelationships);
      setFilteredRelationships(allRelationships);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu quan hệ!");
    } finally {
      setLoading(false);
    }
  };

  const getMemberName = (memberId) => {
    if (!memberId) return "Không có";
    const member = allMembers.find((m) => m.id === memberId);
    return member ? member.hoten : "Không rõ";
  };

  const getRelationshipDisplay = (rel) => {
    const currentId = (id);
    
    if (rel.type === "chamecon") {
      if (rel.cha_id === currentId) {
        return `Con - ${rel.loaiquanhe}`;
      } else if (rel.me_id === currentId) {
        return `Con - ${rel.loaiquanhe}`;
      } else if (rel.con_id === currentId) {
        const parts = [];
        if (rel.cha_id) parts.push("Cha");
        if (rel.me_id) parts.push("Mẹ");
        return `${parts.join(", ")} - ${rel.loaiquanhe}`;
      }
    } else if (rel.type === "vochong") {
      if (rel.thanhvien1_id === currentId) {
        return rel.thanhvien2_id ? "Vợ/Chồng" : "Chưa có";
      } else if (rel.thanhvien2_id === currentId) {
        return rel.thanhvien1_id ? "Vợ/Chồng" : "Chưa có";
      }
    }
    return "Khác";
  };

  const getRelatedMemberName = (rel) => {
    const currentId = (id);
    
    if (rel.type === "chamecon") {
      if (rel.cha_id === currentId || rel.me_id === currentId) {
        return getMemberName(rel.con_id);
      } else if (rel.con_id === currentId) {
        const names = [];
        if (rel.cha_id) names.push(getMemberName(rel.cha_id));
        if (rel.me_id) names.push(getMemberName(rel.me_id));
        return names.join(", ");
      }
    } else if (rel.type === "vochong") {
      if (rel.thanhvien1_id === currentId) {
        return getMemberName(rel.thanhvien2_id);
      } else if (rel.thanhvien2_id === currentId) {
        return getMemberName(rel.thanhvien1_id);
      }
    }
    return "Không rõ";
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredRelationships(relationships);
    } else {
      const filtered = relationships.filter((rel, index) => {
        const stt = (index + 1).toString();
        const name = getRelatedMemberName(rel).toLowerCase();
        const relation = getRelationshipDisplay(rel).toLowerCase();
        
        return stt.includes(query) || name.includes(query) || relation.includes(query);
      });
      setFilteredRelationships(filtered);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (relationshipType === "chamecon") {
      if (!formData.con_id) {
        errors.con_id = "Tên con không được để trống";
      }
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
    setRelationshipType("chamecon");
    setFormData({
      cha_id: "",
      me_id: "",
      con_id: "",
      loaiquanhe: "Ruột thịt",
      ghichu_cmc: "",
      thanhvien1_id: "",
      thanhvien2_id: "",
      ngaybatdau: "",
      ngayketthuc: "",
      tinhtrang: "Khác",
      ghichu_vc: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (rel) => {
    setFormErrors({});
    setCurrentRelationship(rel);
    setRelationshipType(rel.type);
    
    if (rel.type === "chamecon") {
      setFormData({
        cha_id: rel.cha_id || "",
        me_id: rel.me_id || "",
        con_id: rel.con_id || "",
        loaiquanhe: rel.loaiquanhe || "Ruột thịt",
        ghichu_cmc: rel.ghichu || "",
        thanhvien1_id: "",
        thanhvien2_id: "",
        ngaybatdau: "",
        ngayketthuc: "",
        tinhtrang: "Khác",
        ghichu_vc: "",
      });
    } else {
      setFormData({
        cha_id: "",
        me_id: "",
        con_id: "",
        loaiquanhe: "Ruột thịt",
        ghichu_cmc: "",
        thanhvien1_id: rel.thanhvien1_id || "",
        thanhvien2_id: rel.thanhvien2_id || "",
        ngaybatdau: rel.ngaybatdau ? formatDateForInput(rel.ngaybatdau) : "",
        ngayketthuc: rel.ngayketthuc ? formatDateForInput(rel.ngayketthuc) : "",
        tinhtrang: rel.tinhtrang || "Khác",
        ghichu_vc: rel.ghichu || "",
      });
    }
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (rel) => {
    setDeleteItem(rel);
    setShowDeleteModal(true);
  };

  const handleOpenDetailModal = (rel) => {
    setCurrentRelationship(rel);
    setShowDetailModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (relationshipType === "chamecon") {
        const dataToSubmit = {
          cha_id: formData.cha_id || null,
          me_id: formData.me_id || null,
          con_id: formData.con_id,
          loaiquanhe: formData.loaiquanhe,
          ghichu: formData.ghichu_cmc || null,
        };
        await createQuanHeChaMeCon(dataToSubmit);
      } else {
        const dataToSubmit = {
          thanhvien1_id: formData.thanhvien1_id || null,
          thanhvien2_id: formData.thanhvien2_id || null,
          ngaybatdau: formData.ngaybatdau || null,
          ngayketthuc: formData.ngayketthuc || null,
          tinhtrang: formData.tinhtrang,
          ghichu: formData.ghichu_vc || null,
        };
        await createQuanHeVoChong(dataToSubmit);
      }
      
      await fetchData();
      setShowAddModal(false);
      setSuccessMessage("Thêm quan hệ thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi thêm quan hệ:", err);
      setError("Không thể thêm quan hệ!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (currentRelationship.type === "chamecon") {
        const dataToSubmit = {
          cha_id: formData.cha_id || null,
          me_id: formData.me_id || null,
          con_id: formData.con_id,
          loaiquanhe: formData.loaiquanhe,
          ghichu: formData.ghichu_cmc || null,
        };
        await updateQuanHeChaMeCon(currentRelationship.id, dataToSubmit);
      } else {
        const dataToSubmit = {
          thanhvien1_id: formData.thanhvien1_id || null,
          thanhvien2_id: formData.thanhvien2_id || null,
          ngaybatdau: formData.ngaybatdau || null,
          ngayketthuc: formData.ngayketthuc || null,
          tinhtrang: formData.tinhtrang,
          ghichu: formData.ghichu_vc || null,
        };
        await updateQuanHeVoChong(currentRelationship.id, dataToSubmit);
      }
      
      await fetchData();
      setShowEditModal(false);
      setSuccessMessage("Sửa quan hệ thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi sửa quan hệ:", err);
      setError("Không thể sửa quan hệ!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const confirmDelete = async () => {
    try {
      if (deleteItem.type === "chamecon") {
        await deleteQuanHeChaMeCon(deleteItem.id);
      } else {
        await deleteQuanHeVoChong(deleteItem.id);
      }
      
      await fetchData();
      setShowDeleteModal(false);
      setSuccessMessage("Xóa quan hệ thành công!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setError("Không thể xóa quan hệ!");
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
    <div className="relationship-container vh-100 vw-100">
      <Navbar activePage="relationship" />

      <div className="container-fluid mt-4 px-4">
        <div className="row">
          <div className="col-md-3 mb-4">
            <UserInfoSidebar />
            <MainFunctionsSidebar activePage="relationship" />
          </div>

          <div className="col-md-9">
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
                <p className="text-muted mb-0">Các mối quan hệ của {member?.hoten || "thành viên này"}</p>
              </div>
            </div>

            <div className="relationship-info-card p-4 shadow-sm rounded-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-diagram-3 me-2"></i>
                  Danh sách quan hệ
                </h5>
                <div className="d-flex align-items-center gap-3">
                  <div className="search-container">
                    <i className="bi bi-search search-icon"></i>
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Tìm kiếm quan hệ..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                  {isAdmin && (
                    <button className="btn btn-add-relationship" onClick={handleOpenAddModal}>
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
                      <th style={{ width: "40%" }}>Họ tên</th>
                      <th style={{ width: "35%" }}>Quan hệ</th>
                      {isAdmin && <th style={{ width: "15%" }} className="text-center">Thao tác</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRelationships.map((rel, index) => (
                      <tr key={`${rel.type}-${rel.id}`} onClick={() => handleOpenDetailModal(rel)} style={{ cursor: 'pointer' }}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{getRelatedMemberName(rel)}</td>
                        <td>{getRelationshipDisplay(rel)}</td>
                        {isAdmin && (
                          <td className="text-center" onClick={(e) => e.stopPropagation()}>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleOpenEditModal(rel)}>
                              <i className="bi bi-pencil-square"></i> Sửa
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleOpenDeleteModal(rel)}>
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
                      <i className="bi bi-diagram-3 me-2"></i> Thêm quan hệ mới
                    </>
                  ) : (
                    <>
                      <i className="bi bi-diagram-3-fill me-2"></i> Chỉnh sửa quan hệ
                    </>
                  )}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}></button>
              </div>
              <form onSubmit={showAddModal ? handleSubmitAdd : handleSubmitEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-list-ul me-1"></i>
                      Kiểu quan hệ <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={relationshipType}
                      onChange={(e) => setRelationshipType(e.target.value)}
                      disabled={showEditModal}
                    >
                      <option value="chamecon">Cha mẹ - con</option>
                      <option value="vochong">Vợ chồng</option>
                    </select>
                  </div>

                  {relationshipType === "chamecon" ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-person me-1"></i>
                          Tên cha
                        </label>
                        <select
                          className="form-select"
                          value={formData.cha_id}
                          onChange={(e) => handleInputChange('cha_id', e.target.value)}
                        >
                          <option value="">Không có</option>
                          {allMembers.map((m) => (
                            <option key={m.id} value={m.id}>{m.hoten}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-person me-1"></i>
                          Tên mẹ
                        </label>
                        <select
                          className="form-select"
                          value={formData.me_id}
                          onChange={(e) => handleInputChange('me_id', e.target.value)}
                        >
                          <option value="">Không có</option>
                          {allMembers.map((m) => (
                            <option key={m.id} value={m.id}>{m.hoten}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-person me-1"></i>
                          Tên con <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${formErrors.con_id ? 'is-invalid' : ''}`}
                          value={formData.con_id}
                          onChange={(e) => handleInputChange('con_id', e.target.value)}
                        >
                          <option value="">Chọn con...</option>
                          {allMembers.map((m) => (
                            <option key={m.id} value={m.id}>{m.hoten}</option>
                          ))}
                        </select>
                        {formErrors.con_id && (
                          <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>{formErrors.con_id}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-heart me-1"></i>
                          Loại quan hệ
                        </label>
                        <select
                          className="form-select"
                          value={formData.loaiquanhe}
                          onChange={(e) => handleInputChange('loaiquanhe', e.target.value)}
                        >
                          <option value="Ruột thịt">Ruột thịt</option>
                          <option value="Nhận nuôi">Nhận nuôi</option>
                          <option value="Riêng">Riêng</option>
                          <option value="Giám hộ">Giám hộ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-text-paragraph me-1"></i>
                          Ghi chú
                        </label>
                        <textarea
                          className="form-control"
                          value={formData.ghichu_cmc}
                          onChange={(e) => handleInputChange('ghichu_cmc', e.target.value)}
                          placeholder="Nhập ghi chú..."
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-person me-1"></i>
                          Tên chồng
                        </label>
                        <select
                          className="form-select"
                          value={formData.thanhvien1_id}
                          onChange={(e) => handleInputChange('thanhvien1_id', e.target.value)}
                        >
                          <option value="">Không có</option>
                          {allMembers.map((m) => (
                            <option key={m.id} value={m.id}>{m.hoten}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-person me-1"></i>
                          Tên vợ
                        </label>
                        <select
                          className="form-select"
                          value={formData.thanhvien2_id}
                          onChange={(e) => handleInputChange('thanhvien2_id', e.target.value)}
                        >
                          <option value="">Không có</option>
                          {allMembers.map((m) => (
                            <option key={m.id} value={m.id}>{m.hoten}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-calendar-date me-1"></i>
                          Ngày bắt đầu
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.ngaybatdau}
                          onChange={(e) => handleInputChange('ngaybatdau', e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-calendar-date me-1"></i>
                          Ngày kết thúc
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.ngayketthuc}
                          onChange={(e) => handleInputChange('ngayketthuc', e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-info-circle me-1"></i>
                          Tình trạng
                        </label>
                        <select
                          className="form-select"
                          value={formData.tinhtrang}
                          onChange={(e) => handleInputChange('tinhtrang', e.target.value)}
                        >
                          <option value="Vợ chồng">Vợ chồng</option>
                          <option value="Chưa có">Chưa có</option>
                          <option value="Ly hôn">Ly hôn</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-text-paragraph me-1"></i>
                          Ghi chú
                        </label>
                        <textarea
                          className="form-control"
                          value={formData.ghichu_vc}
                          onChange={(e) => handleInputChange('ghichu_vc', e.target.value)}
                          placeholder="Nhập ghi chú..."
                          rows={3}
                        />
                      </div>
                    </>
                  )}
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
      {showDetailModal && currentRelationship && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowDetailModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-info-circle me-2"></i>Chi tiết quan hệ
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="detail-box">
                  {currentRelationship.type === "chamecon" ? (
                    <>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-person me-2"></i>Tên cha:</div>
                        <div className="info-value">{getMemberName(currentRelationship.cha_id)}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-person me-2"></i>Tên mẹ:</div>
                        <div className="info-value">{getMemberName(currentRelationship.me_id)}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-person me-2"></i>Tên con:</div>
                        <div className="info-value">{getMemberName(currentRelationship.con_id)}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-heart me-2"></i>Loại quan hệ:</div>
                        <div className="info-value">{currentRelationship.loaiquanhe}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-text-paragraph me-2"></i>Ghi chú:</div>
                        <div className="info-value">{currentRelationship.ghichu || <span className="text-muted">Chưa có</span>}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-clock-history me-2"></i>Thời điểm tạo:</div>
                        <div className="info-value">{formatDateTime(currentRelationship.thoidiemtao)}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-person me-2"></i>Tên chồng:</div>
                        <div className="info-value">{getMemberName(currentRelationship.thanhvien1_id)}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-person me-2"></i>Tên vợ:</div>
                        <div className="info-value">{getMemberName(currentRelationship.thanhvien2_id)}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-calendar-date me-2"></i>Ngày bắt đầu:</div>
                        <div className="info-value">{currentRelationship.ngaybatdau ? formatDate(currentRelationship.ngaybatdau) : <span className="text-muted">Chưa có</span>}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-calendar-date me-2"></i>Ngày kết thúc:</div>
                        <div className="info-value">{currentRelationship.ngayketthuc ? formatDate(currentRelationship.ngayketthuc) : <span className="text-muted">Chưa có</span>}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-info-circle me-2"></i>Tình trạng:</div>
                        <div className="info-value">{currentRelationship.tinhtrang}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-text-paragraph me-2"></i>Ghi chú:</div>
                        <div className="info-value">{currentRelationship.ghichu || <span className="text-muted">Chưa có</span>}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label"><i className="bi bi-clock-history me-2"></i>Thời điểm tạo:</div>
                        <div className="info-value">{formatDateTime(currentRelationship.thoidiemtao)}</div>
                      </div>
                    </>
                  )}
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
                <p className="mb-0">Bạn có chắc chắn muốn xóa quan hệ này?</p>
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

export default RelationshipPage;