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