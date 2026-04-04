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