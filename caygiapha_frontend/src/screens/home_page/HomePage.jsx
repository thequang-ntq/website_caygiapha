import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getCayGiaPha } from "../../services/CayGiaPhaService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserInfoSidebar from "../../components/user_info_sidebar/UserInfoSidebar";
import MainFunctionsSidebar from "../../components/main_functions_sidebar/MainFunctionsSidebar";

const HomePage = () => {
  const navigate = useNavigate();
  const [cayGiaPha, setCayGiaPha] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // --- Lấy dữ liệu cây gia phả ---
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const cayRes = await getCayGiaPha();
        // Backend trả về array hoặc object, chuẩn hóa thành array
        const cayData = Array.isArray(cayRes.data) ? cayRes.data : [cayRes.data];
        setCayGiaPha(cayData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu cây gia phả!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // --- Hiển thị cây (đệ quy) ---
  const renderNode = (node) => {
    if (!node) return null;

    return (
      <li key={node.id} className="tree-node">
        <div className="tree-person">
          {/* Nếu là chồng */}
          {node.gioitinh === "Nam" ? (
            <>
              <span 
                className="person" 
                onClick={() => navigate(`/detail/${node.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {node.hoten}
              </span>
              {node.vochong && (
                <span 
                  className="person spouse"
                  onClick={() => navigate(`/detail/${node.vochong.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  💍 {node.vochong.hoten}
                </span>
              )}
            </>
          ) : (
            <>
              {node.vochong && (
                <span 
                  className="person"
                  onClick={() => navigate(`/detail/${node.vochong.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {node.vochong.hoten}
                </span>
              )}
              <span 
                className="person spouse"
                onClick={() => navigate(`/detail/${node.id}`)}
                style={{ cursor: 'pointer' }}
              >
                💍 {node.hoten}
              </span>
            </>
          )}
        </div>

        {/* Con */}
        {node.con && node.con.length > 0 && (
          <ul className="tree-children">
            {node.con.map((child) => renderNode(child))}
          </ul>
        )}
      </li>
    );
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
    <div className="homepage-container vh-100 vw-100">
      {/* Navbar */}
      <Navbar activePage="home" />

      {/* Nội dung chính */}
      <div className="container-fluid mt-4 px-4">
        <div className="row">
          {/* Cột trái */}
          <div className="col-md-3 mb-4">
            <UserInfoSidebar />
            <MainFunctionsSidebar activePage="home" />
          </div>

          {/* Cột phải */}
          <div className="col-md-9">
            <div className="family-tree p-4 shadow-sm rounded-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-primary mb-0">🌳 Sơ đồ gia phả</h5>
              </div>

              {/* Cây gia phả */}
              <div className="tree-container text-center">
                {error && <p className="text-danger">{error}</p>}

                {!cayGiaPha || cayGiaPha.length === 0 ? (
                  <p>Không có dữ liệu cây gia phả.</p>
                ) : (
                  <div className="tree-wrapper">
                    {cayGiaPha.map((tree, index) => (
                      <ul key={index} className="tree-root">
                        {renderNode(tree)}
                      </ul>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;