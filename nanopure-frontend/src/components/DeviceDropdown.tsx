import React from 'react';

type DeviceDropdownProps = {
  selected: string;
  onChange: (device: string) => void;
  devices: string[];
};

const DeviceDropdown: React.FC<DeviceDropdownProps> = ({ selected, onChange, devices }) => {
  return (
    <select
      className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={selected}
      onChange={e => onChange(e.target.value)}
    >
      {devices.map(device => (
        <option key={device} value={device}>{device}</option>
      ))}
    </select>
  );
};

export default DeviceDropdown; 