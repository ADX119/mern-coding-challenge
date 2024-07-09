import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionTable from "./TransactionTable";
import Statistics from "./Statistics";
import BarChartComponent from "./BarChart";
import PieChartComponent from "./PieChart";

const Combined = () => {
  const [month, setMonth] = useState(""); // Default to empty string to show all data
  const [year, setYear] = useState(""); // Default to empty string to show all data
  const [combinedData, setCombinedData] = useState({});

  useEffect(() => {
    const fetchCombinedData = async () => {
      const response = await axios.get(`http://localhost:5000/api/combined`, {
        params: { month, year },
      });
      setCombinedData(response.data);
    };
    fetchCombinedData();
  }, [month, year]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center space-x-4">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={String(i + 1).padStart(2, "0")}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Years</option>
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={String(2019 + i)}>
              {2019 + i}
            </option>
          ))}
        </select>
      </div>
      <TransactionTable month={month} year={year} />
      <Statistics month={month} year={year} />
      <BarChartComponent month={month} year={year} />
      {/* <PieChartComponent month={month} year={year} /> */}
    </div>
  );
};

export default Combined;
