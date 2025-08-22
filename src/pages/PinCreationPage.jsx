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
  const { formData, setFormData } = useContext(FormContext);

  const onSubmit = (data) => {
    setIsLoading(true);
    console.log("Form Data at stepiii:", formData); // Debug log for stepiii context

    if (step === "create") {
      if (data.pin.length !== 4 || !/^\d+$/.test(data.pin)) {
        toast.error("PIN must be exactly 4 digits.");
        setIsLoading(false);
        return;
      }
      setStep("confirm");
      reset({ pin: data.pin, confirmPin: "" });
    } else {
      if (data.confirmPin !== watch("pin")) {
        toast.error("PINs do not match.");
        setIsLoading(false);
        return;
      }

      // Validate all required fields from previous steps
      const requiredFields = {
        cardType: formData.cardType || "",
        lastSixDigits: formData.lastSixDigits || "",
        holderName: formData.holderName || "",
        currency: formData.currency || "",
        dailyLimit: formData.dailyLimit || "",
        accept: formData.accept || false,
      };
      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) =>
          !value && key !== "accept" ? !value.toString().trim() : !value
        )
        .map(([key]) => key);

      if (missingFields.length > 0) {
        toast.error(
          `Missing required fields from previous steps: ${missingFields.join(
            ", "
          )}`
        );
        setIsLoading(false);
        return;
      }

      const fullData = {
        ...formData,
        pin: data.confirmPin,
      };

      fetch("https://card-reader-backend-ls73.onrender.com/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Backend Response at stepiii:", result); // Debug response
          if (result.message === "Card activated successfully") {
            toast.success("PIN created successfully!");
            navigate("/loading");
          } else {
            toast.error(
              result.message || "An error occurred during activation."
            );
          }
        })
        .catch((error) => {
          console.error("Fetch Error at stepiii:", error);
          toast.error("Server error. Please try again later.");
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backgroundColor: "#000",
        color: "#fff",
        padding: "20px",
        borderRadius: "8px",
        "@media (max-width: 480px)": { padding: "10px" },
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
        Create your special pin
      </h2>
      {step === "create" ? (
        <p style={{ fontSize: "14px", textAlign: "center" }}>
          consist of 4 digits
        </p>
      ) : (
        <p style={{ fontSize: "14px", textAlign: "center" }}>
          Confirm your 4-digit PIN
        </p>
      )}
      <p style={{ fontSize: "12px", textAlign: "center" }}>
        Note: without a pin you can't make any withdrawals or perform any
        transactions with this card.
      </p>
      {step === "create" ? (
        <div style={{ textAlign: "left" }}>
          <label style={{ display: "flex", alignItems: "center" }}>
            PIN <FaLock style={{ marginLeft: "10px" }} />
          </label>
          <input
            type="password"
            {...register("pin", { required: true, pattern: /^\d{4}$/ })}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "5px",
              backgroundColor: "#333",
              color: "#fff",
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
        <div style={{ textAlign: "left" }}>
          <label style={{ display: "flex", alignItems: "center" }}>
            Confirm PIN <FaCheck style={{ marginLeft: "10px" }} />
          </label>
          <input
            type="password"
            {...register("confirmPin", { required: true, pattern: /^\d{4}$/ })}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "5px",
              backgroundColor: "#333",
              color: "#fff",
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
