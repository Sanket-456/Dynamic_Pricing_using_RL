import React, { useState, useRef } from 'react';
import './Simulator.css';
import { fetchSimulation } from "../api";
import { useNavigate } from "react-router-dom";

const Simulator = ({ trainingData }) => {
  const [selectedState, setSelectedState] = useState(2); // Default to High demand
  const [selectedPrice, setSelectedPrice] = useState(10); // Default to ₹10
  const [manualResult, setManualResult] = useState(null); // Manual pricing result
  const [aiResult, setAiResult] = useState(null); // AI pricing result
  const [loading, setLoading] = useState(false); // Loading state
  const sliderRef = useRef(null); // Ref for the slider
  const navigate = useNavigate();

  // Helper function to get AI recommended price
  const getAIPrice = () => {
    if (!trainingData) return null;

    const prices = [10, 20, 30, 40, 50];
    const qValues = trainingData.Q[selectedState];

    const maxIndex = qValues.indexOf(Math.max(...qValues));

    return prices[maxIndex];
  };

  // Simulate button handler
  const handleSimulate = async () => {
    setLoading(true);
    const aiPrice = getAIPrice();

    try {
      const requests = [
        fetchSimulation(selectedState, selectedPrice),
      ];

      if (aiPrice !== null) {
        requests.push(fetchSimulation(selectedState, aiPrice));
      }

      const [manualResponse, aiResponse] = await Promise.all(requests);

      setManualResult(manualResponse);
      if (aiPrice !== null) {
        setAiResult(aiResponse);
      }
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!trainingData) {
    return (
      <div className="alert">
        ⚠️ Train the model first on the Dashboard to enable AI recommendations
        <button className="btn" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="simulator">
      {/* Demand Selector */}
      <div className="demand-selector">
        <button
          className={selectedState === 0 ? 'active' : ''}
          onClick={() => {
            setSelectedState(0);
            setManualResult(null);
            setAiResult(null);
          }}
        >
          Low
        </button>
        <button
          className={selectedState === 1 ? 'active' : ''}
          onClick={() => {
            setSelectedState(1);
            setManualResult(null);
            setAiResult(null);
          }}
        >
          Medium
        </button>
        <button
          className={selectedState === 2 ? 'active' : ''}
          onClick={() => {
            setSelectedState(2);
            setManualResult(null);
            setAiResult(null);
          }}
        >
          High
        </button>
      </div>

      {/* Price Slider */}
      <div className="price-slider">
        <label>Price: ₹{selectedPrice}</label>
        <input
          ref={sliderRef}
          type="range"
          min="10"
          max="50"
          step="10"
          defaultValue={selectedPrice}
          onChange={(e) => {
            setSelectedPrice(Number(e.target.value));
            setManualResult(null);
            setAiResult(null);
          }}
        />
      </div>

      {/* AI Hint */}
      {trainingData && (
        <p className="ai-hint">
          🤖 AI will compare against ₹{getAIPrice()} for {['Low', 'Medium', 'High'][selectedState]} demand
        </p>
      )}

      {/* Buttons */}
      <div className="actions">
        <button
          onClick={handleSimulate}
          disabled={loading || selectedPrice === getAIPrice()}
        >
          {loading ? "Simulating..." : "Simulate"}
        </button>
        {selectedPrice === getAIPrice() && (
          <p className="warning">⚠️ Set a different price to compare with AI</p>
        )}
        <button
          disabled={!trainingData}
          onClick={() => {
            const aiPrice = getAIPrice();
            if (aiPrice !== null) {
              if (sliderRef.current) {
                sliderRef.current.value = aiPrice; // moves thumb
              }
              setSelectedPrice(aiPrice); // updates label
            }
          }}
        >
          Use AI Recommended Price
        </button>
      </div>

      {/* Comparison UI */}
      {manualResult && aiResult && (
        <div className="comparison">
          <div className="comparison-cards"> {/* Wrapper for side-by-side layout */}
            <div className={`card ${manualResult.revenue >= aiResult.revenue ? 'highlight' : ''}`}>
              <h3>Manual Pricing</h3>
              <p>Price: ₹{manualResult.price}</p>
              <p>Demand: {manualResult.demand}</p>
              <p>Revenue: ₹{manualResult.revenue}</p>
            </div>
            <div className={`card ${aiResult.revenue > manualResult.revenue ? 'highlight' : ''}`}>
              <h3>🤖 AI Pricing</h3>
              <p>Price: ₹{aiResult.price}</p>
              <p>Demand: {aiResult.demand}</p>
              <p>Revenue: ₹{aiResult.revenue}</p>
            </div>
          </div>
          <p className="difference">
            🔥 {aiResult.revenue > manualResult.revenue ? `AI earns ₹${aiResult.revenue - manualResult.revenue} more (+${((aiResult.revenue - manualResult.revenue) / manualResult.revenue * 100).toFixed(1)}%)` : `Manual earns ₹${manualResult.revenue - aiResult.revenue} more (+${((manualResult.revenue - aiResult.revenue) / aiResult.revenue * 100).toFixed(1)}%)`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Simulator;