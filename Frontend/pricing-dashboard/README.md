# Dynamic Pricing Dashboard (Vite + React)

Frontend for the Dynamic Pricing RL system.

## Tech Stack

- React
- Vite
- React Router
- Recharts

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open the local URL shown by Vite (default: `http://localhost:5173`).

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Environment Variables

Vite exposes variables prefixed with `VITE_`.

Create a `.env` file in this folder if needed:

```bash
VITE_API_URL=https://dynamic-pricing-using-rl-yj1b.onrender.com
```

If `VITE_API_URL` is not set, the app falls back to the deployed backend URL already defined in source.
