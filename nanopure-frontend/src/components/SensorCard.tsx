import React from 'react';

type SensorCardProps = {
  label: string;
  value: number;
  unit: string;
  type: 'ph' | 'turbidity' | 'temperature';
  status: 'safe' | 'warning' | 'danger';
};

const statusColors = {
  safe: 'bg-green-200 text-green-900',
  warning: 'bg-yellow-200 text-yellow-900',
  danger: 'bg-red-200 text-red-900',
};

const SensorCard: React.FC<SensorCardProps> = ({ label, value, unit, type, status }) => {
  return (
    <div className={`rounded-lg shadow p-6 flex flex-col items-center ${statusColors[status]}`}> 
      <div className="text-lg font-semibold mb-2">{label}</div>
      <div className="text-3xl font-bold mb-1">{value} <span className="text-base font-normal">{unit}</span></div>
      <div className="uppercase text-xs tracking-wider">{type}</div>
      <div className="mt-2 text-xs font-medium">{status === 'safe' ? '✅ Safe' : status === 'warning' ? '⚠️ Warning' : '❌ Danger'}</div>
    </div>
  );
};

export default SensorCard; 