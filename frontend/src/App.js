import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import SMEResearch from "./pages/SMEResearch";
import NISTFramework from "./pages/NISTFramework";
import CaseStudies from "./pages/CaseStudies";
import BestPractices from "./pages/BestPractices";
import Navbar from "./components/Navbar";

function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken && storedToken !== "undefined" && storedToken !== "null"
      ? storedToken
      : null;
  });

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const isAuthenticated = token && token !== "undefined" && token !== "null";

  // Protected dark layout wrapper
  const ProtectedLayout = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/register" replace />;
    }
    return (
      <div className="min-h-screen bg-base text-primary flex flex-col font-sans selection:bg-accent-soft selection:text-primary">
        <Navbar onLogout={handleLogout} />
        <main className="flex-1 bg-base">{children}</main>
        <footer className="bg-surface border-t border-border py-6 text-center text-xs space-y-1.5">
          <p className="text-muted text-xs">
            Minor Project 1: Cybersecurity Risk Assessment Framework for Small Businesses
          </p>
          <p className="text-muted text-xs">
            Developed by{" "}
            <span className="font-semibold text-accent">Jainam Shah</span>
            {" and "}
            <span className="font-semibold text-accent">Mahi Patel</span>
          </p>
          <div>
            <span className="inline-block px-3 py-0.5 rounded-full border border-accent text-accent text-xs font-medium">
              Group C
            </span>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Routes>
        {/* Default route: registration first for unauthenticated users */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/register"} replace />}
        />

        {/* Public Auth Routes */}
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Authenticated Dashboard & Feature Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard onLogout={handleLogout} />
            </ProtectedLayout>
          }
        />
        <Route
          path="/sme-research"
          element={
            <ProtectedLayout>
              <SMEResearch />
            </ProtectedLayout>
          }
        />
        <Route
          path="/nist-framework"
          element={
            <ProtectedLayout>
              <NISTFramework />
            </ProtectedLayout>
          }
        />
        <Route
          path="/case-studies"
          element={
            <ProtectedLayout>
              <CaseStudies />
            </ProtectedLayout>
          }
        />
        <Route
          path="/best-practices"
          element={
            <ProtectedLayout>
              <BestPractices />
            </ProtectedLayout>
          }
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/register"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
