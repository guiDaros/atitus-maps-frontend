import React, { useState, useRef, useEffect } from "react";
import { Navbar, Logo, Title, Input, Button } from "../components";
import { signIn } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "", visible: false });
  const feedbackTimer = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  const showFeedback = (type, text, autoHide = true) => {
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }
    setFeedback({ type, text, visible: true });
    if (autoHide) {
      feedbackTimer.current = setTimeout(() => {
        setFeedback((prev) => ({ ...prev, visible: false }));
      }, 3800);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showFeedback("", "", false);

    try {
      const token = await signIn(email, senha);
      login(token);
      showFeedback("success", "Login realizado com sucesso!", false);
      setTimeout(() => navigate("/map"), 1200);
    } catch (err) {
      showFeedback("error", err.message);
    } finally {
      setLoading(false);
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="text-center pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Acessar"}
              </Button>
            </div>
          </form>

          <div className="status-container">
            {feedback.text && !loading && (
              <p className={`feedback-message ${feedback.type} ${feedback.visible ? 'show' : ''}`}>
                {feedback.text}
              </p>
            )}
            {loading && (
              <div className="loading-message">
                <span className="spinner" />
                <span>Entrando...</span>
              </div>
            )}
          </div>

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