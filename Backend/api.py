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

# =======================
# NORMAL TRAIN
# =======================
@app.route("/train", methods=["GET"])
def run_training():
    Q, rewards, epsilon = train()

    return jsonify({
        "Q": Q.tolist(),
        "rewards": rewards,
        "epsilon": epsilon
    })

# =======================
# EVALUATION
# =======================
@app.route("/evaluate", methods=["GET"])
def run_eval():
    Q, rewards, epsilon = train()
    eval_rewards = evaluate(Q)

    return jsonify({
        "eval_rewards": eval_rewards,
        "avg_reward": float(np.mean(eval_rewards))
    })

# =======================
# STREAM TRAINING (LIVE)
# =======================
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

# =======================
# SIMULATE ENDPOINT
# =======================
@app.route("/simulate", methods=["GET"])
def simulate():
    from flask import request

    # Parse query parameters
    state = int(request.args.get("state", 0))
    price = int(request.args.get("price", 10))

    # Create PricingEnv instance and set state
    env = PricingEnv()
    env.state = state

    # Calculate demand and revenue
    demand = env.demand(price)
    revenue = price * demand

    # Return response
    return jsonify({
        "state": state,
        "price": price,
        "demand": demand,
        "revenue": revenue
    })

if __name__ == "__main__":
    app.run(debug=True)