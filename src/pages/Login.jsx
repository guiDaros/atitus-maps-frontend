import React, { useState } from "react";
import { Navbar, Logo, Title, Input, Button } from "../components";
import { signIn } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });
    try {
      const token = await signIn(email, senha);
      login(token);
      navigate("/map");
    } catch (err) {
      setFeedback({ type: "error", text: err.message });
    }
  };

  return (
    <div className="login-page">
      <div className="glass-card">
        <div className="card-content">
          <div className="text-center">
            <Logo />
          </div>

          <div className="pt-6 pb-4">
            <Title title="Já possui uma conta?" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="pb-4">
              <Input
                // label="Email"
                placeholder="E-mail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pb-4">
              <Input
                // label="Senha"
                placeholder="Senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            {feedback.text && (
              <p className={`feedback-message ${feedback.type}`}>
                {feedback.text}
              </p>
            )}

            <div className="text-center pt-4">
              <Button type="submit">Acessar</Button>
            </div>
          </form>

          <div className="text-center pt-8 register-row">
            <span className="register-text">Ainda não tem uma conta?</span>
            <Link to="/register" className="register-link">
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}