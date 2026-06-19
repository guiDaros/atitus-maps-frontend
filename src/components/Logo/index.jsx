import "./logo.css";
import logoImage from "../../assets/Logo/Logo_lavaja.png";

export const Logo = () => {
  return (
    <div className="logo">
      <img src={logoImage} alt="Logo" className="logo-img" />
    </div>
  );
};