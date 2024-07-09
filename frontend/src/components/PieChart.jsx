import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";

const PieChartComponent = ({ month, year }) => {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchPieData = async () => {
      const response = await axios.get("http://localhost:5000/api/pie-chart", {
        params: { month, year },
      });
      setPieData(response.data);
    };
    fetchPieData();
  }, [month, year]);

  const data = {
    labels: pieData.map((item) => item.category),
    datasets: [
      {
        label: "Categories",
        data: pieData.map((item) => item.count),
        backgroundColor: pieData.map(
          (_, index) => `hsl(${(index * 360) / pieData.length}, 70%, 50%)`
        ),
      },
    ],
  };

  return (
    <div className="mb-4 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Pie Chart</h2>
      <Pie data={data} />
    </div>
  );
};

export default PieChartComponent;
