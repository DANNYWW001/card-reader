import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function Stepi({ nextStep }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: { cardType: "" },
  });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    if (!data.cardType) {
      alert("Please select a card type.");
      return;
    }
    nextStep();
    navigate("/stepii");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>
        SCF ACTIVATION PORTAL
      </h2>
      <div style={{ textAlign: "left" }}>
        <p>Select the card type</p>
        <label
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <input
            type="radio"
            value="MASTER CARD"
            {...register("cardType", { required: true })}
            style={{ marginRight: "10px" }}
          />
          MASTER CARD
        </label>
        <label
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <input
            type="radio"
            value="VISA CARD"
            {...register("cardType", { required: true })}
            style={{ marginRight: "10px" }}
          />
          VISA CARD
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="radio"
            value="VERVE CARD"
            {...register("cardType", { required: true })}
            style={{ marginRight: "10px" }}
          />
          VERVE CARD
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
      >
        Next Step <FaArrowRight style={{ marginLeft: "8px" }} />
      </button>
    </form>
  );
}

export default Stepi;
