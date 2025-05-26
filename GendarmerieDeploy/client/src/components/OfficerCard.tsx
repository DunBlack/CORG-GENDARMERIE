import type { Officer } from "@shared/schema";

interface OfficerCardProps {
  officer: Officer;
  onDragStart: (officer: Officer) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}

export default function OfficerCard({ officer, onDragStart, onDragEnd, isDragging }: OfficerCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(officer);
  };

  return (
    <div 
      className={`officer-card bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-move hover:bg-blue-100 transition-colors ${
        isDragging ? 'dragging' : ''
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[hsl(var(--police-blue))] text-white rounded-full flex items-center justify-center text-sm font-medium">
          <span>{officer.initials}</span>
        </div>
        <div>
          <div className="font-medium text-gray-800">{officer.name}</div>
          <div className="text-sm text-gray-500">{officer.badge}</div>
        </div>
      </div>
    </div>
  );
}
