import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminHeader from "../../components/super-admin/AdminHeader";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
  Breadcrumbs,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Radio,
} from "@material-tailwind/react"; // Import required components
import {
  ShoppingBagIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import buzzar_api from "../../config/api-config";
import VendorProductsTable from "../../components/super-admin/VendorProductsTable";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import VendorTransactionsTable from "../../components/super-admin/VendorTransactionsTable";

const AdminVendorProfile = () => {
  const { userId } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productList, setProductList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [orderDetailsList, setOrderDetailsList] = useState([]);
  console.log(orderList);

  // Toggle dialog
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  // Open Dialog with current status
  const handleEditStatusClick = () => {
    setSelectedStatus(storeData.is_approved ? "Approved" : "Pending");
    toggleDialog();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch vendor and user data in parallel
        const [vendorRes, customerRes] = await Promise.all([
          buzzar_api.get(`/vendors/${userId}/`),
          buzzar_api.get(`/customers/${userId}/`),
        ]);

        setStoreData(vendorRes.data);
        setUserData(customerRes.data);

        // Use vendorRes.data.vendor_id to fetch products for that vendor
        const vendorId = vendorRes.data.vendor_id;
        if (vendorId) {
          const [productsRes, ordersRes, customerRes] = await Promise.all([
            buzzar_api.get(`/products/vendor/${vendorId}`),
            buzzar_api.get(`/orders/vendor/${vendorId}/`),
            buzzar_api.get(`/customers/`),
          ]);

          // Format the price of each product to a float
          const formattedProducts = productsRes.data.map((product) => ({
            ...product,
            price: parseFloat(product.price), // Convert price to float
          }));
          setProductList(formattedProducts); // Update state with fetched products
          // Set orders
          setOrderList(ordersRes.data); // Assuming you have a state for order
          setCustomers(customerRes.data); // Assuming you have a state for customers
        } else {
          setError("Vendor ID is missing.");
        }
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (orderList.length > 0 && customers.length > 0) {
      const combined = orderList.map((order) => {
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
  }, [orderList, customers]); // Only run when both orders and customers are available

  const handleEditStatus = async () => {
    try {
      const updatedStatus = selectedStatus === "Approved";
      await buzzar_api.patch(`/vendors/${userId}/`, {
        is_approved: updatedStatus,
      });
      setStoreData((prev) => ({ ...prev, is_approved: updatedStatus }));
      toggleDialog(); // Close dialog
    } catch (err) {
      console.error("Failed to update store status:", err);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader />
        <main className="min-h-screen px-6 md:px-24 py-5 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 shadow-lg">
              <CardBody>
                <div className="flex flex-col justify-center items-center sm:flex-row gap-4">
                  <div className="h-28 w-28 rounded-full bg-gray-300 animate-pulse"></div>
                  <div className=" w-full space-y-4">
                    <div className="h-6 w-full bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-6 w-full bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-6 w-full bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-6 w-full bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="p-4 shadow-lg">
              <CardBody>
                <div className="space-y-4">
                  <div className="h-6 w-full bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-6 w-full bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-6 w-full bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-6 w-full bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              </CardBody>
            </Card>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminHeader />
        <main className="min-h-screen px-6 md:px-24 py-5 md:py-10">
          <article className="flex mt-10 w-full">
            <Card className="w-full text-center bg-[#FDF6E9]">
              <CardBody>
                <Typography
                  variant="h4"
                  className="flex flex-col justify-center items-center gap-2"
                >
                  <QuestionMarkCircleIcon className="w-20 h-20" />
                  {error}
                </Typography>
              </CardBody>
            </Card>
          </article>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen px-6 md:px-24 py-5 md:py-10">
        <Breadcrumbs className="mb-2 bg-white">
          <Link to="/admin/dashboard">
            <Typography variant="small">Dashboard</Typography>
          </Link>
          <Typography
            variant="small"
            className="cursor-default font-semibold text-[#F6962E]"
          >
            Vendor Profile
          </Typography>
        </Breadcrumbs>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4 shadow-lg">
            <CardBody>
              <div className="flex flex-col lg:flex-row w-full items-center gap-4">
                {storeData.store_logo ? (
                  <img
                    src={storeData.store_logo}
                    alt={`${storeData.store_name} logo`}
                    className="h-28 w-28 object-cover rounded-full shadow-md"
                  />
                ) : (
                  <div className="h-28 w-28 bg-gray-200 rounded-full shadow-md flex items-center justify-center">
                    <Typography variant="small" color="gray">
                      No Image
                    </Typography>
                  </div>
                )}
                <div className="w-full md:w-2/3">
                  <header className="flex items-center space-x-2">
                    <ShoppingBagIcon className="h-6 w-6 text-blue-gray-500" />
                    <Typography variant="h4" color="blue-gray">
                      Store Information
                    </Typography>
                  </header>
                  <section className="mt-2">
                    <Typography>
                      <span className="font-semibold">Store Name:</span>{" "}
                      {storeData.store_name || "N/A"}
                    </Typography>
                    <Typography>
                      <span className="font-semibold">Description:</span>{" "}
                      {storeData.store_description || "N/A"}
                    </Typography>
                    <Typography>
                      <span className="font-semibold">Email:</span>{" "}
                      {storeData.user_email}
                    </Typography>
                    <div className="flex flex-col md:flex-row items-center gap-2 mt-4">
                      {storeData.is_approved ? (
                        <Chip
                          variant="ghost"
                          color="green"
                          size="md"
                          value="Approved"
                          icon={<CheckCircleIcon className="h-5 w-5" />}
                          className="rounded-full"
                        />
                      ) : (
                        <Chip
                          variant="ghost"
                          color="red"
                          size="md"
                          value="Pending Approval"
                          icon={<XCircleIcon className="h-5 w-5" />}
                          className="rounded-full"
                        />
                      )}
                      <Button size="sm" onClick={handleEditStatusClick}>
                        Edit Store Status
                      </Button>
                    </div>
                  </section>
                </div>
              </div>
            </CardBody>
          </Card>

          <Dialog open={isDialogOpen} size="sm" handler={toggleDialog}>
            <DialogHeader>
              <Typography variant="h4">Edit Store Status</Typography>
            </DialogHeader>
            <DialogBody>
              <Typography>
                Do you want to update the store status to{" "}
                <strong>{selectedStatus}</strong>?
              </Typography>
              <div className="mt-4 flex flex-col gap-2">
                <Radio
                  name="storeStatus"
                  label="Pending"
                  value="Pending"
                  checked={selectedStatus === "Pending"}
                  color="amber"
                  onChange={() => setSelectedStatus("Pending")}
                />
                <Radio
                  name="storeStatus"
                  label="Approved"
                  value="Approved"
                  color="amber"
                  checked={selectedStatus === "Approved"}
                  onChange={() => setSelectedStatus("Approved")}
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="text" onClick={toggleDialog} className="mr-2">
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleEditStatus}>
                Confirm
              </Button>
            </DialogFooter>
          </Dialog>

          {/* User Information */}
          <Card className="p-4 shadow-lg">
            <CardBody>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-6 w-6 text-blue-gray-500" />
                <Typography variant="h4" color="blue-gray">
                  User Information
                </Typography>
              </div>
              <div className="mt-2">
                <Typography>
                  <span className="font-semibold">Name:</span>{" "}
                  {`${userData.first_name || ""} ${
                    userData.middle_name || ""
                  } ${userData.last_name || ""}`.trim() || "N/A"}
                </Typography>
                <Typography>
                  <span className="font-semibold">Email:</span>{" "}
                  {userData.user_email}
                </Typography>
                <Typography>
                  <span className="font-semibold">Department:</span>{" "}
                  {userData.user_dept || "N/A"}
                </Typography>
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="mt-10 space-y-3">
          <header>
            <Typography variant="h3">Vendor Products List</Typography>
          </header>
          <VendorProductsTable products={productList} />
        </section>

        <section className="mt-10 space-y-3">
          <header>
            <Typography variant="h3">Vendor Transactions</Typography>
          </header>
          <VendorTransactionsTable orders={orderDetailsList} />
        </section>
      </main>
    </>
  );
};

export default AdminVendorProfile;
