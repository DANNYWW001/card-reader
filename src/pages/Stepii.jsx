import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

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

  const onSubmit = (data) => {
    fetch("http://localhost:3001/validate-digits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastSixDigits: data.lastSixDigits }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(
              errorData.message ||
                `HTTP error! Status: ${response.status} - ${response.statusText}`
            );
          });
        }
        return response.json();
      })
      .then((result) => {
        if (result.message === "Digits validated successfully") {
          nextStep();
          navigate("/stepiii");
        } else {
          alert(result.message);
        }
      })
      .catch((error) => {
        console.error("Fetch error in Step II:", error);
        alert(
          `Server error. Details: ${error.message}. Check console for more info.`
        );
      });
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
            required: "Last 6 digits are required.",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "Please enter exactly 6 digits.",
            },
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
        {errors.lastSixDigits && (
          <p style={{ color: "red", fontSize: "12px" }}>
            {errors.lastSixDigits.message}
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
        disabled={!!errors.lastSixDigits}
      >
        Next Step <FaArrowRight style={{ marginLeft: "8px" }} />
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
