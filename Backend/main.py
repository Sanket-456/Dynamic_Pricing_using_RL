from train import train
from evaluate import evaluate
import numpy as np

if __name__ == "__main__":
    print("="*50)
    print("Dynamic Pricing using Q-Learning")
    print("="*50)

    Q, rewards, epsilon_hist = train()

    print(f"Final Avg Reward: {np.mean(rewards[-100:]):.2f}")

    eval_rewards = evaluate(Q)
    print(f"Evaluation Avg Reward: {np.mean(eval_rewards):.2f}")