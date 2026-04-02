import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import LoginPage from "./presentation/components/pages/LoginPage";
import Signup from "./presentation/components/pages/SignUpPage";
import ForgotPasswordPage from "./presentation/components/pages/ForgotPasswordPage";
import ResetPasswordPage from "./presentation/components/pages/ResetPasswordPage";

import VerifyOtpPage from "./presentation/components/pages/OTPVerifyPage";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={< LoginPage/>} />
       
<Route path="/verify-otp" element={<VerifyOtpPage />} />
<Route
  path="/forgot-password"
  element={<ForgotPasswordPage />}
/>

<Route
  path="/reset-password"
  element={<ResetPasswordPage />}
/>
     

        {/* Fallback */}
        <Route path="*" element={<h1>404 | Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
