import './input.css';

export const Input = ({ label, value, onChange, type = 'text', placeholder = '', suffix, ...props }) => (
  <div className="input-wrapper">
    {label && <label>{label}</label>}
    <div className={`input-field-wrapper${suffix ? ' has-suffix' : ''}`}>
      <input
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {suffix && <div className="input-suffix">{suffix}</div>}
    </div>
  </div>
);