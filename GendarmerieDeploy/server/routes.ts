import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOfficerSchema, insertVehicleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Officer routes
  app.get("/api/officers", async (req, res) => {
    try {
      const officers = await storage.getAllOfficers();
      res.json(officers);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to get officers" });
    }
  });

  app.post("/api/officers", async (req, res) => {
    try {
      const validatedData = insertOfficerSchema.parse(req.body);
      const officer = await storage.createOfficer(validatedData);
      res.json(officer);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create officer" });
    }
  });

  app.patch("/api/officers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const officer = await storage.updateOfficer(id, req.body);
      res.json(officer);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update officer" });
    }
  });

  // Vehicle routes
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to get vehicles" });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const validatedData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(validatedData);
      res.json(vehicle);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create vehicle" });
    }
  });

  app.patch("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.updateVehicle(id, req.body);
      res.json(vehicle);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update vehicle" });
    }
  });

  // Assignment routes
  app.post("/api/assignments/vehicle", async (req, res) => {
    try {
      const { officerId, vehicleId, slotNumber } = req.body;
      const officer = await storage.assignOfficerToVehicle(
        parseInt(officerId), 
        parseInt(vehicleId), 
        parseInt(slotNumber)
      );
      res.json(officer);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to assign officer to vehicle" });
    }
  });

  app.delete("/api/assignments/vehicle/:officerId", async (req, res) => {
    try {
      const officerId = parseInt(req.params.officerId);
      const officer = await storage.removeOfficerFromVehicle(officerId);
      res.json(officer);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to remove officer from vehicle" });
    }
  });

  app.post("/api/assignments/corg", async (req, res) => {
    try {
      const { officerId } = req.body;
      const officer = await storage.assignCorg(parseInt(officerId));
      res.json(officer);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to assign CORG" });
    }
  });

  app.delete("/api/assignments/corg", async (req, res) => {
    try {
      await storage.removeCorg();
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to remove CORG" });
    }
  });

  app.get("/api/assignments/corg", async (req, res) => {
    try {
      const corg = await storage.getCorg();
      res.json(corg || null);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to get CORG" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
