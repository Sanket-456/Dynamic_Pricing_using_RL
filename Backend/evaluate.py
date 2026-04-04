import numpy as np
import matplotlib.pyplot as plt
from config import PRICES, OUT
from env import PricingEnv

def evaluate(Q):
    Q = np.array(Q) 
    env = PricingEnv()
    state = env.reset()

    prices_selected = []
    rewards = []

    print("\n========== EVALUATION ==========\n")

    for step in range(50):
        action = np.argmax(Q[state])
        next_state, reward = env.step(action)

        price = PRICES[action]

        prices_selected.append(price)
        rewards.append(reward)

        print(f"Step {step+1}: Price={price}, Reward={reward:.2f}")
        state = next_state

    plt.figure()
    plt.plot(prices_selected)
    plt.title("Price Decisions")
    plt.savefig(f"{OUT}/prices.png")

    plt.figure()
    plt.plot(rewards)
    plt.title("Evaluation Rewards")
    plt.savefig(f"{OUT}/eval_rewards.png")

    return rewards