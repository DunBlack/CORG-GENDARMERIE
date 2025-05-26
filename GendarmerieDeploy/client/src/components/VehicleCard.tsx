import { useState } from "react";
import type { Officer, Vehicle } from "@shared/schema";

interface VehicleCardProps {
  vehicle: Vehicle;
  officers: Officer[];
  onDrop: (vehicleId: number, slotNumber: number) => void;
  onRemoveOfficer: (officerId: number) => void;
  onAction: (vehicleId: number, action: string) => void;
  draggedOfficer: Officer | null;
}

export default function VehicleCard({
  vehicle,
  officers,
  onDrop,
  onRemoveOfficer,
  onAction,
  draggedOfficer
}: VehicleCardProps) {
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const assignedOfficers = officers.filter(officer => officer.vehicleId === vehicle.id);
  const slot1Officer = assignedOfficers.find(officer => officer.slotNumber === 1);
  const slot2Officer = assignedOfficers.find(officer => officer.slotNumber === 2);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return { indicator: 'bg-green-500', text: 'text-green-600' };
      case 'En Patrouille':
        return { indicator: 'bg-amber-500 status-indicator', text: 'text-amber-600' };
      case 'En Intervention':
        return { indicator: 'bg-red-500 status-indicator', text: 'text-red-600' };
      case 'ASL':
        return { indicator: 'bg-blue-500 status-indicator', text: 'text-blue-600' };
      case 'Hors Service':
        return { indicator: 'bg-gray-400', text: 'text-gray-600' };
      default:
        return { indicator: 'bg-gray-400', text: 'text-gray-600' };
    }
  };

  const statusColors = getStatusColor(vehicle.status);

  const handleDragOver = (e: React.DragEvent, slotNumber: number) => {
    e.preventDefault();
    setDragOverSlot(slotNumber);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, slotNumber: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    onDrop(vehicle.id, slotNumber);
  };

  const renderOfficerSlot = (slotNumber: number, officer?: Officer) => {
    const isOccupied = !!officer;
    const isDragOver = dragOverSlot === slotNumber;

    return (
      <div
        className={`officer-slot border-2 rounded-lg p-3 transition-colors ${
          isOccupied 
            ? 'border-green-300 bg-green-50' 
            : isDragOver
              ? 'border-blue-400 bg-blue-100'
              : 'border-dashed border-gray-300 bg-gray-50'
        } ${!isOccupied ? 'text-center' : ''}`}
        onDragOver={(e) => !isOccupied && handleDragOver(e, slotNumber)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => !isOccupied && handleDrop(e, slotNumber)}
      >
        {officer ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[hsl(var(--police-blue))] text-white rounded-full flex items-center justify-center text-xs font-medium">
              <span>{officer.initials}</span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">{officer.name}</div>
              <div className="text-xs text-gray-500">{officer.badge}</div>
            </div>
            <button 
              onClick={() => onRemoveOfficer(officer.id)}
              className="text-red-500 hover:text-red-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ) : (
          <div className="text-gray-500">
            <i className="fas fa-plus-circle mb-1"></i>
            <p className="text-sm">Glissez un gendarme ici</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="vehicle-card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[hsl(var(--police-blue))] text-white rounded-lg flex items-center justify-center">
            <i className="fas fa-car text-xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{vehicle.callSign}</h3>
            <p className="text-sm text-gray-500">{vehicle.license}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${statusColors.indicator}`}></div>
          <span className={`text-sm font-medium ${statusColors.text}`}>{vehicle.status}</span>
        </div>
      </div>

      <div className="officer-slots mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Équipage (2 max)</h4>
        <div className="space-y-2">
          {renderOfficerSlot(1, slot1Officer)}
          {renderOfficerSlot(2, slot2Officer)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => onAction(vehicle.id, 'startPatrol')}
          className="action-button btn-patrol px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
        >
          <i className="fas fa-play mr-1"></i>
          Départ Patrouille
        </button>
        <button 
          onClick={() => onAction(vehicle.id, 'returnBase')}
          className="action-button btn-return px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
        >
          <i className="fas fa-home mr-1"></i>
          Retour
        </button>
        <button 
          onClick={() => onAction(vehicle.id, 'aslMode')}
          className="action-button btn-asl px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
        >
          <i className="fas fa-exclamation-triangle mr-1"></i>
          ASL
        </button>
        <button 
          onClick={() => onAction(vehicle.id, 'startIntervention')}
          className="action-button btn-intervention px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
        >
          <i className="fas fa-siren mr-1"></i>
          Intervention
        </button>
      </div>
    </div>
  );
}
