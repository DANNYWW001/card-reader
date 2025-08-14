function ProgressBar({ progress }) {
  return (
    <div
      style={{
        width: "100%",
        height: "4px",
        backgroundColor: "#ddd",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          height: "100%",
          backgroundColor: "#3b82f6",
          width: `${progress}%`,
          transition: "width 0.3s",
        }}
      ></div>
    </div>
  );
}

export default ProgressBar;
