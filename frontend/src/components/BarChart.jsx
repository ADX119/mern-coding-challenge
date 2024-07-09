import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const BarChartComponent = ({ month, year }) => {
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const fetchBarData = async () => {
      const response = await axios.get("http://localhost:5000/api/bar-chart", {
        params: { month, year },
      });
      setBarData(response.data);
    };
    fetchBarData();
  }, [month, year]);

  const data = {
    labels: barData.map((item) => item.range),
    datasets: [
      {
        label: "Transactions",
        data: barData.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="mb-4 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Bar Chart</h2>
      <Bar data={data} />
    </div>
  );
};

export default BarChartComponent;
