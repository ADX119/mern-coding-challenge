import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionTable = ({ month, year }) => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/transactions",
        {
          params: { month, year, page, perPage },
        }
      );
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
    };
    fetchTransactions();
  }, [month, year, page]);

  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Description</th>
            <th className="py-2">Price</th>
            <th className="py-2">Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="py-2">{transaction.title}</td>
              <td className="py-2">{transaction.description}</td>
              <td className="py-2">{transaction.price}</td>
              <td className="py-2">
                {new Date(transaction.dateOfSale).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
          className="p-2 border rounded"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={transactions.length < perPage}
          className="p-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
