import React, { useState } from "react";
import AuthForm from "../components/AuthForm";

export default function Home() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4">
      <AuthForm type={isRegister ? "register" : "login"} />
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-4 text-accent text-xs hover:underline cursor-pointer"
      >
        {isRegister ? "Already have an account? Sign In" : "New user? Create account"}
      </button>
    </div>
  );
}
