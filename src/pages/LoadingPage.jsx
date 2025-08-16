import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/pending");
    }, 3000); // Simulate 3-second loading
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        "@media (max-width: 480px)": { padding: "10px" },
      }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
        Activating Card, please wait...
      </h2>
      <div
        style={{
          backgroundColor: "#ddd",
          height: "10px",
          borderRadius: "5px",
          margin: "20px 0",
        }}
      >
        <div
          style={{
            backgroundColor: "#3b82f6",
            width: "12%",
            height: "100%",
            borderRadius: "5px",
            textAlign: "center",
            color: "white",
            fontSize: "12px",
            lineHeight: "10px",
          }}
        >
          12%
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;
