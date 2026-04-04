import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import SimulatorPage from "./pages/SimulatorPage";
import Layout from "./layout/Layout";
import { TrainingProvider } from "./context/TrainingContext";

function App() {
  return (
    <TrainingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/simulator" element={<Layout><SimulatorPage /></Layout>} />
        </Routes>
      </Router>
    </TrainingProvider>
  );
}

export default App;