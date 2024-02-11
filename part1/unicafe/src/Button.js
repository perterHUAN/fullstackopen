function Button({ onClick, label, children }) {
  return (
    <button onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
}

export default Button;
