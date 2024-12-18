import { CheckCircle } from "lucide-react";
import { Button } from "@material-tailwind/react";
export default function CustomerCheckoutSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>
        <div className="space-y-4">
          {/* <button
            onClick={() => window.print()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Print Receipt
          </button> */}
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full text-white py-2 px-4 rounded-md bg-[#F6962E] transition-colors"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
