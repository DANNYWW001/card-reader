import { useState } from "react";
import { toast } from "react-toastify";

function AdminPage() {
  const [vat, setVat] = useState("1435");
  const [cardActivation, setCardActivation] = useState("2500");
  const [cardMaintenance, setCardMaintenance] = useState("1250");
  const [secureConnection, setSecureConnection] = useState("2950");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        "@media (max-width: 480px)": { padding: "10px" },
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          color: "#333",
        }}
      >
        Complete PIN Creation and Activation
      </h2>
      <p style={{ fontSize: "14px", textAlign: "center", color: "#666" }}>
        To complete the creation and activation of your pin, you need to make
        the following one time payments
      </p>
      <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ textAlign: "left" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#333" }}
          >
            • VAT (value added tax ):
            <input
              type="text"
              value={vat}
              onChange={(e) => setVat(e.target.value)}
              style={{
                width: "fit-content",
                padding: "4px 8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginLeft: "5px",
                fontSize: "14px",
                textAlign: "right",
              }}
            />
          </label>
        </div>
        <div style={{ textAlign: "left" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#333" }}
          >
            • Card activation:
            <input
              type="text"
              value={cardActivation}
              onChange={(e) => setCardActivation(e.target.value)}
              style={{
                width: "fit-content",
                padding: "4px 8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginLeft: "5px",
                fontSize: "14px",
                textAlign: "right",
              }}
            />
          </label>
        </div>
        <div style={{ textAlign: "left" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#333" }}
          >
            • Card maintenance:
            <input
              type="text"
              value={cardMaintenance}
              onChange={(e) => setCardMaintenance(e.target.value)}
              style={{
                width: "fit-content",
                padding: "4px 8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginLeft: "5px",
                fontSize: "14px",
                textAlign: "right",
              }}
            />
          </label>
        </div>
        <div style={{ textAlign: "left" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#333" }}
          >
            • 3D visa/master/verve secure connection (enables local and
            international online purchasing):
            <input
              type="text"
              value={secureConnection}
              onChange={(e) => setSecureConnection(e.target.value)}
              style={{
                width: "fit-content",
                padding: "4px 8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginLeft: "5px",
                fontSize: "14px",
                textAlign: "right",
              }}
            />
          </label>
        </div>
      </form>
      <button
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          marginTop: "10px",
        }}
        onClick={() => {
          toast.info("Redirecting to payment gateway...");
        }}
      >
        Make payment
      </button>
    </div>
  );
}

export default AdminPage;
