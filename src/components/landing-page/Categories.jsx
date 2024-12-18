import React from "react";
import { Link } from "react-router-dom";
import {
  Shirt,
  Utensils,
  NotebookPen,
  Smartphone,
  Palette,
  HeartPulse,
  Sofa,
  ThumbsUp,
  Wrench,
  Volleyball,
  Ticket,
} from "lucide-react";
import {
  Button,
  Select,
  Option,
  Typography,
  Input,
  Card,
  CardBody,
  Rating,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
} from "@material-tailwind/react";
const Categories = () => {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 flex justify-center">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
          Discover Wide Range of Product Categories
        </h2>
        <Card>
          {/* <CardHeader>
                <CardTitle>Product Categories</CardTitle>
              </CardHeader> */}
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <Link
                to={`/shop?category=Fashion%20%26%20Apparel`}
                className="flex items-center p-2 border border-1 hover:bg-[#F6962E] hover:shadow-xl hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Shirt />
                </div>
                <span className="text-sm font-medium">Fashion & Apparel</span>
              </Link>

              <Link
                to={`/shop?category=Food%20%26%20Beverages`}
                className="flex items-center p-2 border border-1 hover:bg-[#F6962E] hover:shadow-xl hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Utensils />
                </div>
                <span className="text-sm font-medium">Food & Beverages</span>
              </Link>

              <Link
                to={`/shop?category=Books%20%26%20Stationary`}
                className="flex items-center p-2 border border-1 hover:bg-[#F6962E] hover:shadow-xl hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <NotebookPen />
                </div>
                <span className="text-sm font-medium">Books & Stationary</span>
              </Link>

              <Link
                to={`/shop?category=Gadgets%20%26%20Electronics`}
                className="flex items-center p-2 border border-1 hover:bg-[#F6962E] hover:shadow-xl hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Smartphone />
                </div>
                <span className="text-sm font-medium">
                  Gadgets & Electronics
                </span>
              </Link>

              <Link
                to={`/shop?category=Arts%20%26%20Crafts`}
                className="flex items-center p-2 border border-1 hover:bg-[#F6962E] hover:shadow-xl hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Palette />
                </div>
                <span className="text-sm font-medium">Arts & Crafts</span>
              </Link>

              <Link
                to={`/shop?category=Health%20%26%20Wellness`}
                className="flex items-center p-2 border border-1 hover:bg-[#F6962E] hover:shadow-xl hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <HeartPulse />
                </div>
                <span className="text-sm font-medium">Health & Wellness</span>
              </Link>

              <Link
                to={`/shop?category=Home%20%26%20Living`}
                className="flex items-center p-2 border border-1 hover:bg-[#F6962E] hover:shadow-xl hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Sofa />
                </div>
                <span className="text-sm font-medium">Home & Living</span>
              </Link>

              <Link
                to={`/shop?category=Services`}
                className="flex items-center p-2 border border-1 hover:bg-[#F6962E] hover:shadow-xl hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Wrench />
                </div>
                <span className="text-sm font-medium">Services</span>
              </Link>

              <Link
                to={`/shop?category=Sports%20%26%20Recreation`}
                className="flex items-center p-2 border border-1 hover:bg-[#F6962E] hover:shadow-xl hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Volleyball />
                </div>
                <span className="text-sm font-medium">Sports & Recreation</span>
              </Link>

              <Link
                to={`/shop?category=Events%20%26%20Tickets`}
                className="flex items-center p-2 border border-1 hover:bg-[#F6962E] hover:shadow-xl hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Ticket />
                </div>
                <span className="text-sm font-medium">Events & Tickets</span>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default Categories;
