import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaLock, FaCheck, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useContext } from "react";
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
  const { formData } = useContext(FormContext);

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
            setTimeout(() => {
              navigate("/loading"); // Ensure navigation
              console.log("Navigated to /loading");
            }, 100); // Delay to show toast
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
        })
        .finally(() => setIsLoading(false)); // Ensure loading resets
    }
  };

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
