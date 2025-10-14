import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getThanhVienById } from "../../services/ThanhVienService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './style.css';

const UserInfoSidebar = () => {
  const navigate = useNavigate();
  const [thanhVien, setThanhVien] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(data);

    const fetchThanhVien = async () => {
      try {
        if (parsedUser.thanhvien_id) {
          const tvRes = await getThanhVienById(parsedUser.thanhvien_id);
          setThanhVien(tvRes.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin thành viên:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchThanhVien();
  }, [navigate]);

  if (loading) {
    return (
      <div className="user-info text-center p-3 shadow-sm rounded-4 bg-white">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="user-info text-center p-3 shadow-sm rounded-4 bg-white">
      <div className="mb-3">
        <img
          src={
            thanhVien?.anh_url
              ? thanhVien.anh_url
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="avatar"
          className="avatar"
        />
      </div>
      <p className="fw-semibold mb-1">
        Xin chào, {thanhVien ? thanhVien.hoten : "Người dùng"}
      </p>
      <small className="text-muted">
        {new Date().toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </small>
    </div>
  );
};

export default UserInfoSidebar;