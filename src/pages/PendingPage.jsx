import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function PendingPage({ amount }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/admin");
    }, 3000); // Auto-redirect after 3 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigate]);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        "@media (max-width: 480px)": { padding: "10px" },
      }}
    >
      <div
        style={{
          border: "2px solid green",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "30px", color: "green" }}>✓</span>
      </div>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#333",
          marginTop: "10px",
        }}
      >
        ACTIVATION PENDING
      </h2>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Your pin will be activated successfully once the card activation is
        approved
      </p>
      <p style={{ fontSize: "14px", color: "#666" }}>
        To complete this process, you need to make a one time payment which is
        required and necessary to cover up all cost and expenses for a fast and
        swift activation.
      </p>
      <button
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          fontSize: "18px",
          marginTop: "20px",
        }}
      >
        ${amount.toFixed(3)}
      </button>
    </div>
  );
}

export default PendingPage;
