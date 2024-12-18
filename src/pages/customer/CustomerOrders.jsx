import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  ButtonGroup,
  Select,
  Option,
} from "@material-tailwind/react";
import CustomerSideBar from "../../components/CustomerSideBar";
import CustomerOrdersTable from "../../components/customer/CustomerOrdersTable";
import { useAuth } from "../../context/authContext";
import buzzar_api from "../../config/api-config";

const CustomerOrders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const { user } = useAuth();
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await buzzar_api.get(`/orders/user/${user.id}`);
        setOrdersList(ordersResponse.data);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, [user.id]); // Fetch orders whenever the user ID changes

  // Array of order statuses
  const statuses = ["All", "PENDING", "CONFIRMED", "DELIVERED"];

  // Filter orders based on the selected status
  const filteredOrders = ordersList.filter(
    (order) => statusFilter === "All" || order.order_status === statusFilter
  );

  // Handle status filter change
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  return (
    <>
      <main className="flex flex-col lg:flex-row min-h-screen">
        <CustomerSideBar />
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

            <CustomerOrdersTable orders={filteredOrders} />
          </div>
        </section>
      </main>
    </>
  );
};

export default CustomerOrders;
