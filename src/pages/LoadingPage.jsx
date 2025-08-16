import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoadingPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/pending"), 100); // Slight delay for smooth transition
          return 100;
        }
        return prev + 1;
      });
    }, 30000 / 100); // 30,000 ms (3 sec) / 100 steps = 300 ms per 1%

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#e6f0fa", // Alice Blue background
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "@media (max-width: 480px)": { padding: "10px" },
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#3b82f6", // Blue text
          marginBottom: "20px",
          animation: "pulse 1.5s infinite",
        }}
      >
        Activating Your Card...
      </h2>
      <div
        style={{
          width: "80%",
          maxWidth: "400px",
          backgroundColor: "#d1e8ff", // Lighter Alice Blue for track
          height: "20px",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)", // Subtle blue shadow
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #3b82f6, #60a5fa)", // Blue gradient
            borderRadius: "10px",
            transition: "width 0.3s linear",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "10px",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              textShadow: "0 0 5px rgba(255, 255, 255, 0.7)",
            }}
          >
            {progress}%
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: "20px",
          color: "#3b82f6",
          fontSize: "14px",
          animation: "fadeIn 2s infinite alternate",
        }}
      >
        Processing your request securely...
      </div>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes fadeIn {
            0% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default LoadingPage;
