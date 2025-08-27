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
          setTimeout(() => {
            console.log("Auto-navigated to /pending"); // from first code
            navigate("/pending");
          }, 100); // small delay for smooth transition
          return 100;
        }
        return prev + 1;
      });
    }, 5000 / 100); // 5 seconds total → 100 steps = 50ms per step

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
          backgroundColor: "#d1e8ff",
          height: "20px",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
            borderRadius: "10px",
            transition: "width 0.05s linear", // smoother animation
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
