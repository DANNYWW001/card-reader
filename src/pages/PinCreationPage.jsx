import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useContext, useEffect } from "react";
import { FormContext } from "../App";

function PinCreationPage({ prevStep }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { pin: "", confirmPin: "" },
    // keep values when inputs unmount (safer across step changes)
    shouldUnregister: false,
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("create"); // 'create' | 'confirm'
  const [showSuccess, setShowSuccess] = useState(false);
  const [firstPin, setFirstPin] = useState(""); // store initial PIN explicitly
  const { formData } = useContext(FormContext);

  // Auto-redirect after 7s on success
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => {
      navigate("/loading");
      console.log("✅ Auto-navigated to /loading after 7s");
    }, 7000);
    return () => clearTimeout(timer);
  }, [showSuccess, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      if (step === "create") {
        // Validate first entry
        if (!/^\d{4}$/.test(data.pin)) {
          toast.error("PIN must be exactly 4 digits.");
          return;
        }
        setFirstPin(data.pin); // keep the first PIN safely in state
        setStep("confirm");
        reset({ pin: "", confirmPin: "" }); // clear inputs for the confirm step
        return;
      }

      // step === "confirm"
      if (!/^\d{4}$/.test(data.confirmPin)) {
        toast.error("Confirm PIN must be exactly 4 digits.");
        return;
      }
      if (data.confirmPin !== firstPin) {
        toast.error("PINs do not match.");
        return;
      }

      // Prepare full payload for backend
      const fullData = {
        ...formData,
        pin: data.confirmPin,
      };

      console.log("🚀 Sending Data to /activate:", fullData);

      const response = await fetch(
        "https://card-reader-backend-ls73.onrender.com/activate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullData),
        }
      );

      console.log("📡 Fetch Response Status:", response.status);
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} - ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Backend Response:", result);

      // Accept either the explicit message or (future-proof) accept === true
      if (
        result?.message === "Card activated successfully" ||
        result?.accept === true
      ) {
        toast.success("PIN created successfully!");
        setShowSuccess(true);
      } else {
        throw new Error(result?.message || "Unexpected server response.");
      }
    } catch (error) {
      console.error("❌ Fetch or Backend Error:", error);
      const msg =
        typeof error?.message === "string" && error.message
          ? error.message
          : "Server error. Please try again later.";
      toast.error(
        msg.includes("404")
          ? "Backend endpoint not found. Please check server status."
          : msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Success Screen
  if (showSuccess) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#f0f8ff",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "#d4edda",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <FaCheck style={{ fontSize: "60px", color: "#28a745" }} />
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>
          PIN Created Successfully!
        </h2>
        <p style={{ fontSize: "16px", color: "#666", marginTop: "10px" }}>
          You can now make withdrawals or perform transactions with this card.
          Redirecting in <strong>7 seconds…</strong>
        </p>
        <button
          onClick={() => navigate("/loading")}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Go to Loading Now
        </button>
      </div>
    );
  }

  // Main Form
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>
        Create your special PIN
      </h2>

      <p style={{ fontSize: "14px", textAlign: "center" }}>
        {step === "create" ? "Consist of 4 digits" : "Confirm your 4-digit PIN"}
      </p>
      <p style={{ fontSize: "12px", textAlign: "center" }}>
        Note: Without a PIN, you can't make withdrawals or perform transactions
        with this card.
      </p>

      {step === "create" ? (
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <label htmlFor="pin-input">PIN</label>
          <input
            id="pin-input" // ✅ id matches htmlFor
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-invalid={!!errors.pin || undefined}
            {...register("pin", { required: true, pattern: /^\d{4}$/ })}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "5px",
            }}
            maxLength={4}
          />
          {errors.pin && (
            <p id="pin-error" style={{ color: "red", fontSize: "12px" }}>
              PIN must be exactly 4 digits.
            </p>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <label htmlFor="confirm-pin-input">Confirm PIN</label>
          <input
            id="confirm-pin-input" // ✅ id matches htmlFor
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-invalid={!!errors.confirmPin || undefined}
            {...register("confirmPin", { required: true, pattern: /^\d{4}$/ })}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "5px",
            }}
            maxLength={4}
          />
          {errors.confirmPin && (
            <p
              id="confirm-pin-error"
              style={{ color: "red", fontSize: "12px" }}
            >
              Confirm PIN must be exactly 4 digits.
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
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
        }}
        disabled={isLoading}
      >
        {isLoading
          ? "Creating PIN..."
          : step === "create"
          ? "Next"
          : "Create PIN"}
      </button>

      <button
        type="button"
        onClick={() => {
          if (step === "confirm") {
            setStep("create");
            reset({ pin: "", confirmPin: "" });
            setFirstPin("");
          } else {
            prevStep();
            navigate("/stepiii");
          }
        }}
        style={{
          backgroundColor: "transparent",
          color: "#666",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaArrowLeft style={{ marginRight: "8px" }} />
        {step === "confirm" ? "Back to Create" : "Back to Previous"}
      </button>
    </form>
  );
}

export default PinCreationPage;
