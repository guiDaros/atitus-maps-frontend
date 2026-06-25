import React, { useState, useRef, useEffect } from "react";
import { Navbar, Logo, Title, Input, Button } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import "./login.css";

export function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", text: "", visible: false });
    const feedbackTimer = useRef(null);
    const navigate = useNavigate();
    const { setUserName } = useAuth();

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

        if (senha !== confirmSenha) {
            setLoading(false);
            showFeedback("error", "As senhas não coincidem.");
            return;
        }

        try {
            const user = await signUp(name, email, senha);
            try { setUserName(user?.name || name); } catch (e) {}
            setName("");
            setEmail("");
            setSenha("");
            setConfirmSenha("");
            showFeedback("success", "Conta criada com sucesso!", false);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            showFeedback("error", err.message, false);
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
                        <Title title="Comece a cuidar do seu veículo" />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="pb-4">
                            <Input
                                // label="Nome"
                                placeholder="Digite seu nome..."
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="pb-4">
                            <Input
                                // label="Email"
                                placeholder="Digite seu email..."
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="pb-4">
                            <Input
                                // label="Senha"
                                placeholder="Digite sua senha..."
                                type="password"
                                required
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="pb-4">
                            <Input
                                // label="Confirmar senha"
                                placeholder="Confirme sua senha..."
                                type="password"
                                required
                                value={confirmSenha}
                                onChange={e => setConfirmSenha(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="text-center pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Criando conta..." : "Cadastrar"}
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
                                <span>Criando conta...</span>
                            </div>
                        )}
                    </div>

                    <div className="text-center pt-8 register-row">
                        <span className="register-text">Já tem cadastro?</span>
                        <Link to="/login" className="register-link">
                            Fazer Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}