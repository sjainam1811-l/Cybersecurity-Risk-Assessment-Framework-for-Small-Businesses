import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login({ onLogin }) {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.registeredEmail || "");
  const [password, setPassword] = useState(location.state?.registeredPassword || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/login",
        { email: email.trim(), password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = res.data.access_token;
      onLogin(token); // pass token to App.js
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid email or password";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base p-4 selection:bg-accent-soft selection:text-primary">
      <form onSubmit={handleLogin} className="card-dark p-8 w-full max-w-md shadow-card">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-primary">SME Risk Framework</h2>
          <p className="text-xs text-muted mt-1">Cybersecurity Risk Assessment</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-btn bg-sev-critical-bg border border-sev-critical/30 text-sev-critical text-xs">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="input-dark w-full p-2.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-dark w-full p-2.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-sm mt-2"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-secondary">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:underline font-medium">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
