import React, { useState } from "react";
import { fetchTraining, fetchEvaluation } from "./api";
import RewardChart from "./components/RewardChart";
import EpsilonChart from "./components/EpsilonChart";
import EvalChart from "./components/EvalChart";
import QTableHeatmap from "./components/QTableHeatmap";
import StatCard from "./components/StatCard";
import UseCaseCard from "./components/UseCaseCard";
import Simulator from "./components/Simulator";

function App() {
  const [training, setTraining] = useState(null);
  const [evalData, setEval] = useState(null);
  const [live, setLive] = useState([]);

  const train = async () => {
    const data = await fetchTraining();
    setTraining(data);
  };

  const evaluate = async () => {
    const data = await fetchEvaluation();
    setEval(data);
  };

  const liveTrain = () => {
    const es = new EventSource("http://127.0.0.1:5000/train-stream");

    es.onmessage = (e) => {
      const d = JSON.parse(e.data);
      setLive(prev => [...prev, d]);
    };
  };

  return (
    <div className="container">

      <h1>Dynamic Pricing Dashboard</h1>

      <button className="btn" onClick={train}>Train</button>
      <button className="btn" onClick={evaluate}>Evaluate</button>
      <button className="btn" onClick={liveTrain}>Live Training</button>

      {training && (
        <>
          <div className="grid">
            <StatCard title="Final Epsilon" value={training.epsilon.slice(-1)[0].toFixed(3)} />
            <StatCard title="Avg Reward" value={(training.rewards.slice(-100).reduce((a,b)=>a+b,0)/100).toFixed(2)} />
          </div>

          <div className="grid">
            <RewardChart data={training.rewards} />
            <EpsilonChart data={training.epsilon} />
          </div>

          <QTableHeatmap Q={training.Q} />
        </>
      )}

      {evalData && (
        <div className="grid">
          <EvalChart data={evalData.eval_rewards} />
          <StatCard title="Eval Avg Reward" value={evalData.avg_reward.toFixed(2)} />
        </div>
      )}

      {live.length > 0 && (
        <div className="card">
          <h3>Live Training</h3>
          <RewardChart data={live.map(d => d.reward)} />
        </div>
      )}

      <UseCaseCard />

      <Simulator trainingData={training} />

    </div>
  );
}

export default App;