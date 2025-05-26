import { useState, useEffect } from "react";
import DispatchHeader from "@/components/DispatchHeader";
import OfficersPanel from "@/components/OfficersPanel";
import VehicleCard from "@/components/VehicleCard";
import { useDispatchData } from "@/hooks/useDispatchData";
import type { Officer, Vehicle } from "@shared/schema";

export default function DispatchPage() {
  const { officers, vehicles, corg, isLoading, updateVehicleStatus, assignOfficerToVehicle, removeOfficerFromVehicle, assignCorg, removeCorg } = useDispatchData();
  const [draggedOfficer, setDraggedOfficer] = useState<Officer | null>(null);

  const availableOfficers = officers?.filter(officer => officer.isAvailable && !officer.isCorg) || [];

  const handleDragStart = (officer: Officer) => {
    setDraggedOfficer(officer);
  };

  const handleDragEnd = () => {
    setDraggedOfficer(null);
  };

  const handleDropOnVehicle = async (vehicleId: number, slotNumber: number) => {
    if (!draggedOfficer) return;

    try {
      await assignOfficerToVehicle.mutateAsync({
        officerId: draggedOfficer.id,
        vehicleId,
        slotNumber
      });
    } catch (error) {
      console.error("Failed to assign officer:", error);
    }
  };

  const handleDropOnCorg = async () => {
    if (!draggedOfficer) return;

    try {
      await assignCorg.mutateAsync(draggedOfficer.id);
    } catch (error) {
      console.error("Failed to assign CORG:", error);
    }
  };

  const handleRemoveOfficer = async (officerId: number) => {
    try {
      await removeOfficerFromVehicle.mutateAsync(officerId);
    } catch (error) {
      console.error("Failed to remove officer:", error);
    }
  };

  const handleRemoveCorg = async () => {
    try {
      await removeCorg.mutateAsync();
    } catch (error) {
      console.error("Failed to remove CORG:", error);
    }
  };

  const handleVehicleAction = async (vehicleId: number, action: string) => {
    let newStatus: string;
    
    switch(action) {
      case 'startPatrol':
        newStatus = 'En Patrouille';
        break;
      case 'returnBase':
        newStatus = 'Disponible';
        break;
      case 'aslMode':
        newStatus = 'ASL';
        break;
      case 'startIntervention':
        newStatus = 'En Intervention';
        break;
      default:
        return;
    }

    try {
      await updateVehicleStatus.mutateAsync({ vehicleId, status: newStatus });
    } catch (error) {
      console.error("Failed to update vehicle status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] font-sans">
      <DispatchHeader />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <OfficersPanel
            availableOfficers={availableOfficers}
            corg={corg}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDropCorg={handleDropOnCorg}
            onRemoveCorg={handleRemoveCorg}
            draggedOfficer={draggedOfficer}
          />
          
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <i className="fas fa-car mr-2 text-[hsl(var(--police-blue))]"></i>
                Véhicules de Patrouille
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicles?.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  officers={officers || []}
                  onDrop={handleDropOnVehicle}
                  onRemoveOfficer={handleRemoveOfficer}
                  onAction={handleVehicleAction}
                  draggedOfficer={draggedOfficer}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
