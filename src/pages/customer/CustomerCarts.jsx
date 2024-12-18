import React, { useEffect, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import CustomerSideBar from "../../components/CustomerSideBar";
import buzzar_api from "../../config/api-config";

const CustomerCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await buzzar_api.get("/cart");
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <main className="flex flex-col lg:flex-row min-h-screen">
      <CustomerSideBar />
      <section className="flex flex-col w-full p-6 md:p-10">
        <header>
          <Typography variant="h1">Cart</Typography>
          <Typography variant="paragraph">Review your cart items</Typography>
        </header>

        <div className="mt-10 space-y-5">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Item</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700 border-b">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-b">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-b">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-b">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500 border-b"
                    >
                      Your cart is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {cartItems.length > 0 && (
            <div className="flex justify-between mt-5">
              <Typography variant="h6">Total: ${calculateTotal()}</Typography>
              <Button color="amber" size="md">
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CustomerCart;
