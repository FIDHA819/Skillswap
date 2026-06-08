import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./presentation/components/pages/LoginPage";
import Signup from "./presentation/components/pages/SignUpPage";
import ForgotPasswordPage from "./presentation/components/pages/ForgotPasswordPage";
import ResetPasswordPage from "./presentation/components/pages/ResetPasswordPage";
import VerifyOtpPage from "./presentation/components/pages/OTPVerifyPage";
import HomePage from "./presentation/components/pages/LandingPage";
import OAuthSuccessPage from "./presentation/components/pages/oAuthSuccessPage";
import LearnerDashboardPage from "./presentation/components/pages/LearnerDashboardPage";
import ProfileSetupPage from "./presentation/components/pages/ProfileSetUpPage";
import ViewProfile from "./presentation/components/pages/ProfilePage"
import VerifyEmailPage from "./presentation/components/pages/verifyEmailpage";
import TeacherDashboardPage from "./presentation/components/pages/TeacherDashboardPage";

import EditProfile from "./presentation/components/pages/editProfilePage"
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes/ProtectRoute";

const App: React.FC = () => {

  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {

    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >
        Loading...
      </div>
    );

  }

  return (

    <Router>

      <Routes>

        {/* Home */}

        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" />
              : <HomePage />
          }
        />

        {/* Public */}

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" />
              : <LoginPage />
          }
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtpPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/oauth-success"
          element={<OAuthSuccessPage />}
        />

        {/* Protected */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LearnerDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/create"
          element={
            <ProtectedRoute>
              <ProfileSetupPage />
            </ProtectedRoute>
          }
        />

        <Route
path="/profile"
element={<ViewProfile/>}
/>

<Route
path="/profile/edit"
element={<EditProfile/>}
/>

        {/* 404 */}

        <Route
          path="*"
          element={
            <h1>
              404 | Page Not Found
            </h1>
          }
        />
        <Route

path="/verify-email"

element={
<VerifyEmailPage/>
}

/>

<Route

path="/teacher/dashboard"

element={

<TeacherDashboardPage/>

}

/>

      </Routes>

    </Router>

  );

};

export default App;