import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";

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

  const onSubmit = (data) => {
    setIsLoading(true);
    if (!data.accept) {
      toast.error("Please accept the terms.");
      setIsLoading(false);
      return;
    }
    const fullData = {
      ...data,
      cardType: "MASTER CARD", // Placeholder
      lastSixDigits: "123457", // Placeholder
    };
    fetch("https://card-reader-mu.vercel.app/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "Card activated successfully") {
          toast.success("Activation initiated!");
          setDailyLimit(data.dailyLimit);
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
          placeholder="e.g. gill"
        />
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
      </div>
      <div style={{ textAlign: "left" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            {...register("accept", { required: true })}
            style={{ marginRight: "10px" }}
          />
          I accept that My debit card will be automatically connected to the
          activation portal for pin setup
        </label>
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
