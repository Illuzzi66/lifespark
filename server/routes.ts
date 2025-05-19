import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // No backend routes needed for this frontend-only app
  // All data is stored in localStorage and APIs are called directly from the frontend
  const httpServer = createServer(app);
  return httpServer;
}
