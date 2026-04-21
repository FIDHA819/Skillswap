import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {

  return (

    <div className="min-h-screen flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold">
        Welcome to SkillSwap 🚀
      </h1>

      <div className="flex gap-4 mt-6">

        <Link
          to="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="px-6 py-2 bg-green-600 text-white rounded"
        >
          Signup
        </Link>

      </div>

    </div>

  );

};

export default HomePage;