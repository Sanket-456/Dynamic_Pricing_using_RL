import numpy as np
from config import PRODUCTS, EPISODES, STEPS, ALPHA, GAMMA, EPSILON, EPSILON_DECAY, EPSILON_MIN

# ─────────────────────────────────────────────────
# ENVIRONMENT
# ─────────────────────────────────────────────────
class PricingEnv:
    def __init__(self, product):
        self.prices            = product["prices"]
        self.base_demand       = product["base_demand"]
        self.price_sensitivity = product["price_sensitivity"]
        self.cost_rate         = product["cost_rate"]
        self.min_demand        = product["min_demand"]
        self.state             = 1

    def reset(self):
        self.state = np.random.choice([0, 1, 2])
        return self.state

    def demand(self, price):
        base  = self.base_demand[self.state]
        noise = np.random.randint(-5, 6)
        d     = base - self.price_sensitivity * price + noise
        return max(self.min_demand, d)

    def step(self, action):
        price       = self.prices[action]
        d           = self.demand(price)
        reward      = price * d - self.cost_rate * price
        next_state  = np.random.choice([0, 1, 2])
        self.state  = next_state
        return next_state, reward


# ─────────────────────────────────────────────────
# TRAINING
# ─────────────────────────────────────────────────
def train_product(product):
    num_actions = len(product["prices"])
    Q           = np.zeros((3, num_actions))
    epsilon     = EPSILON
    env         = PricingEnv(product)

    for ep in range(EPISODES):
        state        = env.reset()
        for _ in range(STEPS):
            if np.random.rand() < epsilon:
                action = np.random.randint(num_actions)
            else:
                action = np.argmax(Q[state])

            next_state, reward = env.step(action)

            # Bellman update
            td_target        = reward + GAMMA * np.max(Q[next_state])
            td_error         = td_target - Q[state][action]
            Q[state][action] += ALPHA * td_error

            state = next_state

        epsilon = max(EPSILON_MIN, epsilon * EPSILON_DECAY)

    return Q


# ─────────────────────────────────────────────────
# MODEL STORE — Train all products at startup
# ─────────────────────────────────────────────────
print("[PriceIQ] Training RL models for all product categories...")
TRAINED_MODELS = {}

for name, product in PRODUCTS.items():
    print(f"  Training: {name}...")
    TRAINED_MODELS[name] = train_product(product)

print("[PriceIQ] All models ready.\n")


# ─────────────────────────────────────────────────
# PREDICTION ENGINE
# ─────────────────────────────────────────────────
def predict(product_name: str, demand_level: int):
    """
    Returns full prediction output for the given product + demand state.

    demand_level : 0 = Low, 1 = Medium, 2 = High

    Returns dict with:
        recommended_price  : optimal price for this demand state
        estimated_revenue  : price × estimated demand - cost
        demand_forecast    : estimated units
        all_prices         : list of all prices with Q-values + revenue estimate
        policy_table       : optimal price for all 3 states
        price_sensitivity  : label string
        model_confidence   : % based on Q-value convergence
        demand_curve       : list of {price, demand} for chart
    """
    product = PRODUCTS[product_name]
    Q       = TRAINED_MODELS[product_name]
    prices  = product["prices"]

    # ── Optimal action for requested demand state ──────────────
    best_action        = int(np.argmax(Q[demand_level]))
    recommended_price  = prices[best_action]

    # ── Compute demand estimate (deterministic — no noise) ─────
    base     = product["base_demand"][demand_level]
    est_demand = max(
        product["min_demand"],
        base - product["price_sensitivity"] * recommended_price
    )
    est_revenue = recommended_price * est_demand - product["cost_rate"] * recommended_price

    # ── All price options with their Q-values ──────────────────
    all_prices = []
    q_values   = Q[demand_level]
    max_q      = float(np.max(q_values))
    min_q      = float(np.min(q_values))

    for i, price in enumerate(prices):
        d   = max(product["min_demand"],
                  base - product["price_sensitivity"] * price)
        rev = price * d - product["cost_rate"] * price
        all_prices.append({
            "price":       price,
            "q_value":     float(q_values[i]),
            "q_norm":      float((q_values[i] - min_q) / (max_q - min_q + 1e-9)),
            "revenue_est": round(rev, 2),
            "recommended": i == best_action
        })

    # ── Policy table — optimal price per state ─────────────────
    policy_table = []
    state_labels = ["High Demand", "Medium Demand", "Low Demand"]
    state_idx    = [2, 1, 0]
    for s, label in zip(state_idx, state_labels):
        opt_action = int(np.argmax(Q[s]))
        opt_price  = prices[opt_action]
        base_s     = product["base_demand"][s]
        d_s        = max(product["min_demand"],
                         base_s - product["price_sensitivity"] * opt_price)
        rev_s      = opt_price * d_s - product["cost_rate"] * opt_price
        policy_table.append({
            "state":         label,
            "optimal_price": opt_price,
            "revenue_est":   round(rev_s, 2),
            "is_active":     s == demand_level
        })

    # ── Demand curve — all prices vs demand for chart ──────────
    demand_curve = []
    for price in prices:
        d = max(product["min_demand"],
                base - product["price_sensitivity"] * price)
        demand_curve.append({"price": price, "demand": round(d, 2)})

    # ── Sensitivity label ──────────────────────────────────────
    ps = product["price_sensitivity"]
    if ps >= 0.5:
        sensitivity_label = "High — price matters"
    elif ps >= 0.1:
        sensitivity_label = "Moderate — balanced"
    else:
        sensitivity_label = "Low — price-inelastic"

    # ── Model confidence from Q convergence ────────────────────
    q_spread       = float(np.max(Q) - np.min(Q))
    confidence_pct = min(99, int(60 + (q_spread / (q_spread + 1000)) * 39))

    return {
        "product_name":      product_name,
        "demand_level":      demand_level,
        "recommended_price": recommended_price,
        "estimated_revenue": round(est_revenue, 2),
        "demand_forecast":   round(est_demand, 1),
        "all_prices":        all_prices,
        "policy_table":      policy_table,
        "price_sensitivity": sensitivity_label,
        "model_confidence":  confidence_pct,
        "demand_curve":      demand_curve,
        "price_range":       product["price_range"]
    }
