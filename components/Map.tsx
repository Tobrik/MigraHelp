import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { getHelpCenters } from '../services/firestore';
import { HelpCenter } from '../types';
import { Card } from './ui/Card';
import { MapPin, Clock, Building2, Hospital, ShieldCheck, Scale, Loader2 } from 'lucide-react';

// Custom marker icons for different types
const createCustomIcon = (type: string) => {
  const colors = {
    mfc: '#3B82F6',      // blue for ЦОН
    hospital: '#EF4444',  // red for hospitals
    police: '#1E40AF',    // dark blue for police
    legal: '#059669',     // green for legal centers
  };

  const color = colors[type as keyof typeof colors] || '#64748B';

  return new DivIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><div style="transform: rotate(45deg); margin-top: 6px; margin-left: 8px; color: white; font-size: 14px;">📍</div></div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

export const Map: React.FC = () => {
  const almatyCenter: [number, number] = [43.238949, 76.889709];
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [helpCenters, setHelpCenters] = useState<HelpCenter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHelpCenters = async () => {
      setLoading(true);
      const data = await getHelpCenters();
      setHelpCenters(data);
      setLoading(false);
    };
    loadHelpCenters();
  }, []);

  const filteredCenters = selectedType
    ? helpCenters.filter(c => c.type === selectedType)
    : helpCenters;

  const filterButtons = [
    { type: null, label: 'Все', icon: <Building2 size={16} />, color: 'bg-slate-600' },
    { type: 'mfc', label: 'ЦОН', icon: <Building2 size={16} />, color: 'bg-blue-600' },
    { type: 'hospital', label: 'Больницы', icon: <Hospital size={16} />, color: 'bg-red-600' },
    { type: 'police', label: 'Полиция', icon: <ShieldCheck size={16} />, color: 'bg-blue-800' },
    { type: 'legal', label: 'Юридическая', icon: <Scale size={16} />, color: 'bg-green-600' },
  ];

  if (loading) {
    return (
      <div className="h-screen w-full relative z-0 flex flex-col md:pl-64 pb-16 md:pb-0 items-center justify-center">
        <Loader2 size={48} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative z-0 flex flex-col md:pl-64 pb-16 md:pb-0">
        {/* Header with Filters */}
        <div className="absolute top-4 left-4 right-4 z-[400] space-y-3">
            <Card className="p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-xl">
                <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100">Карта помощи</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {filteredCenters.length} {filteredCenters.length === 1 ? 'место' : 'мест'} в Алматы
                </p>
            </Card>

            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {filterButtons.map((btn) => (
                <button
                  key={btn.type || 'all'}
                  onClick={() => setSelectedType(btn.type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shadow-md ${
                    selectedType === btn.type
                      ? `${btn.color} text-white scale-105`
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105'
                  }`}
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>
        </div>

      <MapContainer
        center={almatyCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full outline-none"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredCenters.map((center) => (
          <Marker
            key={center.id}
            position={[center.lat, center.lng]}
            icon={createCustomIcon(center.type)}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white ${
                        center.type === 'hospital' ? 'bg-red-500' :
                        center.type === 'police' ? 'bg-blue-800' :
                        center.type === 'mfc' ? 'bg-blue-500' : 'bg-green-600'
                    }`}>
                        {center.type === 'mfc' ? 'ЦОН' :
                         center.type === 'hospital' ? 'Больница' :
                         center.type === 'police' ? 'Полиция' : 'Юридическая помощь'}
                    </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{center.name}</h3>
                <div className="flex items-start gap-2 text-xs text-slate-600 mb-1">
                    <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                    <span>{center.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} />
                    <span>{center.workingHours}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};