// src/pages/DashboardPage.js
import React, { useState, useRef } from "react";
import { useTraining } from "../context/TrainingContext";
import { evaluateModel } from "../api";
import StatCard from "../components/StatCard";
import RewardChart from "../components/charts/RewardChart";
import EpsilonChart from "../components/charts/EpsilonChart";
import EvalChart from "../components/charts/EvalChart";
import QTableHeatmap from "../components/QTableHeatmap";
import { PRICES } from "../config";

export default function DashboardPage() {
  const { trainingData, setTrainingData } = useTraining();
  const [isTraining, setIsTraining]       = useState(false);
  const [liveRewards, setLiveRewards]     = useState([]);
  const [liveEpsilon, setLiveEpsilon]     = useState([]);
  const [liveQTable, setLiveQTable]       = useState(null); // <-- Add this new state
  const [status, setStatus]               = useState("idle"); // idle | training | done | error
  const [statusMsg, setStatusMsg]         = useState("");
  const eventSourceRef                    = useRef(null);

  /* ── Derived stats ── */
  const rewards  = trainingData?.rewards  ?? liveRewards;
  const epsilons = trainingData?.epsilon ?? liveEpsilon;
  const evalData = trainingData?.eval_rewards ?? [];
  const qTable   = trainingData?.Q ?? liveQTable; // <-- Change this line

  const avgReward  = rewards.length
    ? (rewards.reduce((a, b) => a + b, 0) / rewards.length).toFixed(1)
    : "—";
  const lastReward = rewards.length ? rewards[rewards.length - 1].toFixed(1) : "—";
  const lastEps    = epsilons.length ? epsilons[epsilons.length - 1].toFixed(4) : "—";

  let bestPrice = "—";

  if (qTable && qTable.length > 0) {
    let maxQ = -Infinity;
    let bestActionIdx = -1;

    // Scan the Q-table to find the action that yields the highest overall expected reward
    qTable.forEach((stateRow) => {
      stateRow.forEach((qValue, actionIdx) => {
        if (qValue > maxQ) {
          maxQ = qValue;
          bestActionIdx = actionIdx;
        }
      });
    });

    if (bestActionIdx !== -1) {
      bestPrice = `₹${PRICES[bestActionIdx]}`;
    }
  }

  /* ── Training via SSE ── */
  const handleTrain = () => {
    if (isTraining) return;
    setIsTraining(true);
    setStatus("training");
    setStatusMsg("Connecting to training stream…");
    setLiveRewards([]);
    setLiveEpsilon([]);
    setLiveQTable(null); // <-- Add this
    setTrainingData(null);

    const es = new EventSource("http://localhost:5000/train-stream");
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.done) {
          setTrainingData(data);
          setStatus("done");
          setStatusMsg(`Training complete — ${data.rewards?.length ?? 0} episodes`);
          setIsTraining(false);
          es.close();
          handleEvaluate(data.Q);
          return;
        }
        if (data.reward !== undefined) {
          setLiveRewards((prev) => {
            const updated = [...prev, data.reward];
            return updated;
          });
        }
        if (data.epsilon !== undefined) {
          setLiveEpsilon((prev) => {
            const updated = [...prev, data.epsilon];
            return updated;
          });
        }
        // <-- Add this block to catch the live Q-Table
        if (data.q_table !== undefined) {
          setLiveQTable(data.q_table);
        }
      } catch (err) {
        console.error("Error processing stream data:", err);
      }
    };

    es.onerror = () => {
      setStatus("error");
      setStatusMsg("Connection error — is the backend running?");
      setIsTraining(false);
      es.close();
    };
  };

  const handleStop = () => {
    eventSourceRef.current?.close();
    setIsTraining(false);
    setStatus("idle");
    setStatusMsg("Stopped by user");
  };

  /* ── Evaluate ── */
  const handleEvaluate = async (passedQTable) => {
    const qToEval = passedQTable || qTable;

    if (!qToEval && !trainingData) {
        setStatusMsg("Please train the model first");
        return;
    }

    if (!qToEval) {
        console.warn("No Q-table to evaluate.");
        return;
    }

    
    setStatusMsg("Evaluating policy...");
    try {
      console.log("Evaluating Q-table:", qToEval);
      const res = await evaluateModel(qToEval); 
      console.log("Evaluation Response:", res); 
      setTrainingData((prev) => {
        const updated = prev ? { ...prev, eval_rewards: res.eval_rewards } : { eval_rewards: res.eval_rewards };
        return updated;
      });
      setStatusMsg("Evaluation complete");
    } catch (_) {
      setStatusMsg("Evaluation failed");
    } 
  };

  /* ── Status badge ── */
  const statusBadge = {
    idle:     { cls: "badge-blue",   label: "Idle" },
    training: { cls: "badge-green",  label: "Training" },
    done:     { cls: "badge-purple", label: "Complete" },
    error:    { cls: "badge-red",    label: "Error" },
  }[status];

  return (
    <div className="page-container animate-fade-in">

      {/* ── Page Header ── */}
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Training Dashboard</h1>
          <p className="subtitle">Q-Learning agent for dynamic pricing optimisation</p>
        </div>
        <span className={`badge ${statusBadge.cls}`} style={{ marginTop: 6 }}>
          {status === "training" && <span className="dot dot-green" style={{ marginRight: 4 }} />}
          {statusBadge.label}
        </span>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid-4" style={{ marginBottom: "var(--space-6)" }}>
        <StatCard
          title="Episodes"
          value={rewards.length || "—"}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-color)" }}>
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          }
          color="green"
          trend={rewards.length ? "up" : undefined}
          trendLabel={rewards.length ? `${rewards.length} run` : undefined}
          subtitle="completed"
        />
        <StatCard
          title="Avg Reward"
          value={avgReward}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-color)" }}>
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
          }
          color="blue"
          trend={avgReward !== "—" ? "up" : undefined}
          trendLabel={lastReward !== "—" ? `last ${lastReward}` : undefined}
          subtitle="per episode"
        />
        <StatCard
          title="Epsilon"
          value={lastEps}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-color)" }}>
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
            </svg>
          }
          color="amber"
          trend={lastEps !== "—" ? "down" : undefined}
          trendLabel={lastEps !== "—" ? "decaying" : undefined}
          subtitle="exploration rate"
        />
        <StatCard
          title="Best Price"
          value={bestPrice}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-color)" }}>
              <line x1="12" x2="12" y1="2" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          }
          color="purple"
          trend={bestPrice !== "—" ? "flat" : undefined}
          trendLabel={bestPrice !== "—" ? "optimal" : undefined}
          subtitle="from evaluation"
        />
      </div>

      {/* ── Main Layout: charts + controls ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: "var(--space-4)",
        alignItems: "start",
      }}>

        {/* ── Charts column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div className="grid-2">
            <RewardChart data={rewards} />
            <EpsilonChart data={epsilons} />
          </div>

          <div className="grid-2">
            <EvalChart data={evalData} />
            <QTableHeatmap Q={qTable} />
          </div>
        </div>

        {/* ── Controls sidebar ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>

          {/* Training controls */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: "var(--space-4)" }}>Training Controls</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <button
                className="btn btn-primary w-full"
                onClick={handleTrain}
                disabled={isTraining}
                style={{ justifyContent: "center" }}
              >
                {isTraining ? "⏳ Training…" : "▶ Start Training"}
              </button>

              {isTraining && (
                <button
                  className="btn btn-danger w-full"
                  onClick={handleStop}
                  style={{ justifyContent: "center" }}
                >
                  ⏹ Stop
                </button>
              )}
            </div>

            {statusMsg && (
              <div style={{
                marginTop: "var(--space-4)",
                padding: "10px 12px",
                background: "var(--bg-inset)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.76rem",
                color: status === "error" ? "var(--red-400)" : "var(--text-secondary)",
                border: `1px solid ${status === "error" ? "var(--red-border)" : "var(--border-subtle)"}`,
                fontFamily: "var(--font-mono)",
                lineHeight: 1.5,
              }}>
                {statusMsg}
              </div>
            )}
          </div>

          {/* Config panel */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: "var(--space-4)" }}>Hyperparameters</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Episodes",      value: "300" },
                { label: "Steps/Episode", value: "50" },
                { label: "Alpha (α)",     value: "0.1" },
                { label: "Gamma (γ)",     value: "0.9" },
                { label: "ε Start",       value: "1.0" },
                { label: "ε Decay",       value: "0.995" },
                { label: "ε Min",         value: "0.01" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid var(--border-subtle)",
                }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{label}</span>
                  <span style={{
                    fontSize: "0.78rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-secondary)",
                    background: "var(--bg-inset)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm)",
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reward function card */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: "var(--space-3)" }}>Reward Function</div>
            <div style={{
              background: "var(--bg-inset)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              color: "var(--green-400)",
              lineHeight: 1.7,
              border: "1px solid var(--border-subtle)",
            }}>
              <span style={{ color: "var(--text-muted)" }}>r = </span>
              price × demand<br />
              <span style={{ color: "var(--text-muted)" }}>&nbsp;&nbsp;&nbsp;− </span>
              0.1 × price<br />
              <div style={{ marginTop: 8, color: "var(--text-muted)", fontSize: "0.7rem" }}>
                demand = base[s] − 0.5·p + noise
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Responsive: stack on small screens ── */}
      <style>{`
        @media (max-width: 900px) {
          .dashboard-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}