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