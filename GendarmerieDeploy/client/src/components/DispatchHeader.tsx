import { useState, useEffect } from "react";

export default function DispatchHeader() {
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdate(now.toLocaleTimeString('fr-FR'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[hsl(var(--police-blue))] text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <i className="fas fa-shield-alt text-2xl"></i>
          <h1 className="text-2xl font-bold">Système de Gestion des Patrouilles</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="opacity-80">Dernière mise à jour:</span>
            <span className="font-medium ml-1">{lastUpdate}</span>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full status-indicator"></div>
        </div>
      </div>
    </header>
  );
}
