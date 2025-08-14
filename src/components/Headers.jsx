function Header() {
  return (
    <header
      style={{
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto 32px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#666", fontWeight: "bold", fontSize: "18px" }}>
          STANDARD CREDIT
        </span>
        <button
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ACTIVATION PORTAL
        </button>
      </div>
    </header>
  );
}

export default Header;
