import React, { useState } from 'react';
import axios from 'axios';
import './Simulator.css';

const Simulator = () => {
  const [state, setState] = useState(0); // 0: Low, 1: Medium, 2: High
  const [price, setPrice] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/simulate', {
        state,
        price,
      });
      setResult(response.data);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRLRecommendation = () => {
    // Placeholder for RL recommendation logic
    const recommendedPrice = 30; // Replace with Q-table logic
    setPrice(recommendedPrice);
  };

  return (
    <div className="simulator">
      <h2>Business Scenario Simulator</h2>

      <div className="controls">
        <label>
          Demand Level:
          <select value={state} onChange={(e) => setState(Number(e.target.value))}>
            <option value={0}>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
          </select>
        </label>

        <label>
          Price: {price}
          <input
            type="range"
            min="10"
            max="50"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>

        <button onClick={handleSimulate} disabled={loading}>
          {loading ? 'Simulating...' : 'Simulate'}
        </button>

        <button onClick={handleRLRecommendation} disabled={loading}>
          Use RL Recommended Price
        </button>
      </div>

      {result && (
        <div className="results">
          <h3>Results</h3>
          <p>Predicted Demand: {result.demand.toFixed(2)}</p>
          <p>Revenue: ₹{result.revenue.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default Simulator;