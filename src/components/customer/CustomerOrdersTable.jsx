import React from "react";
import { Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";

const CustomerOrdersTable = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {order.order_status}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  ₱ {order.total_amount}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-4 text-center text-sm text-gray-500 border-b"
              >
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

CustomerOrdersTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      order_status: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default CustomerOrdersTable;
