import React, { useState } from "react";
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
    const [feedback, setFeedback] = useState({ type: "", text: "" });
    const navigate = useNavigate();
    const { setUserName } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ type: "", text: "" });

        if (senha !== confirmSenha) {
            setFeedback({ type: "error", text: "As senhas não coincidem." });
            return;
        }

        try {
            const user = await signUp(name, email, senha);
            // salva nome no contexto / localStorage
            try { setUserName(user?.name || name); } catch (e) {}
            // mostrar mensagem de sucesso e redirecionar após 2 segundos
            setFeedback({ type: "success", text: "Conta criada com sucesso! Redirecionando..." });
            // limpar formulário
            setName("");
            setEmail("");
            setSenha("");
            setConfirmSenha("");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setFeedback({ type: "error", text: err.message });
        }
    };

    return (
        <div className="login-page">
            <div className="max-w-md mx-auto p-4">
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
                        />
                    </div>

                    {feedback.text && (
                        <p className={`feedback-message ${feedback.type}`}>
                            {feedback.text}
                        </p>
                    )}

                    <div className="text-center pt-4">
                        <Button type="submit">Cadastrar</Button>
                    </div>
                </form>

                <div className="text-center pt-8 register-row">
                    <span className="register-text">Já tem cadastro?</span>
                    <Link to="/login" className="register-link">
                        Fazer Login
                    </Link>
                </div>
            </div>
        </div>
    );
}