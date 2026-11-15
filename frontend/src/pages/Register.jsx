import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/v1/register", {
        email: email.trim(),
        password,
      });
      toast.success("Account created successfully! Please sign in.");
      navigate("/login", {
        state: { registeredEmail: email.trim(), registeredPassword: password },
      });
    } catch (err) {
      const msg = err.response?.data?.detail || "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base p-4 selection:bg-accent-soft selection:text-primary">
      <form onSubmit={handleSubmit} className="card-dark p-8 w-full max-w-md shadow-card">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-primary">Create Account</h2>
          <p className="text-xs text-muted mt-1">Get started with SME risk assessment</p>
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

          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-dark w-full p-2.5"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-2.5 text-sm mt-2"
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
