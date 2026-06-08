import { useState, useEffect } from "react";

import TeacherSidebar from "../hooks/TeacherDashboard/TeacherSidebar";
import TeacherTopbar from "../hooks/TeacherDashboard/TeacherTopbar";
import TeacherStats from "../hooks/TeacherDashboard/TeacherStats";

import TodaySessions from "../hooks/TeacherDashboard/TodaySession";
import SessionsPage from "./SessionsPage";

import UpcomingRequests from "../hooks/TeacherDashboard/UpcomingRequests";
import Students from "../hooks/TeacherDashboard/Student";
import Reviews from "../hooks/TeacherDashboard/Reviews";
import Calendar from "../hooks/TeacherDashboard/Calendar";
import SkillsPage from "../hooks/TeacherDashboard/SkillsPage";
import ChatPanel from "../hooks/TeacherDashboard/Chatpanel";

import {
  SESSIONS,
  REQUESTS,
  STUDENTS,
  REVIEWS,
  SKILLS,
  CHAT_THREADS,
} from "../../../shared/constants/teacherMock";

import type {
  Page,
  Request,
  ChatThread,
} from "../../../domain/entities/teacher";

import "../styles/teacherDashboard.css";
import TeacherProfilePage from "./TeacherProfilePage";

export default function TeacherDashboardPage() {
  const [page, setPage] = useState<Page>("overview");
  const [requests, setRequests] = useState<Request[]>(REQUESTS);
  const [threads, setThreads] = useState<ChatThread[]>(CHAT_THREADS);
  const [chatStudentId, setChatStudentId] = useState<number | undefined>();

  const totalUnread = threads.reduce(
    (count, thread) => count + thread.unread,
    0
  );

  useEffect(() => {
    console.log("TeacherDashboard Mounted");
    console.log("Current page:", page);
  }, []);

  const acceptRequest = (id: number) =>
    setRequests((prev) => prev.filter((r) => r.id !== id));

  const declineRequest = (id: number) =>
    setRequests((prev) => prev.filter((r) => r.id !== id));

  const openChat = (studentId: number) => {
    setChatStudentId(studentId);
    setPage("chat");
  };

  const navigate = (p: Page) => setPage(p);

  const renderPage = () => {
    switch (page) {
      case "overview":
        return (
          <>
            <TeacherStats
              studentCount={STUDENTS.length}
              sessionCount={124}
              rating={4.9}
              skillCount={SKILLS.length}
            />

            <div className="td-grid">
              <TodaySessions
                sessions={SESSIONS}
                limit={4}
                onNavigate={navigate}
              />

              <UpcomingRequests
                requests={requests}
                limit={4}
                onAccept={acceptRequest}
                onDecline={declineRequest}
                onNavigate={navigate}
              />

              <Students
                students={STUDENTS}
                limit={4}
                onNavigate={navigate}
                onOpenChat={openChat}
              />

              <Reviews
                reviews={REVIEWS}
                limit={3}
                onNavigate={navigate}
              />

              <Calendar />
            </div>
          </>
        );

      case "sessions":
        return (
          <SessionsPage
            kycVerified={true}
            bankAdded={true}
          />
        );

      case "requests":
        return (
          <UpcomingRequests
            requests={requests}
            onAccept={acceptRequest}
            onDecline={declineRequest}
          />
        );

      case "students":
        return (
          <Students
            students={STUDENTS}
            onOpenChat={openChat}
          />
        );

      case "chat":
        return (
          <ChatPanel
            threads={threads}
            defaultStudentId={chatStudentId}
            onUpdateThreads={setThreads}
          />
        );

      case "reviews":
        return <Reviews reviews={REVIEWS} />;

      case "skills":
        return <SkillsPage />;

      case "calendar":
        return <Calendar />;

      case "profile":
        return (
          <div className="td-placeholder">
            <TeacherProfilePage />
          </div>
        );

      case "settings":
        return (
          <div className="td-placeholder">
            <span>⚙️</span>
            <p>Settings page — coming soon</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="td-root">
      <TeacherSidebar
        page={page}
        setPage={setPage}
        totalUnread={totalUnread}
      />

      <div className="td-main">
        <TeacherTopbar
          page={page}
          pendingCount={requests.length}
        />

        {renderPage()}
      </div>
    </div>
  );
}