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