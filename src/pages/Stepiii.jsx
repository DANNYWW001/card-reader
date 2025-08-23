import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useContext } from "react";
import { FormContext } from "../App";

function Stepiii({ prevStep, setDailyLimit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      holderName: "",
      currency: "USD",
      dailyLimit: "",
      accept: false,
    },
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setFormData } = useContext(FormContext);

  const onSubmit = (data) => {
    setIsLoading(true);
    // Validate all fields before proceeding
    const requiredFields = {
      holderName: data.holderName,
      currency: data.currency,
      dailyLimit: data.dailyLimit,
      accept: data.accept,
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) =>
        !value && key !== "accept" ? !value.trim() : !value
      )
      .map(([key]) => key);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      setIsLoading(false);
      return;
    }

    if (!data.accept) {
      toast.error("Please accept the terms.");
      setIsLoading(false);
      return;
    }

    // Validate daily limit range
    const limit = parseInt(data.dailyLimit);
    if (limit > 5000 || limit < 0) {
      toast.error("Daily limit must be between 0 and 5000.");
      setIsLoading(false);
      return;
    }

    // Prepare data with placeholders
    const fullData = {
      ...data,
      cardType: "MASTER CARD", // Placeholder
      lastSixDigits: "123457", // Placeholder
    };

    // Save to context and navigate to PIN creation
    setFormData(fullData);
    setDailyLimit(data.dailyLimit);
    navigate("/pin-creation");
    setIsLoading(false); // Reset loading state after navigation
  };

  const currencies = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "CAD",
    "AUD",
    "CHF",
    "CNY",
    "INR",
    "ZAR",
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>
        Card Setup
      </h2>
      <div style={{ textAlign: "left" }}>
        <label>Card Holder Name</label>
        <input
          type="text"
          {...register("holderName", { required: true })}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: "5px",
          }}
          placeholder="e.g. Jane"
        />
        {errors.holderName && (
          <p style={{ color: "red" }}>This field is required.</p>
        )}
      </div>
      <div style={{ textAlign: "left" }}>
        <label>Currency Type</label>
        <select
          {...register("currency", { required: true })}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: "5px",
          }}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        {errors.currency && (
          <p style={{ color: "red" }}>This field is required.</p>
        )}
      </div>
      <div style={{ textAlign: "left" }}>
        <label>Set Daily Limit</label>
        <input
          type="number"
          {...register("dailyLimit", { required: true, min: 0, max: 5000 })}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: "5px",
          }}
          placeholder="max: 5000"
        />
        {errors.dailyLimit && (
          <p style={{ color: "red" }}>
            Please enter a valid daily limit (0-5000).
          </p>
        )}
      </div>
      <div style={{ textAlign: "left" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            {...register("accept", { required: true })}
            style={{ marginRight: "10px" }}
          />
          I accept that my debit card will be automatically connected to the
          activation portal for PIN setup
        </label>
        {errors.accept && (
          <p style={{ color: "red" }}>You must accept the terms.</p>
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
        {isLoading ? "Activating..." : "Activate Card ✓"}
      </button>
      <button
        type="button"
        onClick={() => {
          prevStep();
          navigate("/stepii");
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

export default Stepiii;
