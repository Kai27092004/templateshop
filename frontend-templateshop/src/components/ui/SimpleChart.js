import React from "react";

const SimpleChart = ({ data, title, type = "bar" }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  if (type === "bar") {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-600 truncate">
                {item.label}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                >
                  <span className="text-white text-xs font-medium">
                    {item.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "line") {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="h-64 relative">
          <div className="absolute inset-0 flex items-end justify-around">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div
                  className="bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-lg w-8 transition-all duration-300 hover:scale-105"
                  style={{ height: `${(item.value / maxValue) * 200}px` }}
                />
                <div className="text-xs text-gray-500 text-center w-12 truncate">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Chart type not supported</div>
      </div>
    </div>
  );
};

export default SimpleChart;
