# Dynamic Pricing RL Agent with Interactive Dashboard

## 📖 Project Description
This project implements a **Dynamic Pricing system using Q-Learning Reinforcement Learning**. The agent learns optimal pricing strategies under varying demand conditions (3 states: low/medium/high demand). 

**Key Features:**
- Q-Learning agent with epsilon-greedy exploration
- Flask API for training/evaluation/live streaming
- Interactive React dashboard with real-time charts (Recharts)
- Demand simulation with stochastic elements
- Policy evaluation and result visualization
- CLI training mode

**Pricing Actions**: [10, 20, 30, 40, 50]  
**Demand States**: Base demands [20, 50, 80] + noise  
**Reward**: `price * demand - 0.1 * price` (revenue - holding cost)

## 📁 Project Structure
```
Dynamic_Pricing_RL/
├── README.md                    # This file
├── Backend/
│   ├── api.py                   # Flask API (train/evaluate endpoints)
│   ├── app.py                   # Streamlit demo (commented)
│   ├── config.py                # Hyperparameters
│   ├── env.py                   # PricingEnv Gym-like environment
│   ├── evaluate.py              # Policy evaluation
│   ├── main.py                  # CLI training script
│   ├── plot.py                  # Plot utilities
│   ├── save_results.py          # CSV/PNG result saving
│   ├── train.py                 # Q-Learning training
│   ├── utils.py                 # Helpers (rolling avg)
│   └── results/                 # Generated plots (eval_rewards.png, prices.png)
└── Frontend/
    └── pricing-dashboard/       # React 18+ CRA app
        ├── package.json         # Dependencies: recharts, axios, React 18+
        ├── public/              # Static assets
        ├── src/
        │   ├── api.js           # API calls to backend
        │   ├── App.js           # Main dashboard
        │   └── components/      # Charts, cards, UI
        │       ├── RewardChart.js
        │       ├── EpsilonChart.js
        │       ├── EvalChart.js
        │       ├── QTableHeatmap.js
        │       ├── StatCard.js
        │       ├── UseCaseCard.js
        │       ├── Loader.js
        │       ├── RevenueComparison.jsx
        │       ├── Simulator.jsx
        │       └── Simulator.css
        └── ... (standard CRA files)
```

## 🚀 Quick Start

### 1. Backend (Python)
```bash
cd Backend
pip install flask flask-cors numpy matplotlib
python api.py  # Runs on http://127.0.0.1:5000
```

**CLI Training:**
```bash
python main.py  # Trains, plots, evaluates, saves results
```

### 2. Frontend (React)
```bash
cd Frontend/pricing-dashboard
npm install
npm start  # http://localhost:3000
```

Dashboard connects automatically to backend API.

## 🧠 Core Backend Code

### config.py (Hyperparameters)
```python
import os

EPISODES = 300
STEPS = 50

ALPHA = 0.1
GAMMA = 0.9
EPSILON = 1.0
EPSILON_DECAY = 0.995
EPSILON_MIN = 0.01

PRICES = [10, 20, 30, 40, 50]

OUT = "./results"
os.makedirs(OUT, exist_ok=True)
```

### env.py (Pricing Environment)
```python
import numpy as np
from config import PRICES

class PricingEnv:
    def __init__(self):
        self.state = 1

    def reset(self):
        self.state = np.random.choice([0, 1, 2])
        return self.state

    def demand(self, price):
        base = [20, 50, 80][self.state]
        noise = np.random.randint(-5, 5)
        demand = base - 0.5 * price + noise
        return max(5, demand)

    def step(self, action):
        price = PRICES[action]
        demand = self.demand(price)
        reward = price * demand - 0.1 * price
        next_state = np.random.choice([0, 1, 2])
        return next_state, reward
```

