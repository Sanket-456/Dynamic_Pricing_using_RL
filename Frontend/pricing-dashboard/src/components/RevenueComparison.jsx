import React from 'react';
import './RevenueComparison.css';

const RevenueComparison = ({ manualPrice, manualDemand, manualRevenue, rlPrice, rlDemand, rlRevenue }) => {
  return (
    <div className="revenue-comparison">
      <div className="card manual">
        <h3>Manual Pricing</h3>
        <p>Price: ₹{manualPrice}</p>
        <p>Demand: {manualDemand.toFixed(2)}</p>
        <p className={manualRevenue > rlRevenue ? 'highlight' : ''}>
          Revenue: ₹{manualRevenue.toFixed(2)}
        </p>
      </div>

      <div className="card rl">
        <h3>RL Pricing</h3>
        <p>Price: ₹{rlPrice}</p>
        <p>Demand: {rlDemand.toFixed(2)}</p>
        <p className={rlRevenue > manualRevenue ? 'highlight' : ''}>
          Revenue: ₹{rlRevenue.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default RevenueComparison;