import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { HyperLogLog } from "./src/lib/hll.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ephemeral Insights Store
  // In-memory daily results (In production, use a persistent store for sketches)
  const dailyResults: Record<string, HyperLogLog> = {};

  // 1. Generate a Time-Locked Token (changes every hour)
  function getCurrentToken() {
    const hourWindow = Math.floor(Date.now() / (1000 * 60 * 60));
    const secretSalt = process.env.SECRET_SALT || 'claro-ephemeral-secret';
    return {
      timestamp: hourWindow,
      token: crypto.createHash('sha256').update(secretSalt + hourWindow).digest('hex')
    };
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  /**
   * Provides the browser with a time-locked token for anonymous tracking.
   */
  app.get('/api/get-token', (req, res) => {
    res.json(getCurrentToken());
  });

  /**
   * Receives an anonymized HLL sketch from the browser and merges it into the daily aggregate.
   */
  app.post('/api/report', (req, res) => {
    const { t: timestamp, s: sketchString } = req.body;

    if (!sketchString || typeof sketchString !== 'string') {
      return res.status(400).json({ error: "Missing or invalid sketch string" });
    }

    try {
      const receivedHLL = new HyperLogLog(10);
      receivedHLL.fromString(sketchString);

      const today = new Date().toDateString();
      if (!dailyResults[today]) {
        dailyResults[today] = new HyperLogLog(10);
      }

      // Merge the user's sketch into the daily aggregate.
      dailyResults[today].merge(receivedHLL);
      
      res.status(204).send();
    } catch (error: any) {
      console.error("Error processing report:", error);
      console.error("Sketch string that caused error:", sketchString);
      if (error.stack) console.error(error.stack);
      res.status(400).send();
    }
  });

  /**
   * Returns the final, anonymized result (estimated unique views).
   */
  app.get('/api/stats', (req, res) => {
    const today = new Date().toDateString();
    const result = dailyResults[today] ? dailyResults[today].count() : 0;
    res.json({ uniqueViews: result });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
