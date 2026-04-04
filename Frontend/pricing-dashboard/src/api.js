import axios from "axios";

const BASE = "http://127.0.0.1:5000";

export const fetchTraining = async () => {
  const res = await axios.get(`${BASE}/train`);
  return res.data;
};

export const fetchEvaluation = async () => {
  const res = await axios.get(`${BASE}/evaluate`);
  return res.data;
};

export const fetchSimulation = async (state, price) => {
  const res = await axios.get(`${BASE}/simulate`, {
    params: { state, price },
  });
  return res.data;
};