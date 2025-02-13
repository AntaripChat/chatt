import React, { useState } from "react";
import { database, auth } from "../config/firebase";
import { ref, set, get } from "firebase/database";
import { signOut } from "firebase/auth";

const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  const handleSignup = async () => {
    const userRef = ref(database, `users/${btoa(email)}`);
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      alert("User already exists! Please log in.");
      return;
    }
    await set(userRef, { name, email, phone, password });
    alert("Signup successful! Please log in.");
    setIsLogin(true);
  };

  const handleLogin = async () => {
    const userRef = ref(database, `users/${btoa(email)}`);
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      if (userData.password === password) {
        setUser(userData);
        alert("Login successful!");
      } else {
        alert("Incorrect password!");
      }
    } else {
      alert("User not found! Please sign up.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    alert("Logged out successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {!user ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          {!isLogin && (
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={isLogin ? handleLogin : handleSignup}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <p className="text-center text-sm mt-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"} 
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500">
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
