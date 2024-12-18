import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { DefaultPagination } from "../ui/pagination";
import { useNavigate } from "react-router-dom";
import buzzar_api from "../../config/api-config";

const VendorTransactionsTable = ({ orders }) => {
  const navigate = useNavigate();

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const rowsPerPage = 5;

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const orderStatuses = ["PENDING", "CONFIRMED", "DELIVERED"];

  useEffect(() => {
    // Sort orders by created_at date in descending order (latest first)
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = orders
      .filter(
        (order) =>
          String(order.order).toLowerCase().includes(lowercasedTerm) || // Convert number to string
          order.customer_full_name.toLowerCase().includes(lowercasedTerm) // This is fine as customer_full_name is a string
      )
      .sort((a, b) => {
        if (sortConfig.key) {
          if (sortConfig.key === "created_at") {
            const dateA = new Date(a.order_details.created_at);
            const dateB = new Date(b.order_details.created_at);
            return sortConfig.direction === "asc"
              ? dateA - dateB
              : dateB - dateA;
          }

          if (sortConfig.key === "total_amount") {
            const amountA = parseFloat(a.order_details.total_amount);
            const amountB = parseFloat(b.order_details.total_amount);
            return sortConfig.direction === "asc"
              ? amountA - amountB
              : amountB - amountA;
          }

          if (sortConfig.key === "order_status") {
            const statusA = a.order_details.order_status;
            const statusB = b.order_details.order_status;
            const indexA = orderStatuses.indexOf(statusA);
            const indexB = orderStatuses.indexOf(statusB);
            return sortConfig.direction === "asc"
              ? indexA - indexB
              : indexB - indexA;
          }

          // For other fields, compare as usual
          if (sortConfig.direction === "asc") {
            return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
          } else if (sortConfig.direction === "desc") {
            return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
          }
        }
        return 0;
      });

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset page to 1 when filtering
  }, [searchTerm, orders, sortConfig]);

  const handleSort = (columnKey) => {
    setSortConfig((prevState) => {
      if (prevState.key === columnKey) {
        if (prevState.direction === "asc") {
          return { key: columnKey, direction: "desc" };
        } else if (prevState.direction === "desc") {
          return { key: null, direction: null };
        }
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  // Open dialog and set the selected order
  const handleUpdateOrderStatus = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.order_details.order_status); // Set the current status as default
    setStatusDialogOpen(true);
  };

  // Save the updated status
  const handleSaveStatus = async () => {
    try {
      // API call to update status
      await buzzar_api.patch(`/orders/status/${selectedOrder.order}/`, {
        order_status: selectedStatus,
      });

      // Update the order's status in filteredOrders state
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order === selectedOrder.order
            ? {
                ...order,
                order_details: {
                  ...order.order_details,
                  order_status: selectedStatus,
                },
              }
            : order
        )
      );

      alert("Order status updated successfully!");
      setStatusDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const confirmDeleteOrder = (order) => {
    setOrderToDelete(order);
    setOpenDialog(true);
  };

  const handleDeleteOrder = async (order) => {
    try {
      await buzzar_api.delete(`/order/details/${order.order}`);
      setFilteredOrders((prev) =>
        prev.filter((item) => item.order !== order.order)
      );
      alert(`Successfully deleted order: ${order.order}`);
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Failed to delete order. Please try again.");
    } finally {
      setOpenDialog(false);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const handleSelectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.order));
    }
  };

  const totalFilteredOrders = filteredOrders.length;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(totalFilteredOrders / rowsPerPage);
  const formatPrice = (price) => `₱ ${price.toFixed(2)}`;

  const headers = [
    { key: "order", label: "Order ID" },
    { key: "customer_full_name", label: "Customer Name" },
    { key: "product_name", label: "Product Name" },
    { key: "quantity", label: "Quantity" },
    { key: "total_amount", label: "Total Amount" },
    { key: "order_status", label: "Status" },
    { key: "payment_method", label: "Payment Method" },
    { key: "created_at", label: "Order Date" },
    // { key: "actions", label: "Actions" },
  ];

  return (
    <section>
      <header className="flex w-full mb-5 items-center justify-between gap-2">
        <div className="w-full sm:w-[300px]">
          <Input
            label="Search Order ID or Customer Name"
            value={searchTerm}
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
            className="w-auto"
          />
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
              {headers.map(({ key, label }) => (
                <th
                  key={key}
                  className={`p-4 text-left hover:bg-gray-600 hover:text-white ${
                    key === "actions" ? "" : "cursor-pointer"
                  }`}
                  onClick={() => key !== "actions" && handleSort(key)}
                >
                  <p className="flex flex-row items-center">
                    <span>{label}</span>
                    {key !== "actions" && sortConfig.key === key && (
                      <span>
                        {sortConfig.direction === "asc" ? (
                          <ChevronDownIcon className="h-4 w-4 inline-block ml-1" />
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 inline-block ml-1" />
                        )}
                      </span>
                    )}
                  </p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {totalFilteredOrders > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 w-20">{order.order}</td> {/* Order ID */}
                  <td className="p-2 w-40">{order.customer_full_name}</td>{" "}
                  {/* Customer Name */}
                  <td className="p-2 w-40">
                    {/* <a
                      href={`/vendor/products/edit/${order.product}`} // Use the product ID in the URL
                      className="text-blue-500 underline hover:text-blue-700"
                      target="_blank" // Opens the link in a new window/tab
                      rel="noopener noreferrer" // Security feature for opening links in a new window/tab
                    > */}
                    {order.product_name} {/* Product Name */}
                    {/* </a> */}
                  </td>
                  {/* Product Name */}
                  <td className="p-2 w-16">{order.quantity}</td>{" "}
                  {/* Quantity */}
                  <td className="p-2 w-28">
                    {formatPrice(parseFloat(order.order_details.total_amount))}{" "}
                  </td>
                  {/* Total Amount */}
                  <td className="p-2 w-28">
                    {order.order_details.order_status}
                  </td>
                  {/* Status */}
                  <td className="p-2 w-28">{order.payment_method}</td>
                  <td className="p-2 w-40">
                    {new Date(
                      order.order_details.created_at
                    ).toLocaleDateString()}{" "}
                    {/* Order Date */}
                  </td>
                  {/* <td className="p-2 w-10 ">
                    <div className="flex items-center justify-center gap-x-2">
                      <IconButton
                        variant="text"
                        onClick={() => handleUpdateOrderStatus(order)}
                      >
                        <PencilIcon className="h-5 w-5 text-black" />
                      </IconButton>
                     
                    </div>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="p-4 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {totalFilteredOrders > 0 && (
        <footer className="flex flex-col-reverse md:flex-row  justify-between items-center mt-4 gap-y-2">
          <div>
            <span className="text-sm text-gray-600">
              Showing {rowsPerPage * (currentPage - 1) + 1} to{" "}
              {Math.min(rowsPerPage * currentPage, totalFilteredOrders)} of{" "}
              {totalFilteredOrders} entries
            </span>
          </div>

          <div className="mt-4 flex justify-center">
            <DefaultPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </footer>
      )}

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        handler={() => setStatusDialogOpen(false)}
        size="xs"
      >
        <DialogHeader>Update Order Status</DialogHeader>
        <DialogBody>
          <p className="mb-4">
            Update the status for order <strong>{selectedOrder?.order}</strong>:
          </p>
          <div className="w-full">
            <Select
              label="Order Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e)}
            >
              {orderStatuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setStatusDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="text"
            color="amber"
            onClick={handleSaveStatus}
            disabled={!selectedStatus}
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>

      {/* <Dialog open={openDialog} handler={() => setOpenDialog(false)} size="xs">
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete order{" "}
          {orderToDelete ? orderToDelete.order : ""}?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => handleDeleteOrder(orderToDelete)}
          >
            Delete
          </Button>
          <Button
            variant="text"
            onClick={() => setOpenDialog(false)}
            color="green"
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog> */}
    </section>
  );
};

export default VendorTransactionsTable;
