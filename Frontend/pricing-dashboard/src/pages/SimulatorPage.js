import React from "react";
import Simulator from "../components/Simulator";
import { useTraining } from "../context/TrainingContext";

function SimulatorPage() {
  const { trainingData } = useTraining();

  return (
    <div className="page-container">
      <h1>🍕 Food Delivery Pricing Simulator</h1>
      <p className="subtitle">Interact with the trained RL agent to see dynamic pricing in action</p>
      <Simulator trainingData={trainingData} />
    </div>
  );
}

export default SimulatorPage;
