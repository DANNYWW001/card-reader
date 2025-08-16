import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Headers";
import Footer from "./components/Footer";
import ProgressBar from "./components/ProgressBar";
import Stepi from "./pages/Stepi";
import Stepii from "./pages/Stepii";
import Stepiii from "./pages/Stepiii";
import LoadingPage from "./pages/LoadingPage";
import PendingPage from "./pages/PendingPage";

function App() {
  const [progress, setProgress] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0); // State to pass dailyLimit

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#e6f0fa",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "@media (maxWidth: 480px)": { padding: "10px" },
      }}
    >
      <Header />
      <main
        style={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ProgressBar progress={progress} />
          <Routes>
            <Route path="/" element={<Navigate to="/stepi" />} />
            <Route
              path="/stepi"
              element={<Stepi nextStep={() => setProgress(33)} />}
            />
            <Route
              path="/stepii"
              element={
                <Stepii
                  nextStep={() => setProgress(66)}
                  prevStep={() => setProgress(33)}
                />
              }
            />
            <Route
              path="/stepiii"
              element={
                <Stepiii
                  prevStep={() => setProgress(66)}
                  setDailyLimit={setDailyLimit}
                />
              }
            />
            <Route path="/loading" element={<LoadingPage />} />
            <Route
              path="/pending"
              element={<PendingPage amount={dailyLimit * 3} />}
            />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
