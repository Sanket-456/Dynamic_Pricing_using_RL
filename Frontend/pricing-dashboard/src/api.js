// src/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://dynamic-pricing-using-rl-yj1b.onrender.com";

/**
 * POST /evaluate — evaluate current policy
 * Pass q_table so backend doesn't need to load from disk
 */
export async function evaluateModel(qTable = null) {
  const res = await fetch(`${API_BASE_URL}/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q_table: qTable }),
  });
  if (!res.ok) throw new Error(`Evaluate failed: ${res.status}`);
  return res.json();
}

/**
 * GET /simulate — run a simulation
 */
export async function fetchSimulation(state, price) {
  const res = await fetch(`${API_BASE_URL}/simulate?state=${state}&price=${price}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error(`Simulation failed: ${res.status}`);
  return res.json();
}

/**
 * Returns the SSE stream URL — used directly with new EventSource()
 */
export function getTrainStreamURL() {
  return `${API_BASE_URL}/train-stream`;
}