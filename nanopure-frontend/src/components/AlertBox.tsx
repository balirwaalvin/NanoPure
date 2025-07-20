import React from 'react';

type AlertBoxProps = {
  status: 'safe' | 'warning' | 'danger';
};

const statusMap = {
  safe: { color: 'bg-green-100 text-green-800', icon: '✅', text: 'All sensor values are safe.' },
  warning: { color: 'bg-yellow-100 text-yellow-800', icon: '⚠️', text: 'Warning: Some values are approaching unsafe levels.' },
  danger: { color: 'bg-red-100 text-red-800', icon: '❌', text: 'Danger: Unsafe water detected!' },
};

const AlertBox: React.FC<AlertBoxProps> = ({ status }) => {
  const { color, icon, text } = statusMap[status];
  return (
    <div className={`rounded-lg p-4 mb-4 flex items-center ${color}`}>
      <span className="text-2xl mr-3">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
};

export default AlertBox; 