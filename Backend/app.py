# import streamlit as st
# import numpy as np
# import matplotlib.pyplot as plt

# from train import train
# from evaluate import evaluate
# from utils import rolling_avg

# st.set_page_config(page_title="Dynamic Pricing RL", layout="wide")

# st.title("📈 Dynamic Pricing using Q-Learning")

# # =============================
# # SIDEBAR CONTROLS
# # =============================
# st.sidebar.header("⚙️ Controls")

# episodes = st.sidebar.slider("Episodes", 100, 5000, 1000)
# steps = st.sidebar.slider("Steps per Episode", 10, 100, 50)

# run_btn = st.sidebar.button("🚀 Run Training")

# # =============================
# # TRAINING
# # =============================
# if run_btn:
#     st.write("### 🧠 Training in progress...")

#     # Override config dynamically (quick hack)
#     import config
#     config.EPISODES = episodes
#     config.STEPS = steps

#     Q, rewards, epsilon_hist = train()

#     st.success("Training Completed!")

#     # =============================
#     # PLOTS
#     # =============================
#     st.write("## 📊 Training Performance")

#     smooth = rolling_avg(rewards)

#     fig1, ax1 = plt.subplots()
#     ax1.plot(rewards, alpha=0.3, label="Raw")
#     ax1.plot(range(len(smooth)), smooth, label="Smoothed", linewidth=2)
#     ax1.set_title("Reward Trend")
#     ax1.legend()
#     st.pyplot(fig1)

#     fig2, ax2 = plt.subplots()
#     ax2.plot(epsilon_hist)
#     ax2.set_title("Epsilon Decay")
#     st.pyplot(fig2)

#     # =============================
#     # EVALUATION
#     # =============================
#     st.write("## 🎯 Policy Evaluation")

#     eval_rewards = evaluate(Q)

#     fig3, ax3 = plt.subplots()
#     ax3.plot(eval_rewards)
#     ax3.set_title("Evaluation Rewards")
#     st.pyplot(fig3)

#     st.metric("Avg Evaluation Reward", f"{np.mean(eval_rewards):.2f}")