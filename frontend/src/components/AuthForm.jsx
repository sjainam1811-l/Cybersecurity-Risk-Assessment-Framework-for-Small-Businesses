import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AuthForm({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = type === "register" ? "register" : "login";
      const res = await api.post(`/api/v1/${endpoint}`, { email, password });
      if (res.data?.access_token) {
        localStorage.setItem("token", res.data.access_token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      alert("Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-dark max-w-sm mx-auto mt-10 p-6 shadow-card">
      <h2 className="text-xl font-semibold text-primary mb-4 text-center">
        {type === "register" ? "Create Account" : "Sign In"}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Email</label>
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-dark w-full p-2.5"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-dark w-full p-2.5"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-sm">
          {loading ? "Processing..." : type === "register" ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </form>
  );
}
