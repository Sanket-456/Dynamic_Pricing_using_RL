import numpy as np
import csv
from config import OUT

def save_results_summary(rewards, epsilon_history, eval_rewards):

    summary = [
        ["Metric", "Value"],
        ["Avg Reward (last 100)", np.mean(rewards[-100:])],
        ["Max Reward", np.max(rewards)],
        ["Min Reward", np.min(rewards)],
        ["Final Epsilon", epsilon_history[-1]],
        ["Avg Evaluation Reward", np.mean(eval_rewards)],
    ]

    with open(f"{OUT}/results_summary.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(summary)

    print("Results saved.")