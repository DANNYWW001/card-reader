import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaLock, FaCheck, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useContext, useEffect } from "react"; // Added useEffect for timer
import { FormContext } from "../App";

function PinCreationPage({ prevStep }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: { pin: "", confirmPin: "" },
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("create"); // 'create' or 'confirm'
  const [showSuccess, setShowSuccess] = useState(false); // New: For success screen
  const { formData } = useContext(FormContext);

  // Auto-redirect after 30s on success
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/loading");
        console.log("Auto-navigated to /loading after 30s");
      }, 30000); // 30 seconds
      return () => clearTimeout(timer); // Cleanup
    }
  }, [showSuccess, navigate]);

  const onSubmit = (data) => {
    setIsLoading(true);
    console.log("Form Data at PIN creation:", formData); // Debug form data

    if (step === "create") {
      if (data.pin.length !== 4 || !/^\d+$/.test(data.pin)) {
        toast.error("PIN must be exactly 4 digits.");
        setIsLoading(false);
        return;
      }
      setStep("confirm");
      reset({ pin: data.pin, confirmPin: "" }); // Reset confirmPin
    } else {
      if (data.confirmPin !== watch("pin")) {
        toast.error("PINs do not match.");
        setIsLoading(false);
        return;
      }

      // Prepare full data with PIN
      const fullData = {
        ...formData,
        pin: data.confirmPin,
      };

      console.log("Sending Data to /activate:", fullData); // Debug sent data
      console.log(
        "Fetch URL:",
        "https://card-reader-backend-ls73.onrender.com/activate"
      ); // Debug URL
      fetch("https://card-reader-backend-ls73.onrender.com/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
      })
        .then((response) => {
          console.log("Fetch Response Status:", response.status); // Debug status
          console.log(
            "Fetch Response Headers:",
            Object.fromEntries(response.headers)
          ); // Debug headers
          console.log("Fetch Response Text:", response.statusText); // Debug status text
          if (!response.ok) {
            throw new Error(
              `HTTP error! Status: ${response.status} - ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((result) => {
          console.log("Backend Response:", result); // Debug response
          if (result && result.message === "Card activated successfully") {
            toast.success("PIN created successfully!");
            setShowSuccess(true); // Show success screen instead of immediate navigate
            setIsLoading(false); // Reset loading here
          } else {
            throw new Error(
              result?.message || "Unexpected response from server"
            );
          }
        })
        .catch((error) => {
          console.error("Fetch or Backend Error:", error.message);
          toast.error(
            error.message.includes("404")
              ? "Backend endpoint not found. Please check server status."
              : error.message || "Server error. Please try again later."
          );
          setIsLoading(false); // Ensure reset on error
        });
    }
  };

  // Success Screen Render
  if (showSuccess) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh", // Full viewport for centering
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#f0f8ff", // Light blue background for success
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "#d4edda", // Light green circle
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <FaCheck
            style={{
              fontSize: "60px", // Large green check
              color: "#28a745", // Green color
            }}
          />
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>
          PIN Created Successfully!
        </h2>
        <p style={{ fontSize: "16px", color: "#666", marginTop: "10px" }}>
          You can now make withdrawals or perform transactions with this card.
          Redirecting in 30 seconds...
        </p>
        {/* Optional: Manual redirect button */}
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

  // Original Form Render (unchanged except for minor tweaks)
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
      {step === "create" ? (
        <p style={{ fontSize: "14px", textAlign: "center" }}>
          Consist of 4 digits
        </p>
      ) : (
        <p style={{ fontSize: "14px", textAlign: "center" }}>
          Confirm your 4-digit PIN
        </p>
      )}
      <p style={{ fontSize: "12px", textAlign: "center" }}>
        Note: Without a PIN, you can't make withdrawals or perform transactions
        with this card.
      </p>
      {step === "create" ? (
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <label htmlFor="pin">PIN</label>
          <input
            id="pin"
            type="password"
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
            <p style={{ color: "red", fontSize: "12px" }}>
              PIN must be exactly 4 digits.
            </p>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <label htmlFor="confirmPin">Confirm PIN</label>
          <input
            id="confirmPin"
            type="password"
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
            <p style={{ color: "red", fontSize: "12px" }}>
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
            reset();
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
        <FaArrowLeft style={{ marginRight: "8px" }} />{" "}
        {step === "confirm" ? "Back to Create" : "Back to Previous"}
      </button>
    </form>
  );
}

export default PinCreationPage;
