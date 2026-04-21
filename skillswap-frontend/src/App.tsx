import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "./presentation/components/pages/LoginPage";
import Signup from "./presentation/components/pages/SignUpPage";
import ForgotPasswordPage from "./presentation/components/pages/ForgotPasswordPage";
import ResetPasswordPage from "./presentation/components/pages/ResetPasswordPage";
import VerifyOtpPage from "./presentation/components/pages/OTPVerifyPage";
import HomePage from "./presentation/components/pages/HomePage";
import OAuthSuccessPage from "./presentation/components/pages/oAuthSuccessPage";

const App: React.FC = () => {

  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>

        {/* Default Route */}
  <Route
          path="/"
          element={
            token
              ? <HomePage />
              : <Navigate to="/login" />
          }
        />

        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={<h1>404 | Page Not Found</h1>}
        />
<Route
  path="/oauth-success"
  element={<OAuthSuccessPage />}
/>
      </Routes>
    </Router>
  );
};

export default App;