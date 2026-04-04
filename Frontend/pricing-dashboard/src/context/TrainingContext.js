import React, { createContext, useState, useContext } from "react";

const TrainingContext = createContext();

export const TrainingProvider = ({ children }) => {
  const [trainingData, setTrainingData] = useState(null);

  return (
    <TrainingContext.Provider value={{ trainingData, setTrainingData }}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = () => useContext(TrainingContext);