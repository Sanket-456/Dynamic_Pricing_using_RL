# import matplotlib.pyplot as plt
# from config import OUT
# from utils import rolling_avg

# def plot_training(rewards, epsilon_history):
#     smooth = rolling_avg(rewards)

#     plt.figure(figsize=(10, 5))
#     plt.plot(rewards, alpha=0.3)
#     plt.plot(range(len(smooth)), smooth, linewidth=2)
#     plt.title("Training Reward")
#     plt.savefig(f"{OUT}/training.png")
#     plt.show()

#     plt.figure(figsize=(10, 5))
#     plt.plot(epsilon_history)
#     plt.title("Epsilon Decay")
#     plt.savefig(f"{OUT}/epsilon.png")
#     plt.show()