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

## Imagery (Entwicklungsstand)

- Earth by day: NASA Blue Marble Next Generation (via NASA GIBS), public domain.
- City lights: NASA Black Marble / VIIRS (via NASA GIBS), public domain.
- Close-ups per brief (`img/`): NASA Worldview / GIBS snapshots, VIIRS SNPP Corrected Reflectance (true colour); marine heatwave uses GHRSST MUR sea surface temperature anomaly. NASA imagery is free to use with credit.
- Coastlines: Natural Earth (public domain). Clouds on the globe are generated, not weather data.
- 3D satellites in the satellite section are rendered with three.js r149 (MIT licence, `vendor/three-LICENSE.txt`). Models are simplified illustrations, not engineering models.
- Real clouds on the satellite-section Earth: extracted from NASA VIIRS/MODIS true-colour mosaics of 21 June 2024 (GIBS); ocean mask derived from Blue Marble.
- Land mask `img/land.png` is pre-rendered from Natural Earth coastlines; `img/earth-day-s.jpg` is a small preview so the globe appears instantly.
