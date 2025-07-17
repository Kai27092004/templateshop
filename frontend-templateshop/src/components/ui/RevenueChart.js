import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const revenue = payload.find(p => p.dataKey === 'revenue');
    const change = payload.find(p => p.dataKey === 'percentageChange');
    return (
      <div className="p-2 bg-white border rounded shadow-lg">
        <p className="font-bold">{`Tháng ${label.replace('T', '')}`}</p>
        {revenue && <p className="text-blue-600">{`Doanh thu: ${new Intl.NumberFormat('vi-VN').format(revenue.value)} ₫`}</p>}
        {change && <p className={`font-semibold ${change.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {`Tăng trưởng: ${change.value}%`}
        </p>}
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-96">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Phân tích doanh thu</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 40, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" label={{ value: 'Doanh thu (VND)', position: 'top', offset: 20, dx: 35, fill: '#8884d8' }} tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Tăng trưởng (%)', angle: -90, position: 'insideRight', fill: '#82ca9d' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#8884d8" />
          <Line yAxisId="right" type="monotone" dataKey="percentageChange" name="Tăng trưởng" stroke="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;