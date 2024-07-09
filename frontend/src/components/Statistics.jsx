import React, { useEffect, useState } from "react";
import axios from "axios";

const Statistics = ({ month, year }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await axios.get("http://localhost:5000/api/statistics", {
        params: { month, year },
      });
      setStatistics(response.data);
    };
    fetchStatistics();
  }, [month, year]);

  return (
    <div className="mb-4 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Statistics</h2>
      <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;
