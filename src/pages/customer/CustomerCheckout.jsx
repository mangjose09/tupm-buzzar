import { useState, useEffect } from "react";
import { CreditCard, Truck } from "lucide-react";
import { useAuth } from "../../context/authContext";
import Header from "../../components/Header";
import { Button } from "@material-tailwind/react";
import buzzar_api from "../../config/api-config";
import CustomerCheckoutSuccess from "../../components/customer/CustomerCheckoutSuccess";

export default function CustomerCheckout() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const { user } = useAuth();

  const [orderDetails, setOrderDetails] = useState(null);
  const [specificOrderDetails, setSpecificOrderDetails] = useState(null);

  useEffect(() => {
    const storedOrderDetails = localStorage.getItem("orderDetails");
    const storedSpecificOrderDetails = localStorage.getItem(
      "specificOrderDetails"
    );

    if (storedOrderDetails) {
      setOrderDetails(JSON.parse(storedOrderDetails));
    }
    if (storedSpecificOrderDetails) {
      setSpecificOrderDetails(JSON.parse(storedSpecificOrderDetails));
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Making an API POST request using axios
      const response = await buzzar_api.post("/orders/", orderDetails);
      console.log("Order placed successfully:", response.data);
      // alert("Order placed successfully!");
      setSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderDetails || !specificOrderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {!success ? (
          <>
            <h1 className="text-3xl text-[#F6962E] font-bold mb-8">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Summary */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Product Summary</h2>
                {specificOrderDetails.order_items?.map((item, index) => (
                  <div className="flex items-center space-x-4 mb-4" key={index}>
                    <div>
                      <h3 className="font-medium">{item.product_name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">
                        Selected Variants: {item.selected_variants?.join(", ")}
                      </p>
                      <p className="text-gray-600">
                        Price: ₱{parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <hr className="my-4 border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">
                    ₱{orderDetails.total_amount}
                  </span>
                </div>
              </div>

              {/* Checkout Form */}
              <div>
                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Shipping Information */}
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Shipping Information
                    </h2>
                    <div className="space-y-2">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {user?.full_name}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {user?.email}
                      </p>
                      <p>
                        <span className="font-semibold">Department:</span>{" "}
                        {user?.user_dept}
                      </p>
                      <p>
                        <span className="font-semibold">Contact:</span>{" "}
                        {user?.contact_num}
                      </p>
                    </div>
                  </div>
                  <hr className="my-4 border-gray-200" />
                  {/* Payment Method */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Payment Method
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setPaymentMethod("cash")}
                          className={`w-1/2 py-2 px-4 rounded-lg font-semibold border text-black text-sm border-black bg-white ${
                            paymentMethod === "cash"
                              ? " bg-gray-200"
                              : " text-gray-700"
                          }`}
                        >
                          Cash
                        </Button>
                        <Button
                          disabled
                          variant="outline"
                          onClick={() => setPaymentMethod("gcash")}
                          className={`w-1/2 py-2 px-4 rounded-lg text-black text-sm border border-black bg-white font-semibold flex items-center justify-center space-x-2 ${
                            paymentMethod === "gcash"
                              ? "bg-gray-200 "
                              : " text-gray-700"
                          }`}
                        >
                          {/* GCash Icon */}
                          <img
                            src="/GCash_logo.svg.png"
                            alt="GCash"
                            className="h-5 w-15"
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`w-full bg-[#F6962E] text-white py-2 px-4 rounded-md font-medium flex items-center justify-center ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:[#f6b979]"
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Truck className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <CustomerCheckoutSuccess />
        )}
      </div>
    </>
  );
}
