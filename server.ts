import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import yahooFinance from "yahoo-finance2";

// Configure yahoo-finance2
// suppressNotices removed

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example: Get basic quote
  app.get("/api/quote/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const quote = await yahooFinance.quote(symbol);
      res.json(quote);
    } catch (error: any) {
      console.error(`Error fetching quote for ${req.params.symbol}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Example: Get multiple quotes
  app.get("/api/quotes", async (req, res) => {
    try {
      const symbols = (req.query.symbols as string)?.split(",") || [];
      if (symbols.length === 0) {
        return res.json([]);
      }
      const quotes = await yahooFinance.quote(symbols);
      // Ensure we return an array
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
      res.json(quotesArray);
    } catch (error: any) {
      console.error(`Error fetching quotes:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Example: Get historical data
  app.get("/api/historical/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const period1 = (req.query.period1 as string) || "2023-01-01";
      const interval = (req.query.interval as any) || "1d";
      const result = await yahooFinance.historical(symbol, { period1, interval: interval });
      res.json(result);
    } catch (error: any) {
      console.error(`Error fetching historical data for ${req.params.symbol}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Example: Get chart data (often better for intra-day)
  app.get("/api/chart/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const interval = (req.query.interval as string) || "1m";
      const range = (req.query.range as string) || "1d";
      const result = await yahooFinance.chart(symbol, { interval: interval as any, range: range as any });
      res.json(result);
    } catch (error: any) {
      console.error(`Error fetching chart data for ${req.params.symbol}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
