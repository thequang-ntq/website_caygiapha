import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./screens/login_page/LoginPage";
import HomePage from "./screens/home_page/HomePage";
import FamilyPage from "./screens/family_page/FamilyPage";
import ProfilePage from "./screens/profile_page/ProfilePage";
import EventPage from "./screens/event_page/EventPage";
import AccountPage from "./screens/account_page/AccountPage";
import MemberPage from "./screens/member_page/MemberPage";
import ChatPage from "./screens/chat_page/ChatPage";
import DetailPage from "./screens/detail_page/DetailPage";
import RelationshipPage from "./screens/relationship_page/RelationshipPage";
import AchievementPage from "./screens/achievement_page/AchievementPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/family" element={<FamilyPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/event" element={<EventPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/member" element={<MemberPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/detail/:id" element={<DetailPage />} />
      <Route path="/relationship/:id" element={<RelationshipPage />} />
      <Route path="/achievement/:id" element={<AchievementPage />} />
    </Routes>
  );
}

export default App;
