import React, { useEffect, useState } from "react";
import VendorSideBar from "../../components/VendorSideBar";
import { useAuth } from "../../context/authContext";
import {
  Typography,
  Card,
  CardBody,
  Button,
  ButtonGroup,
} from "@material-tailwind/react";
import { Chart } from "react-google-charts";
import {
  ShoppingCartIcon,
  CubeIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import buzzar_api from "../../config/api-config";
import { format } from "date-fns"; // For date formatting

const VendorDashboard = () => {
  const { vendorData } = useAuth();
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [chartView, setChartView] = useState("Daily"); // "Daily", "Monthly", "Yearly"
  const [chartData, setChartData] = useState([["Month", "Sales"]]); // Initial chart data

  // Function to calculate delivered total sales
  const calculateDeliveredTotal = (orders) => {
    return orders
      .filter((order) => order.order_details.order_status === "DELIVERED")
      .reduce(
        (sum, order) => sum + parseFloat(order.order_details.total_amount),
        0
      );
  };

  const calculateMonthlySales = (orders) => {
    const monthlySales = {};

    // Populate monthly sales with data from orders
    orders
      .filter((order) => order.order_details.order_status === "DELIVERED")
      .forEach((order) => {
        const month = format(
          new Date(order.order_details.created_at),
          "MMM yyyy"
        );
        const amount = parseFloat(order.order_details.total_amount);
        if (monthlySales[month]) {
          monthlySales[month] += amount;
        } else {
          monthlySales[month] = amount;
        }
      });

    // Get the current date
    const today = new Date();

    // Generate an array of the last 8 months (current month + 7 previous months)
    const months = Array.from({ length: 8 }, (_, i) =>
      format(new Date(today.getFullYear(), today.getMonth() - i, 1), "MMM yyyy")
    ).reverse(); // Reverse to display from oldest to newest

    // Ensure all months have data (fill missing months with 0 sales)
    const chartData = months.map((month) => [month, monthlySales[month] || 0]);

    // Add header for Google Chart
    return [["Month", "Sales"], ...chartData];
  };

  const calculateDailySales = (orders) => {
    const dailySales = {};
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Generate all dates from today to 7 days ago
    const dateRange = [];
    for (
      let d = new Date(sevenDaysAgo);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      dateRange.push(new Date(d)); // Push raw Date object
    }

    // Aggregate sales data by date
    orders
      .filter((order) => order.order_details.order_status === "DELIVERED")
      .forEach((order) => {
        const orderDate = format(
          new Date(order.order_details.created_at),
          "MMM dd"
        ); // Format as "December 12"
        const amount = parseFloat(order.order_details.total_amount);
        if (dailySales[orderDate]) {
          dailySales[orderDate] += amount;
        } else {
          dailySales[orderDate] = amount;
        }
      });

    // Map each date in the range to its sales or 0 if no sales
    const chartData = dateRange.map((date) => {
      const formattedDate = format(date, "MMM dd"); // Format as "December 12"
      return [formattedDate, dailySales[formattedDate] || 0];
    });

    return [["Date", "Sales"], ...chartData];
  };

  const calculateYearlySales = (orders) => {
    const yearlySales = {};

    // Populate yearly sales with data from orders
    orders
      .filter((order) => order.order_details.order_status === "DELIVERED")
      .forEach((order) => {
        const year = format(new Date(order.order_details.created_at), "yyyy");
        const amount = parseFloat(order.order_details.total_amount);
        if (yearlySales[year]) {
          yearlySales[year] += amount;
        } else {
          yearlySales[year] = amount;
        }
      });

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Generate an array of the last 5 years (current year + 4 previous years)
    const years = Array.from(
      { length: 5 },
      (_, i) => currentYear - i
    ).reverse();

    // Ensure all years have data (fill missing years with 0 sales)
    const chartData = years.map((year) => [
      year.toString(),
      yearlySales[year] || 0,
    ]);

    // Add header for Google Chart
    return [["Year", "Sales"], ...chartData];
  };

  // Example usage
  const totalDeliveredAmount = calculateDeliveredTotal(ordersData);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          buzzar_api.get(`/orders/vendor/${vendorData.vendor_id}`),
          buzzar_api.get("/products/list/owned/"),
        ]);
        setOrdersData(ordersResponse.data);
        setProductsData(productsResponse.data);

        // Update chart data based on default (Monthly)
        const salesData = calculateMonthlySales(ordersResponse.data);
        setChartData(salesData);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to fetch some data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [vendorData.vendor_id]);

  useEffect(() => {
    if (chartView === "Daily") {
      setChartData(calculateDailySales(ordersData));
    } else if (chartView === "Monthly") {
      setChartData(calculateMonthlySales(ordersData));
    } else if (chartView === "Yearly") {
      setChartData(calculateYearlySales(ordersData));
    }
  }, [chartView, ordersData]);

  return (
    <main className="flex flex-col lg:flex-row min-h-screen">
      <VendorSideBar />
      <section className="flex flex-col w-full p-6 md:p-10">
        <header>
          <Typography variant="h1">Dashboard</Typography>
          <Typography variant="paragraph">
            Welcome to your dashboard, see your latest information.
          </Typography>
        </header>

        {/* Cards Section with Icons */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 my-8">
          <Card>
            <CardBody className="flex items-center">
              <ShoppingCartIcon className="w-10 h-10 text-blue-500 mr-4" />
              <div>
                <Typography variant="h6" color="blue-gray">
                  Total Orders
                </Typography>
                {loading ? (
                  <div className="h-8 w-32 bg-gray-300 rounded-full animate-pulse" />
                ) : (
                  <Typography variant="h3" color="blue">
                    {ordersData.length}
                  </Typography>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center">
              <CubeIcon className="w-10 h-10 text-green-500 mr-4" />
              <div>
                <Typography variant="h6" color="blue-gray">
                  Total Number of Products
                </Typography>
                {loading ? (
                  <div className="h-8 w-32 bg-gray-300 rounded-full animate-pulse" />
                ) : (
                  <Typography variant="h3" color="green">
                    {productsData.length}
                  </Typography>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center">
              <BanknotesIcon className="w-10 h-10 text-red-500 mr-4" />
              <div>
                <Typography variant="h6" color="blue-gray">
                  Overall Sales (PHP)
                </Typography>
                {loading ? (
                  <div className="h-8 w-32 bg-gray-300 rounded-full animate-pulse" />
                ) : (
                  <Typography variant="h3" color="red">
                    ₱ {totalDeliveredAmount}
                  </Typography>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Loading and Error Message */}
        {loading && (
          <div className="text-center text-blue-500">
            Loading product data...
          </div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
        <section>
          {/* Button Group for Chart View */}
          <div className="flex w-full sm:w-auto">
            <ButtonGroup variant="outlined" color="amber" >
              {["Daily", "Monthly", "Yearly"].map((view) => (
                <Button
                  key={view}
                  className={
                    chartView === view ? "bg-[#F8B34B] text-white" : ""
                  }
                  onClick={() => setChartView(view)}
                >
                  {view}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          {/* Line Chart for Sales */}
          <Card className="my-2">
            <CardBody>
              <Typography variant="h5" color="blue-gray">
                {chartView} Sales
              </Typography>

              {loading ? (
                <div className="text-center text-blue-500">
                  Loading chart...
                </div>
              ) : (
                <Chart
                  chartType="LineChart"
                  width="100%"
                  height="400px"
                  data={chartData}
                  options={{
                    title: `${chartView} Sales (PHP)`,
                    hAxis: { title: chartView },
                    vAxis: { title: "Sales" },
                    legend: "none",
                    chartArea: { width: "70%", height: "70%" },
                  }}
                />
              )}
            </CardBody>
          </Card>
        </section>
      </section>
    </main>
  );
};

export default VendorDashboard;
