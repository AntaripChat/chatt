import React, { useEffect, useState } from "react";
import { auth } from "./config/firebase";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatApp from "./components/Post";

const App = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true); // Toggle between Login and Signup

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-blue-500">MySocialApp</div>
            {user && (
              <button
                onClick={() => auth.signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {!user ? (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto mt-5">
            {/* Toggle Buttons */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setShowLogin(true)}
                className={`px-4 py-2 rounded-full ${
                  showLogin
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className={`px-4 py-2 rounded-full ${
                  !showLogin
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Render Login or Signup Component */}
            {showLogin ? (
              <Login onSwitch={() => setShowLogin(false)} />
            ) : (
              <Signup onSwitch={() => setShowLogin(true)} />
            )}
          </div>
        ) : (
          <ChatApp />
        )}
      </div>
    </div>
  );
};

export default App;