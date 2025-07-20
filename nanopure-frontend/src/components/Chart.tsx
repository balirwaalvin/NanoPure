import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type ChartProps = {
  data: Array<any>;
  dataKey?: string;
  color?: string;
  name?: string;
};

const Chart: React.FC<ChartProps> = ({ data, dataKey, color, name }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKey ? (
          <Line type="monotone" dataKey={dataKey} stroke={color || "#2F855A"} name={name || dataKey} />
        ) : (
          <>
            <Line type="monotone" dataKey="ph" stroke="#2563eb" name="pH" />
            <Line type="monotone" dataKey="turbidity" stroke="#f59e42" name="Turbidity" />
            <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature" />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart; 