import React from "react";
import Combined from "./components/Combined";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Monthly Sales Dashboard</h1>
        <Combined />
      </div>
    </div>
  );
};

export default App;