### train.py (Q-Learning Algorithm)
```python
import numpy as np
from config import *
from env import PricingEnv

def train():
    Q = np.zeros((3, len(PRICES)))
    epsilon = EPSILON

    rewards = []
    epsilon_history = []

    env = PricingEnv()

    print("\n========== TRAINING START ==========\n")

    for ep in range(EPISODES):
        state = env.reset()
        total_reward = 0

        for _ in range(STEPS):

            if np.random.rand() < epsilon:
                action = np.random.randint(len(PRICES))
            else:
                action = np.argmax(Q[state])

            next_state, reward = env.step(action)

            Q[state][action] += ALPHA * (
                reward + GAMMA * np.max(Q[next_state]) - Q[state][action]
            )

            state = next_state
            total_reward += reward

        epsilon = max(EPSILON_MIN, epsilon * EPSILON_DECAY)

        rewards.append(total_reward)
        epsilon_history.append(epsilon)

        if (ep + 1) % 100 == 0:
            avg_last = np.mean(rewards[-100:])
            print(f"Episode {ep+1} | Avg Reward: {avg_last:.2f} | Epsilon: {epsilon:.4f}")

    print("\n========== TRAINING COMPLETE ==========\n")
    return Q, rewards, epsilon_history
```

### api.py (Flask API Endpoints)
```python
from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import time
import json
from env import PricingEnv

from train import train
from evaluate import evaluate

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Dynamic Pricing RL API running"

@app.route("/train", methods=["GET"])
def run_training():
    Q, rewards, epsilon = train()
    return jsonify({
        "Q": Q.tolist(),
        "rewards": rewards,
        "epsilon": epsilon
    })

@app.route("/evaluate", methods=["GET"])
def run_eval():
    Q, rewards, epsilon = train()
    eval_rewards = evaluate(Q)
    return jsonify({
        "eval_rewards": eval_rewards,
        "avg_reward": float(np.mean(eval_rewards))
    })

@app.route("/train-stream")
def train_stream():
    def generate():
        Q, rewards, epsilon = train()
        for i in range(len(rewards)):
            data = {
                "episode": i,
                "reward": rewards[i],
                "epsilon": epsilon[i]
            }
            yield f"data: {json.dumps(data)}\n\n"
            time.sleep(0.01)
    return app.response_class(generate(), mimetype='text/event-stream')

if __name__ == "__main__":
    app.run(debug=True)
```

### main.py (CLI Runner)
```python
from train import train
from plot import plot_training
from evaluate import evaluate
from save_results import save_results_summary
import numpy as np

if __name__ == "__main__":
    print("="*50)
    print("Dynamic Pricing using Q-Learning")
    print("="*50)

    Q, rewards, epsilon_hist = train()

    print(f"Final Avg Reward: {np.mean(rewards[-100:]):.2f}")

    plot_training(rewards, epsilon_hist)

    eval_rewards = evaluate(Q)

    save_results_summary(rewards, epsilon_hist, eval_rewards)
```

## 🖥️ Frontend React Dashboard

### package.json Excerpt (Key Dependencies)
```json
{
  "dependencies": {
    "axios": "^1.14.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "recharts": "^3.8.1"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

### src/api.js (Backend Communication)
```javascript
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
```

### src/App.js (Main Dashboard)
```javascript
import React, { useState } from "react";
import { fetchTraining, fetchEvaluation } from "./api";
import RewardChart from "./components/RewardChart";
import EpsilonChart from "./components/EpsilonChart";
import EvalChart from "./components/EvalChart";
import QTableHeatmap from "./components/QTableHeatmap";
import StatCard from "./components/StatCard";
import UseCaseCard from "./components/UseCaseCard";

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
    </div>
  );
}

export default App;
```

**Components** (excerpts):
- `RewardChart.js`, `EpsilonChart.js`, `EvalChart.js`: Recharts LineCharts
- `QTableHeatmap.js`: Q-table visualization
- `StatCard.js`: Metrics display
- `UseCaseCard.js`: Project use cases

## 📊 Sample Outputs
- Q-Table shape: (3 states × 5 prices)
- Training: ~1000+ episodes, avg reward improves over time
- Results in `Backend/results/`: prices.png, eval_rewards.png, results.csv

## 💼 Use Cases
- **E-commerce**: Dynamic pricing based on demand
- **Hospitality**: Hotel room pricing
- **Transportation**: Surge pricing simulation
- **Any price-sensitive demand scenario**



## 📈 Expected Performance
- Converges to optimal policy selecting higher prices in high-demand states
- Evaluation avg reward: ~1500+ (varies with randomness)

---

