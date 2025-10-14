import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './style.css';

const MainFunctionsSidebar = ({ activePage = "home" }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      const parsedUser = JSON.parse(data);
      setIsAdmin(parsedUser.phanquyen === "Admin");
    }
  }, []);

  const handleChatButtonClick = () => {
    setShowChatModal(true);
  };

  const handleChatMethodSelect = (method) => {
    setShowChatModal(false);
    
    if (method === 'messenger') {
      window.open('https://www.messenger.com', '_blank');
    } else if (method === 'zalo') {
      window.open('https://chat.zalo.me', '_blank');
    } else if (method === 'internal') {
      navigate('/chat');
    }
  };

  return (
    <>
      <div className="main-functions mt-4 p-3 shadow-sm rounded-4 bg-white">
        <h6 className="fw-bold text-center mb-3">Các chức năng chính</h6>
        <div className="d-grid gap-2">
          <button
            className={`btn btn-outline-primary fw-semibold main-btn-func ${
              activePage === "event" ? "active" : ""
            }`}
            onClick={() => navigate("/event")}
          >
            📅 Sự kiện
          </button>
          <button
            className={`btn btn-outline-primary fw-semibold main-btn-func ${
              activePage === "chat" ? "active" : ""
            }`}
            onClick={handleChatButtonClick}
          >
            💬 Tin nhắn
          </button>

          {isAdmin && (
            <>
              <button
                className={`btn btn-outline-primary fw-semibold main-btn-func ${
                  activePage === "account" ? "active" : ""
                }`}
                onClick={() => navigate("/account")}
              >
                👤 Tài khoản
              </button>
              <button
                className={`btn btn-outline-primary fw-semibold main-btn-func ${
                  activePage === "member" ? "active" : ""
                }`}
                onClick={() => navigate("/member")}
              >
                🧬 Chỉnh sửa cây
              </button>
            </>
          )}
        </div>
      </div>

      {/* Chat Method Selection Modal */}
      {showChatModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowChatModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content chat-method-modal">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-chat-dots me-2"></i>
                  Xin hãy chọn phương thức nhắn tin
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowChatModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-grid gap-3">
                  <button 
                    className="btn btn-chat-method btn-messenger"
                    onClick={() => handleChatMethodSelect('messenger')}
                  >
                    <i className="bi bi-messenger me-2"></i>
                    Messenger
                  </button>
                  <button 
                    className="btn btn-chat-method btn-zalo"
                    onClick={() => handleChatMethodSelect('zalo')}
                  >
                    <i className="bi bi-chat-square-dots me-2"></i>
                    Zalo
                  </button>
                  <button 
                    className="btn btn-chat-method btn-internal"
                    onClick={() => handleChatMethodSelect('internal')}
                  >
                    <i className="bi bi-house-door me-2"></i>
                    Nội bộ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainFunctionsSidebar;