import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const OrdersChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-96">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê đơn hàng</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis label={{ value: 'Số lượng đơn', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="value" name="Số đơn hàng" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;