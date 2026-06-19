import express from "express";
import { getStations } from "./bysykkel.ts";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get("/api/stations", async (_req, res) => {
  try {
    const stations = await getStations();
    res.json(stations);
  } catch (err) {
    console.error("Failed to fetch stations:", err);
    res.status(502).json({ error: "Could not fetch station data from Oslo Bysykkel" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
