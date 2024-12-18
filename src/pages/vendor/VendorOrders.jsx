import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  ButtonGroup,
  Select,
  Option,
} from "@material-tailwind/react";
import VendorSideBar from "../../components/VendorSideBar";
import OrdersTable from "../../components/vendor/OrdersTable";
import { useAuth } from "../../context/authContext";
import buzzar_api from "../../config/api-config";

const VendorOrders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const { vendorData } = useAuth();
  const [ordersList, setOrdersList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orderDetailsList, setOrderDetailsList] = useState([]); // New array for combined data
  

  useEffect(() => {
    const fetchOrdersAndCustomers = async () => {
      try {
        const ordersResponse = await buzzar_api.get(
          `/orders/vendor/${vendorData.vendor_id}/`
        );
        const customersResponse = await buzzar_api.get(`/customers/`);

        setOrdersList(ordersResponse.data);
        setCustomers(customersResponse.data);
      } catch (error) {
        console.error("Error fetching orders or customers: ", error);
      }
    };

    fetchOrdersAndCustomers();
  }, [vendorData.vendor_id]); // Only fetch data when vendorData changes

  useEffect(() => {
    if (ordersList.length > 0 && customers.length > 0) {
      const combined = ordersList.map((order) => {
        const customer = customers.find(
          (c) => c.customer_id === order.order_details.customer
        );

        return {
          ...order,
          customer_email: customer?.user_email || "Unknown",
          customer_full_name: `${customer?.first_name || ""} ${
            customer?.middle_name || ""
          } ${customer?.last_name || ""}`.trim(),
        };
      });

      // Sort the combined data by 'created_at' field in descending order (latest first)
      const sortedCombined = combined.sort((a, b) => {
        const dateA = new Date(a.order_details.created_at);
        const dateB = new Date(b.order_details.created_at);
        return dateB - dateA; // Latest date first
      });

      setOrderDetailsList(sortedCombined);
    }
  }, [ordersList, customers]); // Only run when both orders and customers are available

  // Array of order statuses
  const statuses = ["All", "PENDING", "CONFIRMED", "DELIVERED"];

  // Filter orders based on the selected status
  const filteredOrders = orderDetailsList.filter(
    (order) =>
      statusFilter === "All" ||
      order.order_details.order_status === statusFilter
  );

  // Handle status filter change
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  return (
    <>
      <main className="flex flex-col lg:flex-row min-h-screen">
        <VendorSideBar />
        <section className="flex flex-col w-full p-6 md:p-10">
          <header>
            <Typography variant="h1">Orders</Typography>
            <Typography variant="paragraph">Welcome to your Orders</Typography>
          </header>

          <div className="mt-10 space-y-5">
            {/* Button Group for larger screens */}
            <div className="hidden sm:block">
              <ButtonGroup variant="outlined" fullWidth color="amber" size="md">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={
                      statusFilter === status ? "bg-[#F8B34B] text-white" : ""
                    }
                  >
                    {status}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            {/* Select dropdown for smaller screens */}
            <div className="block sm:hidden">
              <Select
                label="Select Status"
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e)}
              >
                {statuses.map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </div>

            <OrdersTable orders={filteredOrders} />
          </div>
        </section>
      </main>
    </>
  );
};

export default VendorOrders;
