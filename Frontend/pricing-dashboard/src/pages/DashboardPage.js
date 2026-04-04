import React, { useState } from "react";
import { fetchTraining, fetchEvaluation } from "../api";
import RewardChart from "../components/charts/RewardChart";
import EpsilonChart from "../components/charts/EpsilonChart";
import EvalChart from "../components/charts/EvalChart";
import QTableHeatmap from "../components/QTableHeatmap";
import StatCard from "../components/StatCard";
import UseCaseCard from "../components/UseCaseCard";
import { useTraining } from "../context/TrainingContext";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const { setTrainingData } = useTraining();
  const [training, setTraining] = useState(null);
  const [evalData, setEval] = useState(null);
  const [live, setLive] = useState([]);
  const navigate = useNavigate();

  const train = async () => {
    const data = await fetchTraining();
    setTraining(data); // keeps dashboard working
    setTrainingData(data); // shares with simulator
  };

  const evaluate = async () => {
    const data = await fetchEvaluation();
    setEval(data);
  };

  const liveTrain = () => {
    const es = new EventSource("http://127.0.0.1:5000/train-stream");
    es.onmessage = (e) => {
      const d = JSON.parse(e.data);
      setLive((prev) => [...prev, d]);
    };
  };

  return (
    <div className="page-container">
      <h1>Dynamic Pricing Dashboard</h1>
      <p className="subtitle">Train your RL agent and monitor performance in real-time</p>
      <button className="btn" onClick={train}>Train</button>
      <button className="btn" onClick={evaluate}>Evaluate</button>
      <button className="btn" onClick={liveTrain}>Live Training</button>

      {training && (
        <>
          <div className="section">
            <div className="section-label">Training Metrics</div>
            <div className="grid-2">
              <StatCard title="Final Epsilon" value={training.epsilon.slice(-1)[0].toFixed(3)} />
              <StatCard title="Avg Reward (last 100)" value={(training.rewards.slice(-100).reduce((a, b) => a + b, 0) / 100).toFixed(2)} />
            </div>
          </div>

          <div className="section">
            <div className="section-label">Charts</div>
            <div className="grid-2">
              <RewardChart data={training.rewards} />
              <EpsilonChart data={training.epsilon} />
            </div>
          </div>

          <div className="section">
            <div className="section-label">Q-Table Insights</div>
            <QTableHeatmap Q={training.Q} />
          </div>

          <button className="btn" onClick={() => navigate("/simulator")}>🍕 Try the Simulator →</button>
        </>
      )}

      {evalData && (
        <div className="section">
          <div className="section-label">Evaluation Metrics</div>
          <div className="grid-2">
            <EvalChart data={evalData.eval_rewards} />
            <StatCard title="Eval Avg Reward" value={evalData.avg_reward.toFixed(2)} />
          </div>
        </div>
      )}

      {live.length > 0 && (
        <div className="section">
          <div className="section-label">Live Training</div>
          <div className="card">
            <h3>Live Training</h3>
            <RewardChart data={live.map((d) => d.reward)} />
          </div>
        </div>
      )}

      <UseCaseCard />
    </div>
  );
}

export default DashboardPage;
