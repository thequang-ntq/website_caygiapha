import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { getTinNhanAll, createTinNhan, updateTinNhan } from "../../services/TinNhanService";
import { getTaiKhoanAll } from "../../services/TaiKhoanService";
import { getThanhVienAll } from "../../services/ThanhVienService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import UserInfoSidebar from "../../components/user_info_sidebar/UserInfoSidebar";
import MainFunctionsSidebar from "../../components/main_functions_sidebar/MainFunctionsSidebar";

const ChatPage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(data);
    setCurrentUser(parsedUser.id);

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [tkRes, tvRes, tnRes] = await Promise.all([
        getTaiKhoanAll(),
        getThanhVienAll(),
        getTinNhanAll(),
      ]);

      setAccounts(tkRes.data);
      setMembers(tvRes.data);
      setMessages(tnRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu tin nhắn!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAccount && currentUser) {
      const conversationMessages = messages.filter(msg =>
        (msg.taikhoangui_id === currentUser && msg.taikhoannhan_id === selectedAccount) ||
        (msg.taikhoangui_id === selectedAccount && msg.taikhoannhan_id === currentUser)
      );
      setFilteredMessages(conversationMessages);
      scrollToBottom();
    }
  }, [selectedAccount, messages, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getMemberName = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return "Không rõ";
    const member = members.find(m => m.id === account.thanhvien_id);
    return member ? member.hoten : "Không rõ";
  };

  const getAccountStatus = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account && account.danghoatdong !== "0" ? "Đang hoạt động" : "Ngoại tuyến";
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!selectedAccount || !currentUser) return;

    if (query.trim() === "") {
      const conversationMessages = messages.filter(msg =>
        (msg.taikhoangui_id === currentUser && msg.taikhoannhan_id === selectedAccount) ||
        (msg.taikhoangui_id === selectedAccount && msg.taikhoannhan_id === currentUser)
      );
      setFilteredMessages(conversationMessages);
    } else {
      const filtered = filteredMessages.filter(msg =>
        msg.noidung && msg.noidung.toLowerCase().includes(query)
      );
      setFilteredMessages(filtered);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedAccount) return;

    try {
      const newMessage = {
        taikhoangui_id: currentUser,
        taikhoannhan_id: selectedAccount,
        trongtam: null,
        noidung: messageInput,
        kenh: "Nội bộ",
        trangthai: "Đang gửi",
      };

      const response = await createTinNhan(newMessage);
      const messageId = response.data.id;

      // Simulate sending delay
      setTimeout(async () => {
        try {
          await updateTinNhan(messageId, { trangthai: "Đã gửi" });
          await fetchData();
        } catch (err) {
          await updateTinNhan(messageId, { trangthai: "Thất bại" });
          await fetchData();
        }
      }, 1000);

      setMessageInput("");
      await fetchData();
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
      setError("Không thể gửi tin nhắn!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    const hours = String(vietnamTime.getUTCHours()).padStart(2, '0');
    const minutes = String(vietnamTime.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Đang gửi":
        return <i className="bi bi-clock status-icon status-sending"></i>;
      case "Đã gửi":
        return <i className="bi bi-check2-all status-icon status-sent"></i>;
      case "Thất bại":
        return <i className="bi bi-exclamation-circle status-icon status-failed"></i>;
      default:
        return null;
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
    <div className="chat-container vh-100 vw-100">
      <Navbar activePage="chat" />

      <div className="container-fluid mt-4 px-4">
        <div className="row">
          <div className="col-md-3 mb-4">
            <UserInfoSidebar />
            <MainFunctionsSidebar activePage="chat" />
          </div>

          <div className="col-md-9">
            <div className="chat-main-card shadow-sm rounded-4 bg-white">
              <div className="row g-0 h-100">
                {/* Column 1: Account List */}
                <div className="col-md-3 chat-sidebar border-end">
                  <div className="chat-sidebar-header p-3 border-bottom">
                    <h6 className="fw-bold mb-0">
                      <i className="bi bi-people me-2"></i>
                      Chọn 1 tài khoản để nhắn
                    </h6>
                  </div>
                  <div className="chat-account-list">
                    {accounts
                      .filter(acc => acc.id !== currentUser)
                      .map((account) => (
                        <div
                          key={account.id}
                          className={`chat-account-item ${selectedAccount === account.id ? 'active' : ''}`}
                          onClick={() => setSelectedAccount(account.id)}
                        >
                          <div className="account-avatar">
                            <i className="bi bi-person-circle"></i>
                          </div>
                          <div className="account-info">
                            <div className="account-name">{getMemberName(account.id)}</div>
                            <div className="account-username">@{account.tendangnhap}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Column 2: Chat Messages */}
                <div className="col-md-6 chat-main">
                  {!selectedAccount ? (
                    <div className="chat-empty-state">
                      <i className="bi bi-chat-left-dots-fill"></i>
                      <p>Chọn một tài khoản để bắt đầu trò chuyện</p>
                    </div>
                  ) : (
                    <>
                      <div className="chat-header p-3 border-bottom">
                        <div className="d-flex align-items-center">
                          <div className="chat-header-avatar me-3">
                            <i className="bi bi-person-circle"></i>
                          </div>
                          <div>
                            <div className="chat-header-name">{getMemberName(selectedAccount)}</div>
                            <div className={`chat-header-status ${getAccountStatus(selectedAccount) === 'Ngoại tuyến' ? 'status-offline' : ''}`}>
                              {getAccountStatus(selectedAccount)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="chat-messages-container">
                        {filteredMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`chat-message ${msg.taikhoangui_id === currentUser ? 'sent' : 'received'}`}
                          >
                            <div className="message-bubble">
                              <div className="message-content">{msg.noidung}</div>
                              <div className="message-meta">
                                <span className="message-time">{formatDateTime(msg.thoidiemgui)}</span>
                                {msg.taikhoangui_id === currentUser && getStatusIcon(msg.trangthai)}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      <div className="chat-input-container p-3 border-top">
                        {error && (
                          <div className="alert alert-danger alert-sm mb-2" role="alert">
                            {error}
                          </div>
                        )}
                        <form onSubmit={handleSendMessage} className="d-flex gap-2">
                          <input
                            type="text"
                            className="form-control chat-input"
                            placeholder="Nhập tin nhắn..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                          />
                          <button type="submit" className="btn btn-send-message">
                            <i className="bi bi-send-fill"></i>
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>

                {/* Column 3: Search */}
                <div className="col-md-3 chat-search-panel border-start">
                  {!selectedAccount ? (
                    <div className="search-empty-state">
                      <i className="bi bi-search"></i>
                      <p>Chọn cuộc trò chuyện để tìm kiếm</p>
                    </div>
                  ) : (
                    <>
                      <div className="search-header p-3 border-bottom">
                        <h6 className="fw-bold mb-0">
                          <i className="bi bi-search me-2"></i>
                          Tìm kiếm tin nhắn
                        </h6>
                      </div>
                      <div className="search-input-wrapper p-3">
                        <div className="position-relative">
                          <i className="bi bi-search search-icon-input"></i>
                          <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Tìm trong cuộc trò chuyện..."
                            value={searchQuery}
                            onChange={handleSearch}
                          />
                        </div>
                      </div>
                      {searchQuery && (
                        <div className="search-results p-3">
                          <p className="text-muted small mb-2">
                            Tìm thấy {filteredMessages.length} kết quả
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;