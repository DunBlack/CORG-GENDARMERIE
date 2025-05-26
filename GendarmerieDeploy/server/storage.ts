import { 
  officers, 
  vehicles, 
  users, 
  type Officer, 
  type Vehicle, 
  type User, 
  type InsertOfficer, 
  type InsertVehicle, 
  type InsertUser 
} from "@shared/schema";

export interface IStorage {
  // User methods (existing)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Officer methods
  getAllOfficers(): Promise<Officer[]>;
  getOfficer(id: number): Promise<Officer | undefined>;
  createOfficer(officer: InsertOfficer): Promise<Officer>;
  updateOfficer(id: number, updates: Partial<Officer>): Promise<Officer>;
  deleteOfficer(id: number): Promise<void>;

  // Vehicle methods
  getAllVehicles(): Promise<Vehicle[]>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, updates: Partial<Vehicle>): Promise<Vehicle>;
  deleteVehicle(id: number): Promise<void>;

  // Assignment methods
  assignOfficerToVehicle(officerId: number, vehicleId: number, slotNumber: number): Promise<Officer>;
  removeOfficerFromVehicle(officerId: number): Promise<Officer>;
  assignCorg(officerId: number): Promise<Officer>;
  removeCorg(): Promise<void>;
  getCorg(): Promise<Officer | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private officers: Map<number, Officer>;
  private vehicles: Map<number, Vehicle>;
  private currentUserId: number;
  private currentOfficerId: number;
  private currentVehicleId: number;

  constructor() {
    this.users = new Map();
    this.officers = new Map();
    this.vehicles = new Map();
    this.currentUserId = 1;
    this.currentOfficerId = 1;
    this.currentVehicleId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Initialize vehicles
    const vehicleData = [
      { callSign: "Unité Alpha-1", license: "VH-001-GP", status: "Disponible" },
      { callSign: "Unité Bravo-2", license: "VH-002-GP", status: "En Patrouille" },
      { callSign: "Unité Charlie-3", license: "VH-003-GP", status: "En Intervention" },
      { callSign: "Unité Delta-4", license: "VH-004-GP", status: "Hors Service" },
    ];

    vehicleData.forEach(async (vehicle) => {
      await this.createVehicle(vehicle);
    });

    // Initialize officers
    const officerData = [
      { name: "Jean Dupont", badge: "Badge #1234", initials: "JD", isAvailable: true, isCorg: false },
      { name: "Marie Leblanc", badge: "Badge #1235", initials: "ML", isAvailable: true, isCorg: false },
      { name: "Pierre Martin", badge: "Badge #1236", initials: "PM", isAvailable: true, isCorg: false },
      { name: "Antoine Leroy", badge: "Badge #1237", initials: "AL", isAvailable: false, vehicleId: 2, slotNumber: 1, isCorg: false },
      { name: "Sophie Bernard", badge: "Badge #1238", initials: "SB", isAvailable: false, vehicleId: 3, slotNumber: 1, isCorg: false },
      { name: "Luc Dubois", badge: "Badge #1239", initials: "LD", isAvailable: false, vehicleId: 3, slotNumber: 2, isCorg: false },
    ];

    officerData.forEach(async (officer) => {
      await this.createOfficer(officer);
    });
  }

  // User methods (existing)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Officer methods
  async getAllOfficers(): Promise<Officer[]> {
    return Array.from(this.officers.values());
  }

  async getOfficer(id: number): Promise<Officer | undefined> {
    return this.officers.get(id);
  }

  async createOfficer(insertOfficer: InsertOfficer): Promise<Officer> {
    const id = this.currentOfficerId++;
    const officer: Officer = { ...insertOfficer, id };
    this.officers.set(id, officer);
    return officer;
  }

  async updateOfficer(id: number, updates: Partial<Officer>): Promise<Officer> {
    const officer = this.officers.get(id);
    if (!officer) {
      throw new Error(`Officer with id ${id} not found`);
    }
    const updatedOfficer = { ...officer, ...updates };
    this.officers.set(id, updatedOfficer);
    return updatedOfficer;
  }

  async deleteOfficer(id: number): Promise<void> {
    this.officers.delete(id);
  }

  // Vehicle methods
  async getAllVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const id = this.currentVehicleId++;
    const vehicle: Vehicle = { ...insertVehicle, id };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(id: number, updates: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) {
      throw new Error(`Vehicle with id ${id} not found`);
    }
    const updatedVehicle = { ...vehicle, ...updates };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    this.vehicles.delete(id);
  }

  // Assignment methods
  async assignOfficerToVehicle(officerId: number, vehicleId: number, slotNumber: number): Promise<Officer> {
    const officer = this.officers.get(officerId);
    if (!officer) {
      throw new Error(`Officer with id ${officerId} not found`);
    }

    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle with id ${vehicleId} not found`);
    }

    // Check if slot is already occupied
    const existingOfficer = Array.from(this.officers.values()).find(
      o => o.vehicleId === vehicleId && o.slotNumber === slotNumber
    );
    if (existingOfficer) {
      throw new Error(`Slot ${slotNumber} in vehicle ${vehicleId} is already occupied`);
    }

    const updatedOfficer = { 
      ...officer, 
      isAvailable: false, 
      vehicleId, 
      slotNumber,
      isCorg: false 
    };
    this.officers.set(officerId, updatedOfficer);
    return updatedOfficer;
  }

  async removeOfficerFromVehicle(officerId: number): Promise<Officer> {
    const officer = this.officers.get(officerId);
    if (!officer) {
      throw new Error(`Officer with id ${officerId} not found`);
    }

    const updatedOfficer = { 
      ...officer, 
      isAvailable: true, 
      vehicleId: null, 
      slotNumber: null,
      isCorg: false 
    };
    this.officers.set(officerId, updatedOfficer);
    return updatedOfficer;
  }

  async assignCorg(officerId: number): Promise<Officer> {
    // Remove current CORG if exists
    await this.removeCorg();

    const officer = this.officers.get(officerId);
    if (!officer) {
      throw new Error(`Officer with id ${officerId} not found`);
    }

    const updatedOfficer = { 
      ...officer, 
      isAvailable: false,
      isCorg: true,
      vehicleId: null,
      slotNumber: null
    };
    this.officers.set(officerId, updatedOfficer);
    return updatedOfficer;
  }

  async removeCorg(): Promise<void> {
    const currentCorg = Array.from(this.officers.values()).find(o => o.isCorg);
    if (currentCorg) {
      const updatedOfficer = { 
        ...currentCorg, 
        isAvailable: true,
        isCorg: false 
      };
      this.officers.set(currentCorg.id, updatedOfficer);
    }
  }

  async getCorg(): Promise<Officer | undefined> {
    return Array.from(this.officers.values()).find(o => o.isCorg);
  }
}

export const storage = new MemStorage();
