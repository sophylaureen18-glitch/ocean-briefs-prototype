# Ocean Briefs – platform prototype

Clickable concept prototype by WyvernAI for the tender "Ocean Briefs EU4OceanObs: development of an interactive platform" (ref. 26546-EU4OO, Lot 1).

Not an official EU4OceanObs or Mercator Ocean website. Figures are illustrative.

## Contents

- `index.html` – the whole site: home page (Europe between night and day, seven briefs) and the full Marine litter brief (`#marine-litter`).
- `geo.json` – map outline and city positions (Natural Earth, public domain), projected for the home page globe.

Static site, no build step. Deploy the repository root as-is (e.g. Vercel with framework "Other", or GitHub Pages).

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.
